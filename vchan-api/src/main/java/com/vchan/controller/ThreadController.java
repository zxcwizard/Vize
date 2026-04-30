package com.vchan.controller;

import com.vchan.dto.Board;
import com.vchan.dto.CreateThreadRequest;
import com.vchan.dto.GetFullThreadResponse;
import com.vchan.repo.ThreadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("threads")
@RequiredArgsConstructor
public class ThreadController {

    private final ThreadRepository threadRepository;

    @GetMapping("/{board}")
    public ResponseEntity<List<GetFullThreadResponse>> getThreadsByBoard(@PathVariable Board board) {
        return Optional.ofNullable(threadRepository.getThreads(board))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{board}/{thread}")
    public ResponseEntity<GetFullThreadResponse> getThread(@PathVariable Board board, @PathVariable Integer thread) {
        return Optional.ofNullable(threadRepository.getFullThread(board, thread))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public void createThread(@RequestBody @Validated CreateThreadRequest threadDTO) {
        threadRepository.createThread(threadDTO);
    }
}
