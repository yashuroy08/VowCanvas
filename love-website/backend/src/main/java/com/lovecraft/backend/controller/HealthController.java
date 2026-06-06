package com.lovecraft.backend.controller;

import com.lovecraft.backend.dto.HealthResponse;
import com.lovecraft.backend.service.ImageCacheService;
import com.lovecraft.backend.service.WishService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check endpoint for monitoring and uptime checks.
 */
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final WishService wishService;
    private final ImageCacheService imageCacheService;

    @GetMapping
    public HealthResponse health() {
        return HealthResponse.up(
                wishService.getWishCount(),
                imageCacheService.getCacheSize()
        );
    }
}
