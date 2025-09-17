DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    authorId INT NOT NULL,
    author VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    authorId INT NOT NULL,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert fake posts
INSERT INTO posts (author, title, content) VALUES
('Alice', '1', 'How to learn React?', 'I am new to React and want to know the best resources to get started.'),
('Bob', '2', 'Best PostgreSQL tips?', 'Share your favorite tips and tricks for optimizing queries in Postgres.'),
('Charlie', '3', 'Next.js vs Express?', 'When would you choose Next.js over a traditional Express backend?'),
('Dana', '4', 'Tailwind CSS worth it?', 'I see Tailwind CSS everywhere—what are the pros and cons compared to plain CSS or Bootstrap?');

-- Insert fake comments (referencing posts by ID)
INSERT INTO comments (post_id, author, content) VALUES
(1, 'Eve', '5', 'I recommend the official React docs—they are super well written!'),
(1, 'Frank', '6', 'Try Scrimba or Frontend Mentor, very interactive.'),
(2, 'Grace', '7', 'Use EXPLAIN ANALYZE to understand query performance.'),
(2, 'Heidi', '8', 'Don’t forget to index frequently used columns.'),
(3, 'Ivan', '9', 'Next.js is great if you need SSR, otherwise Express is simpler.'),
(4, 'Judy', '10', 'Tailwind is amazing once you get used to utility classes.'),
(4, 'Karl', '11', 'I prefer writing raw CSS for full control, but Tailwind is fast for prototyping.');