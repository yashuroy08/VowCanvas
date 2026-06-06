package com.lovecraft.backend.exception;

/**
 * Thrown when a wish is not found by its short ID.
 */
public class WishNotFoundException extends RuntimeException {

    public WishNotFoundException(String id) {
        super("Wish not found: " + id);
    }
}
