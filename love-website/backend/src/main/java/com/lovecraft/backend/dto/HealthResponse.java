package com.lovecraft.backend.dto;

import java.time.Instant;

/**
 * Health check response DTO.
 */
public record HealthResponse(
        String status,
        String timestamp,
        int wishCount,
        int imageCacheSize
) {
    public static HealthResponse up(int wishCount, int imageCacheSize) {
        return new HealthResponse("UP", Instant.now().toString(), wishCount, imageCacheSize);
    }
}
