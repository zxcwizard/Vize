package com.vchan.repo;

import com.vchan.dto.Board;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.vchan.jooq.generated.public_.tables.Boards.BOARDS;

@Repository
@RequiredArgsConstructor
public class BoardRepository {

    private final DSLContext context;

    public List<Board> getBoards() {
        return context.selectFrom(BOARDS)
                .fetchInto(Board.class);
    }

}
