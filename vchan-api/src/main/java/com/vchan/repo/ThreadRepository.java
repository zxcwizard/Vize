package com.vchan.repo;

import com.vchan.dto.*;
import com.vchan.jooq.generated.public_.enums.BoardCode;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Records;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.vchan.jooq.generated.public_.tables.PostReplies.POST_REPLIES;
import static com.vchan.jooq.generated.public_.tables.Posts.POSTS;
import static com.vchan.jooq.generated.public_.tables.Threads.THREADS;
import static org.jooq.impl.DSL.multisetAgg;
import static org.jooq.impl.DSL.select;

@SuppressWarnings("DuplicatedCode")
@Repository
@RequiredArgsConstructor
public class ThreadRepository {

    private final DSLContext context;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yy(EEE)HH:mm:ss");

    public GetFullThreadResponse getFullThread(Board board, Integer thread) {
        BoardCode boardCode = BoardCode.valueOf(board.lc_name());
        var result = context.select(
                        THREADS.ID.as("id"),
                        THREADS.NAME.as("name"),
                        multisetAgg(POSTS.ID, POSTS.COMMENT, POSTS.CREATED_AT, DSL.multiset(
                                select(POST_REPLIES.REPLY_FROM)
                                        .from(POST_REPLIES)
                                        .where(POST_REPLIES.REPLY_TO.eq(POSTS.ID).and(POST_REPLIES.BOARD.eq(POSTS.BOARD)))
                        ))
                                .orderBy(POSTS.ID.asc())
                                .convertFrom(x -> x.map(record -> new GetPostResponse(
                                        record.component1(),
                                        record.component2(),
                                        record.component3().format(formatter),
                                        record.component4().getValues(POST_REPLIES.REPLY_FROM)
                                ))))
                .from(THREADS)
                .join(POSTS).on(THREADS.ID.eq(POSTS.THREAD_ID).and(POSTS.BOARD.eq(boardCode)))
                .where(THREADS.BOARD.eq(boardCode).and(THREADS.ID.eq(thread)))
                .groupBy(THREADS.ID, THREADS.BOARD, THREADS.NAME)
                .fetchOne(Records.mapping(GetFullThreadResponse::new));
        System.out.println(result);
        return result;
    }

    public List<GetThreadCardResponse> getThreadCards(Board board) {
        BoardCode boardCode = BoardCode.valueOf(board.lc_name());
        return context.select(
                        THREADS.ID.as("id"),
                        POSTS.COMMENT.as("comment"),
                        THREADS.NAME.as("name"),
                        POSTS.CREATED_AT.as("createdAt"))
                .from(THREADS)
                .join(POSTS)
                .on(THREADS.ID.eq(POSTS.ID).and(POSTS.BOARD.eq(boardCode)))
                .where(THREADS.BOARD.eq(boardCode))
                .fetch()
                .map(Records.mapping(GetThreadCardResponse::new));
    }

    public List<GetFullThreadResponse> getThreads(Board board) {
        BoardCode boardCode = BoardCode.valueOf(board.lc_name());
        return context.select(
                        THREADS.ID.as("id"),
                        THREADS.NAME.as("name"),
                        multisetAgg(POSTS.ID, POSTS.COMMENT, POSTS.CREATED_AT, DSL.multiset(
                                select(POST_REPLIES.REPLY_FROM)
                                        .from(POST_REPLIES)
                                        .where(POST_REPLIES.REPLY_TO.eq(POSTS.ID).and(POST_REPLIES.BOARD.eq(POSTS.BOARD)))
                        ))
                                .orderBy(POSTS.ID.asc())
                                .convertFrom(x -> x.map(record -> new GetPostResponse(
                                        record.component1(),
                                        record.component2(),
                                        record.component3().format(formatter),
                                        record.component4().getValues(POST_REPLIES.REPLY_FROM)
                                ))))
                .from(THREADS)
                .join(POSTS).on(THREADS.ID.eq(POSTS.THREAD_ID).and(POSTS.BOARD.eq(boardCode)))
                .where(THREADS.BOARD.eq(boardCode))
                .groupBy(THREADS.ID, THREADS.BOARD, THREADS.NAME)
                .fetch(Records.mapping(GetFullThreadResponse::new));
    }

    public void createThread(CreateThreadRequest requestThreadDTO) {
        BoardCode boardCode = BoardCode.valueOf(requestThreadDTO.board().lc_name());
        String sequence = requestThreadDTO.board().lc_name().concat("_seq");
        var nextval = context.dsl().nextval(sequence).intValue();

        context.insertInto(THREADS, THREADS.ID, THREADS.BOARD, THREADS.NAME)
                .values(nextval, boardCode, requestThreadDTO.name())
                .execute();

        context.insertInto(POSTS, POSTS.ID, POSTS.THREAD_ID, POSTS.BOARD, POSTS.COMMENT)
                .values(nextval, nextval, boardCode, requestThreadDTO.comment())
                .execute();
    }
}
