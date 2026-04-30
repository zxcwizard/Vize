package com.vchan.repo;

import com.vchan.dto.Board;
import com.vchan.dto.CreatePostRequest;
import com.vchan.dto.GetPostResponse;
import com.vchan.jooq.generated.public_.enums.BoardCode;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

import static com.vchan.jooq.generated.public_.tables.PostReplies.POST_REPLIES;
import static com.vchan.jooq.generated.public_.tables.Posts.POSTS;

@Repository
@RequiredArgsConstructor
public class PostRepository {

    private final DSLContext context;

    public Integer countPosts() {
        return context.fetchCount(POSTS);
    }

    public Integer countPostsPerBoard(Board board) {
        return context.fetchCount(POSTS, POSTS.BOARD.eq(BoardCode.valueOf(board.lc_name())));
    }

    public Integer countPostsToday() {
        Field<LocalDate> date = DSL.field(DSL.name("posts", "created_at"), LocalDate.class);
        return context.fetchCount(POSTS, DSL.localDate(POSTS.CREATED_AT.cast(date)).eq(LocalDate.now()));
    }

    public GetPostResponse createPost(CreatePostRequest post, UUID uuid) {
        BoardCode board = BoardCode.valueOf(post.board().lc_name());
        String sequence = post.board().lc_name().concat("_seq");
        var nextval = context.dsl().nextval(sequence).intValue();

        var newPost = context.insertInto(POSTS, POSTS.ID, POSTS.BOARD, POSTS.THREAD_ID, POSTS.COMMENT, POSTS.GUEST_ID)
                .values(nextval, board, post.threadId(), post.comment(), uuid)
                .returningResult(POSTS.ID, POSTS.COMMENT,
                        DSL.field("to_char({0}, 'MM/DD/YY(Dy)HH24:MI:SS')", String.class, POSTS.CREATED_AT).as("created_at"),
                        DSL.inline(new Integer[0]).as("replies_from"))
                .fetchOneInto(GetPostResponse.class);

        if (newPost != null && newPost.id() != null)
            for (Integer replyToId : post.repliesTo()) {
                context.insertInto(POST_REPLIES, POST_REPLIES.REPLY_FROM, POST_REPLIES.REPLY_TO, POST_REPLIES.BOARD)
                        .values(newPost.id(), replyToId, board)
                        .execute();
            }
        return newPost;
    }
}