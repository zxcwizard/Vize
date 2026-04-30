package com.vchan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreatePostRequest(
        @NotNull
        Board board,

        @NotBlank
        String comment,

        Integer threadId,

        List<Integer> repliesTo
) {
}
