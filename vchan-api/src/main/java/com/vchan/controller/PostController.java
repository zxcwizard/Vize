package com.vchan.controller;

import com.vchan.dto.Board;
import com.vchan.dto.CreatePostRequest;
import com.vchan.dto.GetPostResponse;
import com.vchan.repo.PostRepository;
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
    public GetPostResponse createPost(@RequestBody @Validated CreatePostRequest post) {
        return postRepository.createPost(post, UUID.fromString(UUID.randomUUID().toString()));
    }

    @GetMapping("/count")
    public Integer countAllPosts() {
        return postRepository.countPosts();
    }

    @GetMapping("/count/{board}")
    public Integer countPostsPerBoard(@PathVariable Board board) {
        return postRepository.countPostsPerBoard(board);
    }

    @GetMapping("/countToday")
    public Integer countPostsToday() {
        return postRepository.countPostsToday();
    }
}
