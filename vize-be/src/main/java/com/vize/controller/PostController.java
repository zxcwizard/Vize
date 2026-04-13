package com.vize.controller;

import com.vize.dto.CreatePostRequest;
import com.vize.dto.GetPostResponse;
import com.vize.repo.PostRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepository;

    @PostMapping("/img/upload")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        return file.getName();
    }

    @PostMapping
    public GetPostResponse createPost(@RequestBody @Validated CreatePostRequest post,
                                      @CookieValue(name = "guest_id", required = false) String guestId, HttpServletResponse response) {
        if (guestId == null || guestId.isEmpty()) {
            UUID uuid = UUID.randomUUID();
            Cookie cookie = new Cookie("guest_id", uuid.toString());
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            response.addCookie(cookie);
            log.info("New uuid: {}", uuid);
            return postRepository.createPost(post, uuid);
        }
        log.info("New uuid: {}", guestId);
        return postRepository.createPost(post, UUID.fromString(guestId));
    }

    @GetMapping("/count")
    public Integer countAllPosts() {
        return postRepository.countPosts();
    }

    @GetMapping("/count/{board}")
    public Integer countPostsPerBoard(@PathVariable String board) {
        return postRepository.countPostsPerBoard(board);
    }

    @GetMapping("/countToday")
    public Integer countPostsToday() {
        return postRepository.countPostsToday();
    }
}
