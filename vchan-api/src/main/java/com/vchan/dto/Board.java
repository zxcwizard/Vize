package com.vchan.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Board {
    POL,
    BIZ,
    MU,
    TECH,
    G;

    @JsonCreator
    public static Board from(String string) {
        return Board.valueOf(string.trim().toUpperCase());
    }

    @JsonValue
    public String lc_name() {
        return this.name().toLowerCase();
    }
}
