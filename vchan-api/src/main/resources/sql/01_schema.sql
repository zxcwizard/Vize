CREATE TYPE board_code AS ENUM ('pol', 'biz', 'mu', 'tech', 'g');

DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS post_replies CASCADE;
DROP TABLE IF EXISTS posts;

CREATE TABLE threads
(
    id    INTEGER,
    board board_code   NOT NULL,
    name  VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, board)
);

CREATE TABLE posts
(
    id         INTEGER,
    thread_id  INTEGER,
    is_op      BOOLEAN GENERATED ALWAYS AS (id = thread_id) STORED,
    board      board_code NOT NULL,
    comment    TEXT       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guest_id   UUID,
    PRIMARY KEY (id, board),
    FOREIGN KEY (thread_id, board) REFERENCES posts (id, board) ON DELETE RESTRICT
);

CREATE TABLE images
(
    id        INTEGER GENERATED ALWAYS AS IDENTITY,
    md5       VARCHAR(32) UNIQUE,
    extension VARCHAR(8),
    width     SMALLINT,
    height    SMALLINT,
    post_id   INTEGER,
    board     board_code NOT NULL,
    PRIMARY KEY (id, board),
    FOREIGN KEY (post_id, board) REFERENCES posts (id, board) ON DELETE RESTRICT
);

CREATE TABLE post_replies
(
    reply_from INTEGER,
    reply_to   INTEGER,
    board      board_code NOT NULL,
    PRIMARY KEY (reply_to, reply_from, board),
    FOREIGN KEY (reply_from, board) REFERENCES posts (id, board) ON DELETE CASCADE,
    FOREIGN KEY (reply_to, board) REFERENCES posts (id, board) ON DELETE CASCADE,
    CHECK ( reply_to < reply_from )
);

CREATE INDEX IF NOT EXISTS idx_posts_id ON posts (id);