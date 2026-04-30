TRUNCATE posts RESTART IDENTITY CASCADE;
TRUNCATE threads RESTART IDENTITY CASCADE;

INSERT INTO threads (id, board, name)
VALUES (1, 'pol', 'Current Political Climate'),
       (1, 'biz', 'Market & Investment Talk'),
       (1, 'mu', 'New Music Discoveries'),
       (1, 'tech', 'Gadgets & Connectivity'),
       (1, 'g', 'Random Daily Thoughts');

INSERT INTO posts (board, id, thread_id, comment)
VALUES
    -- Politics
    ('pol', NEXTVAL('pol_seq'), 1, 'Thoughts on the recent parliamentary debate?'),
    ('pol', NEXTVAL('pol_seq'), 1, 'I read an interesting article on local election turnout.'),
    ('pol', NEXTVAL('pol_seq'), 1, 'Is anyone else concerned about the healthcare bill?'),

    -- Business
    ('biz', NEXTVAL('biz_seq'), 1, 'The market volatility this week has been wild.'),
    ('biz', NEXTVAL('biz_seq'), 1, 'Just started looking into passive income streams.'),
    ('biz', NEXTVAL('biz_seq'), 1, 'Heard about that new startup getting massive funding.'),

    -- Music
    ('mu', NEXTVAL('mu_seq'), 1, 'Discovered a fantastic new indie band today.'),
    ('mu', NEXTVAL('mu_seq'), 1, 'What album are you currently listening to on repeat?'),
    ('mu', NEXTVAL('mu_seq'), 1, 'Attended a live concert last night!'),

    -- Tech
    ('tech', NEXTVAL('tech_seq'), 1, 'My new gadget just arrived!'),
    ('tech', NEXTVAL('tech_seq'), 1, 'Anyone else having trouble with their ISP lately?'),
    ('tech', NEXTVAL('tech_seq'), 1, 'Just finished a coding project.'),

    -- General
    ('g', NEXTVAL('g_seq'), 1, 'Had the most bizarre dream last night.'),
    ('g', NEXTVAL('g_seq'), 1, 'What''s your go-to comfort food?'),
    ('g', NEXTVAL('g_seq'), 1, 'Planning a weekend trip.');