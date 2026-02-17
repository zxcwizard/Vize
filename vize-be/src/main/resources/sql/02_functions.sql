CREATE OR REPLACE FUNCTION create_board_sequence()
    RETURNS TRIGGER AS
$$
BEGIN
    EXECUTE 'CREATE SEQUENCE IF NOT EXISTS ' || QUOTE_IDENT(NEW.code) ||
            '_seq AS INTEGER CYCLE OWNED BY boards.code; ';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_board_seq
    AFTER INSERT
    ON boards
    FOR EACH ROW
EXECUTE FUNCTION create_board_sequence();