package com.lovecraft.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Standard error response DTO used across all error scenarios.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        String error,
        Integer retryAfter
) {
    public ErrorResponse(String error) {
        this(error, null);
    }
}
