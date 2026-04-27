package com.vchan.dto;

import java.time.LocalDateTime;

public record GetThreadCardResponse(
        Integer id,
        String name,
        String comment,
        LocalDateTime createdAt
) {
}
