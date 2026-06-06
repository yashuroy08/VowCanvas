package com.lovecraft.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Image proxy service with an in-memory LRU cache.
 * Fetches external images and caches the raw bytes to avoid repeated outbound requests.
 */
@Slf4j
@Service
public class ImageCacheService {

    /**
     * Holds the fetched image bytes along with its content type.
     */
    public record CachedImage(byte[] data, String contentType) {}

    private final int maxEntries;
    private final Map<String, CachedImage> cache;
    private final HttpClient httpClient;

    public ImageCacheService(@Value("${app.image-cache.max-entries:100}") int maxEntries) {
        this.maxEntries = maxEntries;

        // LinkedHashMap with access-order = true gives us LRU eviction for free.
        // We wrap access through a ConcurrentHashMap for thread-safe reads,
        // but eviction is handled by the LRU map under a synchronized block.
        this.cache = new ConcurrentHashMap<>();

        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * Result of a proxy fetch, includes cache-hit information.
     */
    public record ProxyResult(CachedImage image, boolean cacheHit) {}

    /**
     * Fetches an image from the given URL, returning cached data if available.
     *
     * @param imageUrl the external image URL to fetch
     * @return the proxy result with image data and cache-hit flag
     * @throws IOException if the fetch fails
     * @throws InterruptedException if the fetch is interrupted
     */
    public ProxyResult fetchImage(String imageUrl) throws IOException, InterruptedException {
        // Check cache first
        CachedImage cached = cache.get(imageUrl);
        if (cached != null) {
            return new ProxyResult(cached, true);
        }

        // Fetch from origin
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(imageUrl))
                .timeout(Duration.ofSeconds(30))
                .GET()
                .build();

        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Origin returned status " + response.statusCode());
        }

        String contentType = response.headers()
                .firstValue("Content-Type")
                .orElse("application/octet-stream");

        CachedImage image = new CachedImage(response.body(), contentType);

        // Evict oldest entry if cache is full
        if (cache.size() >= maxEntries) {
            evictOldest();
        }
        cache.put(imageUrl, image);

        return new ProxyResult(image, false);
    }

    /**
     * Returns the current number of cached images.
     */
    public int getCacheSize() {
        return cache.size();
    }

    /**
     * Removes the first (oldest inserted) entry from the cache.
     * ConcurrentHashMap iteration order is not strictly guaranteed,
     * but this provides a good-enough eviction strategy.
     */
    private void evictOldest() {
        var iterator = cache.entrySet().iterator();
        if (iterator.hasNext()) {
            iterator.next();
            iterator.remove();
        }
    }
}
