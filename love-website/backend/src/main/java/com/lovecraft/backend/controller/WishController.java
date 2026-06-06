package com.lovecraft.backend.controller;

import com.lovecraft.backend.dto.WishRequest;
import com.lovecraft.backend.dto.WishResponse;
import com.lovecraft.backend.service.WishService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for wish CRUD operations.
 * Matches the existing Node.js API contract:
 *   POST /api/wishes    — create a wish
 *   GET  /api/wishes/:id — retrieve a wish by short ID
 */
@RestController
@RequestMapping("/api/wishes")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    /**
     * Creates a new wish, stores it in-memory, and returns the short ID + shareable URL.
     */
    @PostMapping
    public ResponseEntity<WishResponse> createWish(
            @RequestBody WishRequest wishData,
            HttpServletRequest request) {

        if (wishData.hero() == null || wishData.letter() == null) {
            throw new IllegalArgumentException("Invalid wish data");
        }

        String shortId = wishService.saveWish(wishData);

        String baseUrl = request.getScheme() + "://" + request.getServerName();
        int port = request.getServerPort();
        if ((request.getScheme().equals("http") && port != 80) ||
            (request.getScheme().equals("https") && port != 443)) {
            baseUrl += ":" + port;
        }

        String url = baseUrl + "/?id=" + shortId;
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(new WishResponse(shortId, url));
    }

    /**
     * Retrieves a wish by its short ID (case-insensitive).
     * Returns the original wish data with a 1-day cache header.
     */
    @GetMapping("/{id}")
    public ResponseEntity<WishRequest> getWish(@PathVariable String id) {
        WishRequest wish = wishService.getWish(id);
        return ResponseEntity.ok()
                .header("Cache-Control", "public, max-age=86400")
                .body(wish);
    }
}
