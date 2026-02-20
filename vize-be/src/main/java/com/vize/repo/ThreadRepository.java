package com.vize.repo;

import com.vize.dto.CreateThreadRequest;
import com.vize.dto.GetFullThreadResponse;
import com.vize.dto.GetPostResponse;
import com.vize.dto.GetThreadCardResponse;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.jooq.Records;
import org.jooq.impl.DSL;
import org.springframework.stereotype.Repository;

import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.vize.jooq.generated.public_.tables.PostReplies.POST_REPLIES;
import static com.vize.jooq.generated.public_.tables.Posts.POSTS;
import static com.vize.jooq.generated.public_.tables.Threads.THREADS;
import static org.jooq.impl.DSL.multisetAgg;
import static org.jooq.impl.DSL.select;

@SuppressWarnings("DuplicatedCode")
@Repository
@RequiredArgsConstructor
public class ThreadRepository {

    private final DSLContext context;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yy(EEE)HH:mm:ss");

    public GetFullThreadResponse getFullThread(String board, Integer thread) {
        return context.select(
                        THREADS.ID.as("id"),
                        THREADS.NAME.as("name"),
                        multisetAgg(POSTS.ID, POSTS.COMMENT, POSTS.CREATED_AT, DSL.multiset(
                                select(POST_REPLIES.REPLY_FROM)
                                        .from(POST_REPLIES)
                                        .where(POST_REPLIES.REPLY_TO.eq(POSTS.ID).and(POST_REPLIES.BOARD_CODE.eq(POSTS.BOARD_CODE)))
                        ))
                                .orderBy(POSTS.ID.asc())
                                .convertFrom(x -> x.map(record -> new GetPostResponse(
                                        record.component1(),
                                        record.component2(),
                                        record.component3().format(formatter),
                                        record.component4().getValues(POST_REPLIES.REPLY_FROM)
                                ))))
                .from(THREADS)
                .join(POSTS).on(THREADS.ID.eq(POSTS.THREAD_ID).and(POSTS.BOARD_CODE.eq(board)))
                .where(THREADS.BOARD_CODE.eq(board).and(THREADS.ID.eq(thread)))
                .groupBy(THREADS.ID, THREADS.BOARD_CODE, THREADS.NAME)
                .fetchOne(Records.mapping(GetFullThreadResponse::new));
    }

    public List<GetThreadCardResponse> getThreadCards(String code) {
        //Order inside select must match fetch target DTO
        return context.select(
                        THREADS.ID.as("id"),
                        POSTS.COMMENT.as("comment"),
                        THREADS.NAME.as("name"),
                        POSTS.CREATED_AT.as("createdAt"))
                .from(THREADS)
                .join(POSTS)
                .on(THREADS.ID.eq(POSTS.ID).and(POSTS.BOARD_CODE.eq(code)))
                .where(THREADS.BOARD_CODE.eq(code))
                .fetch()
                .map(Records.mapping(GetThreadCardResponse::new));
    }

    public List<GetFullThreadResponse> getThreads(String code) {
        return context.select(
                        THREADS.ID.as("id"),
                        THREADS.NAME.as("name"),
                        multisetAgg(POSTS.ID, POSTS.COMMENT, POSTS.CREATED_AT, DSL.multiset(
                                select(POST_REPLIES.REPLY_FROM)
                                        .from(POST_REPLIES)
                                        .where(POST_REPLIES.REPLY_TO.eq(POSTS.ID).and(POST_REPLIES.BOARD_CODE.eq(POSTS.BOARD_CODE)))
                        ))
                                .orderBy(POSTS.ID.asc())
                                .convertFrom(x -> x.map(record -> new GetPostResponse(
                                        record.component1(),
                                        record.component2(),
                                        record.component3().format(formatter),
                                        record.component4().getValues(POST_REPLIES.REPLY_FROM)
                                ))))
                .from(THREADS)
                .join(POSTS).on(THREADS.ID.eq(POSTS.THREAD_ID).and(POSTS.BOARD_CODE.eq(code)))
                .where(THREADS.BOARD_CODE.eq(code))
                .groupBy(THREADS.ID, THREADS.BOARD_CODE, THREADS.NAME)
                .fetch(Records.mapping(GetFullThreadResponse::new));
    }

    public void createThread(CreateThreadRequest requestThreadDTO) {
        String sequence = requestThreadDTO.boardCode().concat("_seq");
        var nextval = context.dsl().nextval(sequence).intValue();

        context.insertInto(THREADS, THREADS.ID, THREADS.BOARD_CODE, THREADS.NAME)
                .values(nextval, requestThreadDTO.boardCode(), requestThreadDTO.name())
                .execute();

        context.insertInto(POSTS, POSTS.ID, POSTS.THREAD_ID, POSTS.BOARD_CODE, POSTS.COMMENT)
                .values(nextval, nextval, requestThreadDTO.boardCode(), requestThreadDTO.comment())
                .execute();
    }
}
