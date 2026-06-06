package com.lovecraft.backend.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lovecraft.backend.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.concurrent.ConcurrentHashMap;

/**
 * IP-based rate limiter implemented as a Spring HandlerInterceptor.
 * Uses a fixed-window algorithm: tracks request count per IP within a time window.
 */
@Slf4j
@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private record RateLimitEntry(int count, long windowStart) {}

    private final ConcurrentHashMap<String, RateLimitEntry> limits = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.rate-limit.max-requests:60}")
    private int maxRequests;

    @Value("${app.rate-limit.window-ms:60000}")
    private long windowMs;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ip = resolveClientIp(request);
        long now = System.currentTimeMillis();

        RateLimitEntry entry = limits.compute(ip, (key, existing) -> {
            if (existing == null || (now - existing.windowStart()) > windowMs) {
                // New window
                return new RateLimitEntry(1, now);
            }
            // Increment within current window
            return new RateLimitEntry(existing.count() + 1, existing.windowStart());
        });

        if (entry.count() > maxRequests) {
            int retryAfter = (int) Math.ceil((windowMs - (now - entry.windowStart())) / 1000.0);
            retryAfter = Math.max(retryAfter, 1);

            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setHeader("Retry-After", String.valueOf(retryAfter));

            ErrorResponse errorResponse = new ErrorResponse(
                    "Too many requests. Please try again in a minute.",
                    retryAfter
            );
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
            return false;
        }

        return true;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
