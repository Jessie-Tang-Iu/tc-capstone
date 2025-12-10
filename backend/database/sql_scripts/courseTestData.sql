
-- Course Inserts
INSERT INTO courses (title, description, level, type, certificate, lesson_count, duration)
VALUES
('Intro to Programming', 'A basic introduction to programming concepts.', 'Beginner', 'Online', TRUE, 3, '2 hours'),
('Web Development Basics', 'Fundamentals of building modern websites.', 'Beginner', 'Workshop', FALSE, 4, '3 hours'),
('Advanced SQL Mastery', 'Deep dive into optimization, indexing, and advanced SQL techniques.', 'Advanced', 'Online', TRUE, 2, '1.5 hours'),

('Data Structures Fundamentals',
 'Core concepts of data structures including arrays, lists, stacks, queues, and trees.',
 'Intermediate', 'Online', TRUE, 5, '4 hours'),

('UX/UI Design Principles',
 'Foundational principles for designing user-friendly and visually appealing interfaces.',
 'Beginner', 'Workshop', FALSE, 3, '2.5 hours'),

('Cybersecurity Essentials',
 'Key practices and concepts for securing systems, networks, and applications.',
 'Intermediate', 'Online', TRUE, 4, '3 hours'),

('Machine Learning Crash Course',
 'Introduction to core ML concepts, models, and workflows.',
 'Advanced', 'Online', TRUE, 3, '3 hours'),

('Project Management Basics',
 'Fundamentals of agile, scrum, workflows, and team collaboration.',
 'Beginner', 'In Person', FALSE, 2, '1 hour'),

('Cloud Computing Overview',
 'Introduction to cloud platforms, virtualization, containers, and cloud architecture.',
 'Intermediate', 'Online', TRUE, 3, '2 hours');

-- Inserts for Each course in order.

-- COURSE 1
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(1, 'What is Programming?', '<p>Programming is giving instructions to computers.</p>', 'https://www.youtube.com/embed/FCMxA3m_Imc', 'lesson', 1),
(1, 'Variables & Data Types', '<p>Understanding variables and data types.</p>', 'https://www.youtube.com/embed/ghCbURMWBD8', 'lesson', 2),
(1, 'Intro Quiz', '<p>Test your knowledge of basic programming concepts.</p>', NULL, 'quiz', 3);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=1 AND type='quiz'),
 'What is programming?', ARRAY['Telling computers what to do', 'A computer part', 'A type of memory'], 'Telling computers what to do'),
((SELECT id FROM lessons WHERE course_id=1 AND type='quiz'),
 'Which of these is a data type?', ARRAY['Variable', 'Integer', 'Loop'], 'Integer');

-- COURSE 2
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(2, 'HTML Fundamentals', '<p>Learn HTML structure.</p>', 'https://www.youtube.com/embed/pQN-pnXPaVg', 'lesson', 1),
(2, 'CSS Basics', '<p>Learn how to style webpages.</p>', 'https://www.youtube.com/embed/yfoY53QXEnI', 'lesson', 2),
(2, 'JavaScript Introduction', '<p>Learn how to add interactivity.</p>', 'https://www.youtube.com/embed/W6NZfCO5SIk', 'lesson', 3),
(2, 'HTML/CSS/JS Quiz', '<p>Check your understanding of web development fundamentals.</p>', NULL, 'quiz', 4);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=2 AND type='quiz'),
 'What does HTML stand for?', ARRAY['Hyper Trainer Marking Language', 'HyperText Markup Language', 'HyperText Markdown Language'], 'HyperText Markup Language'),
((SELECT id FROM lessons WHERE course_id=2 AND type='quiz'),
 'Which language styles a webpage?', ARRAY['HTML', 'CSS', 'SQL'], 'CSS'),
((SELECT id FROM lessons WHERE course_id=2 AND type='quiz'),
 'JavaScript is used for:', ARRAY['Styling', 'Structure', 'Interactivity'], 'Interactivity');

-- COURSE 3
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(3, 'Query Optimization', '<p>Optimize SQL queries.</p>', 'https://www.youtube.com/embed/9Pzj7Aj25lw', 'lesson', 1),
(3, 'Indexing Strategies', '<p>Learn indexing techniques.</p>', 'https://www.youtube.com/embed/HubezKbFL7E', 'lesson', 2);

