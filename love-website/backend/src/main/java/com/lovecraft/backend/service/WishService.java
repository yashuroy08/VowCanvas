package com.lovecraft.backend.service;

import com.lovecraft.backend.dto.WishRequest;
import com.lovecraft.backend.exception.WishNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

/**
 * In-memory wish storage service.
 * Uses a ConcurrentHashMap for thread-safe wish CRUD without any database.
 */
@Service
public class WishService {

    private static final String ID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int ID_LENGTH = 6;

    /**
     * Internal wrapper that stores the wish data alongside metadata,
     * matching the Node.js format: { data: {...}, createdAt: timestamp }.
     */
    public record StoredWish(WishRequest data, long createdAt) {}

    private final ConcurrentHashMap<String, StoredWish> wishes = new ConcurrentHashMap<>();

    /**
     * Generates a unique 6-character alphanumeric uppercase short ID and stores the wish.
     *
     * @param wishData the wish payload from the client
     * @return the generated short ID
     */
    public String saveWish(WishRequest wishData) {
        String shortId;
        do {
            shortId = generateShortId();
        } while (wishes.containsKey(shortId));

        wishes.put(shortId, new StoredWish(wishData, System.currentTimeMillis()));
        return shortId;
    }

    /**
     * Retrieves a wish by its short ID (case-insensitive).
     *
     * @param id the short ID to look up
     * @return the original wish data
     * @throws WishNotFoundException if the ID does not exist
     */
    public WishRequest getWish(String id) {
        StoredWish stored = wishes.get(id.toUpperCase());
        if (stored == null) {
            throw new WishNotFoundException(id);
        }
        return stored.data();
    }

    /**
     * Returns the total number of stored wishes.
     */
    public int getWishCount() {
        return wishes.size();
    }

    private String generateShortId() {
        StringBuilder sb = new StringBuilder(ID_LENGTH);
        ThreadLocalRandom random = ThreadLocalRandom.current();
        for (int i = 0; i < ID_LENGTH; i++) {
            sb.append(ID_CHARS.charAt(random.nextInt(ID_CHARS.length())));
        }
        return sb.toString();
    }
}
