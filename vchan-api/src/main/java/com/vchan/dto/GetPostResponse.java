package com.vchan.dto;

import java.util.List;

public record GetPostResponse(
        Integer id,
        String comment,
        String createdAt,
        List<Integer> repliesFrom
) {
}