-- COURSE 4
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(4, 'Arrays & Lists', '<p>Intro to arrays and lists.</p>', 'https://www.youtube.com/embed/9YddVVsdG5A', 'lesson', 1),
(4, 'Stacks & Queues', '<p>Understanding stacks and queues.</p>', 'https://www.youtube.com/embed/wjI1WNcIntg', 'lesson', 2),
(4, 'Trees Overview', '<p>Intro to trees.</p>', 'https://www.youtube.com/embed/oSWTXtMglKE', 'lesson', 3),
(4, 'Graphs Basics', '<p>Understanding graphs.</p>', 'https://www.youtube.com/embed/gXgEDyodOJU', 'lesson', 4),
(4, 'Data Structures Quiz', '<p>Test your knowledge of essential data structures.</p>', NULL, 'quiz', 5);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=4 AND type='quiz'),
 'Which structure works FIFO?', ARRAY['Stack','Queue','Tree'], 'Queue'),
((SELECT id FROM lessons WHERE course_id=4 AND type='quiz'),
 'Which is non-linear?', ARRAY['Array','Queue','Tree'], 'Tree');

-- COURSE 5
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(5, 'Design Basics', '<p>Learn basic UX/UI concepts.</p>', 'https://www.youtube.com/embed/9B0eQTrgWYw', 'lesson', 1),
(5, 'Color & Typography', '<p>Understanding color theory and typography.</p>', 'https://www.youtube.com/embed/sByzHoiYFX0', 'lesson', 2),
(5, 'UX/UI Quiz', '<p>Evaluate your understanding of UX and UI fundamentals.</p>', NULL, 'quiz', 3);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=5 AND type='quiz'),
 'Which improves readability?', ARRAY['Random colors','Good contrast','Small fonts'], 'Good contrast'),
((SELECT id FROM lessons WHERE course_id=5 AND type='quiz'),
 'UX focuses on:', ARRAY['Visual style','User experience','Database design'], 'User experience');

-- COURSE 6
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(6, 'Threat Types', '<p>Common cybersecurity threats.</p>', 'https://www.youtube.com/embed/Ak7JJQJszPE', 'lesson', 1),
(6, 'Network Security Basics', '<p>How networks are secured.</p>', 'https://www.youtube.com/embed/2P6ZlFqE7jY', 'lesson', 2),
(6, 'Authentication & Authorization', '<p>Identity and access control.</p>', 'https://www.youtube.com/embed/3Efp5j1Q2oM', 'lesson', 3),
(6, 'Cybersecurity Quiz', '<p>Measure your comprehension of cybersecurity principles.</p>', NULL, 'quiz', 4);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=6 AND type='quiz'),
 'What does MFA stand for?', ARRAY['Multi-Factor Authentication','Master File Access','Modular Function API'], 'Multi-Factor Authentication'),
((SELECT id FROM lessons WHERE course_id=6 AND type='quiz'),
 'Which is a cyber threat?', ARRAY['Phishing','Typography','Indexing'], 'Phishing');

-- COURSE 7
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(7, 'What is ML?', '<p>Introduction to ML.</p>', 'https://www.youtube.com/embed/GwIo3gDZCVQ', 'lesson', 1),
(7, 'Training Models', '<p>How ML models are trained.</p>', 'https://www.youtube.com/embed/aircAruvnKk', 'lesson', 2),
(7, 'Machine Learning Quiz', '<p>Test your understanding of machine learning concepts.</p>', NULL, 'quiz', 3);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=7 AND type='quiz'),
 'ML learns patterns from:', ARRAY['Random guesses','Data','Manual rules'], 'Data'),
((SELECT id FROM lessons WHERE course_id=7 AND type='quiz'),
 'Which is a supervised learning task?', ARRAY['Clustering','Classification','Anomaly detection'], 'Classification');

-- COURSE 8
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(8, 'Agile Overview', '<p>Basics of Agile methodologies.</p>', 'https://www.youtube.com/embed/Z9QbYZh1YXY', 'lesson', 1),
(8, 'Scrum Roles', '<p>Scrum team structure.</p>', 'https://www.youtube.com/embed/9TycLR0TqFA', 'lesson', 2);

-- COURSE 9
INSERT INTO lessons (course_id, title, content, video_url, type, position)
VALUES
(9, 'Cloud Basics', '<p>Intro to cloud computing.</p>', 'https://www.youtube.com/embed/M988_fsOSWo', 'lesson', 1),
(9, 'Virtualization', '<p>Virtual machines and containers.</p>', 'https://www.youtube.com/embed/31WTrHrzKQg', 'lesson', 2),
(9, 'Cloud Quiz', '<p>Assess your cloud computing knowledge.</p>', NULL, 'quiz', 3);

INSERT INTO quiz_questions (lesson_id, question, answers, correct_answer)
VALUES
((SELECT id FROM lessons WHERE course_id=9 AND type='quiz'),
 'Which is a cloud model?', ARRAY['On-prem only','Hybrid','Wired'], 'Hybrid'),
((SELECT id FROM lessons WHERE course_id=9 AND type='quiz'),
 'Containers are:', ARRAY['Lightweight virtualized environments','Physical servers','Backup devices'], 'Lightweight virtualized environments');
