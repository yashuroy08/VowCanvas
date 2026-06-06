package com.lovecraft.backend.dto;

/**
 * Response DTO returned after a wish is created.
 */
public record WishResponse(
        String id,
        String url
) {}
