DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS post_replies CASCADE;
DROP TABLE IF EXISTS posts;


CREATE TABLE boards
(
    code VARCHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE threads
(
    id         INTEGER,
    board_code VARCHAR(5)   NOT NULL REFERENCES boards (code) ON DELETE RESTRICT,
    name       VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, board_code)
);

CREATE TABLE posts
(
    id         INTEGER,
    thread_id  INTEGER,
    is_op      BOOLEAN GENERATED ALWAYS AS (id = thread_id) STORED,
    board_code VARCHAR(5) NOT NULL REFERENCES boards (code) ON DELETE RESTRICT,
    comment    TEXT       NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    guest_id   UUID,
    PRIMARY KEY (id, board_code),
    FOREIGN KEY (thread_id, board_code) REFERENCES posts (id, board_code) ON DELETE RESTRICT
);

CREATE TABLE post_replies
(
    reply_from INTEGER,
    reply_to INTEGER,
    board_code VARCHAR(5) NOT NULL REFERENCES boards (code) ON DELETE RESTRICT,
    PRIMARY KEY (reply_to, reply_from, board_code),
    FOREIGN KEY (reply_from, board_code) REFERENCES posts(id, board_code) ON DELETE CASCADE,
    FOREIGN KEY (reply_to, board_code) REFERENCES posts(id, board_code) ON DELETE CASCADE,
    CHECK ( reply_to < reply_from )
);

CREATE INDEX IF NOT EXISTS idx_posts_id ON posts (id);