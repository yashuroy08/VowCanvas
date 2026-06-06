package com.lovecraft.backend.controller;

import com.lovecraft.backend.service.ImageCacheService;
import com.lovecraft.backend.service.ImageCacheService.ProxyResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Image proxy controller.
 * Fetches external images and serves them through the backend with caching.
 * This avoids CORS issues and reduces load on origin servers.
 */
@Slf4j
@RestController
@RequestMapping("/api/image-proxy")
@RequiredArgsConstructor
public class ImageProxyController {

    private final ImageCacheService imageCacheService;

    /**
     * Proxies an external image URL and caches the result in-memory.
     *
     * @param url the external image URL to fetch
     * @return the image bytes with appropriate content-type and cache headers
     */
    @GetMapping
    public ResponseEntity<byte[]> proxyImage(@RequestParam(required = false) String url) {
        if (url == null || url.isBlank()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Image URL is required".getBytes());
        }

        try {
            ProxyResult result = imageCacheService.fetchImage(url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Cache-Control", "public, max-age=31536000");
            headers.set("X-Cache", result.cacheHit() ? "HIT" : "MISS");

            // Parse the content type from the origin response
            MediaType mediaType;
            try {
                mediaType = MediaType.parseMediaType(result.image().contentType());
            } catch (Exception e) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
            headers.setContentType(mediaType);
            headers.setContentLength(result.image().data().length);

            return new ResponseEntity<>(result.image().data(), headers, HttpStatus.OK);

        } catch (Exception ex) {
            log.error("Image proxy error for URL: {}", url, ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Failed to proxy and cache image".getBytes());
        }
    }
}
