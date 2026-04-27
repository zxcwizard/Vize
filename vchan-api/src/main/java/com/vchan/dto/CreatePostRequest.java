package com.vchan.dto;

import com.vchan.validation.ExistingBoard;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record CreatePostRequest(
        @NotBlank
        @ExistingBoard
        String board,

        @NotBlank
        String comment,

        Integer threadId,

        List<Integer> repliesTo
) {
}
