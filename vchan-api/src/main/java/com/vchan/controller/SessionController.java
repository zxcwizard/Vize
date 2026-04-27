package com.vchan.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class SessionController {

    @GetMapping("cookie")
    public ResponseEntity<Void> createPost(@CookieValue(name = "guest_id", required = false) String guestId, HttpServletResponse response) {
        if (guestId == null || guestId.trim().isEmpty()) {
            UUID uuid = UUID.randomUUID();
            Cookie cookie = new Cookie("guest_id", uuid.toString());
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setAttribute("SameSite", "Lax");
            response.addCookie(cookie);
        }
        return ResponseEntity.ok().build();
    }
}
