TRUNCATE posts RESTART IDENTITY CASCADE;
TRUNCATE boards RESTART IDENTITY CASCADE;
TRUNCATE threads RESTART IDENTITY CASCADE;

INSERT INTO boards (code, name)
VALUES ('pol', 'Politics'),
       ('biz', 'Business & Finance'),
       ('mu', 'Music'),
       ('tech', 'Technology'),
       ('g', 'General Discussion'),
       ('test', 'Escape Board');

INSERT INTO threads (id, board_code, name)
VALUES (1, 'pol', 'Current Political Climate'),
       (1, 'biz', 'Market & Investment Talk'),
       (1, 'mu', 'New Music Discoveries'),
       (1, 'tech', 'Gadgets & Connectivity'),
       (1, 'g', 'Random Daily Thoughts');

INSERT INTO posts (board_code, id, thread_id, comment)
VALUES ('pol', NEXTVAL('pol_seq'), 1,
        'Thoughts on the recent parliamentary debate? Seems like a lot of back and forth.'),
       ('pol', NEXTVAL('pol_seq'), 1,
        'I read an interesting article on local election turnout. What are your predictions for next year?'),
       ('pol', NEXTVAL('pol_seq'), 1, 'Is anyone else concerned about the proposed changes to the healthcare bill?'),

       ('biz', NEXTVAL('biz_seq'), 1, 'The market volatility this week has been wild. Anyone making big moves?'),
       ('biz', NEXTVAL('biz_seq'), 1,
        'Just started looking into passive income streams. Any success stories or warnings?'),
       ('biz', NEXTVAL('biz_seq'), 1,
        'Heard about that new startup getting massive funding. What do you think of their business model?'),

       ('mu', NEXTVAL('mu_seq'), 1, 'Discovered a fantastic new indie band today. Their sound is so unique!'),
       ('mu', NEXTVAL('mu_seq'), 1,
        'What album are you currently listening to on repeat? Need some new recommendations.'),
       ('mu', NEXTVAL('mu_seq'), 1,
        'Attended a live concert last night; the energy was incredible!'),

       ('tech', NEXTVAL('tech_seq'), 1,
        'My new gadget just arrived! Still figuring out all the features, but it''s pretty cool.'),
       ('tech', NEXTVAL('tech_seq'), 1,
        'Anyone else having trouble with their internet provider lately? Connection keeps dropping.'),
       ('tech', NEXTVAL('tech_seq'), 1,
        'Just finished a coding project. The satisfaction of seeing it work is unmatched.'),

       ('g', NEXTVAL('g_seq'), 1,
        'Had the most bizarre dream last night. It involved flying squirrels and a talking teapot.'),
       ('g', NEXTVAL('g_seq'), 1, 'What''s your go-to comfort food after a long day? Mine is definitely pizza.'),
       ('g', NEXTVAL('g_seq'), 1, 'Planning a weekend trip. Any suggestions for a relaxing getaway spot?');
