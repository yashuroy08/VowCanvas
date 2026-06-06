package com.lovecraft.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * Flexible DTO for incoming wish creation requests.
 * Accepts the full wish JSON structure without strict typing,
 * matching the existing Node.js API contract.
 */
public record WishRequest(
        String styleTheme,
        String gridStyle,
        Map<String, Object> hero,
        List<String> reasons,
        String letter,
        List<Map<String, Object>> memories,
        List<String> promises,
        Map<String, Object> surprise
) {}
