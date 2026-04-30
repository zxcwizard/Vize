package com.vchan.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateThreadRequest(
        @NotNull
        Board board,

        @NotBlank
        String name,

        @NotBlank
        String comment
) {
}
