CREATE OR REPLACE PROCEDURE initialize_board_sequences()
    LANGUAGE plpgsql
AS $$
DECLARE
    board_name TEXT;
    board_list TEXT[] := enum_range(NULL::board_code)::text[];
BEGIN
    FOREACH board_name IN ARRAY board_list
        LOOP
            EXECUTE format('CREATE SEQUENCE IF NOT EXISTS %I_seq AS INTEGER CYCLE', board_name);
        END LOOP;
END;
$$;

CALL initialize_board_sequences();