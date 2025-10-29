DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS user_lesson_progress CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- COURSES
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  type TEXT CHECK (type IN ('Online', 'In Person', 'Workshop')),
  certificate BOOLEAN DEFAULT FALSE,
  lesson_count INT,
  duration TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LESSONS
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INT REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,               -- Quill HTML content
  video_url TEXT,
  type TEXT CHECK (type IN ('lesson', 'quiz')),
  position INT                -- order in course
);

-- QUIZ QUESTIONS (optional, only for quizzes)
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answers TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL
);

-- USER COURSE PROGRESS
CREATE TABLE user_course_progress (
  user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons INT DEFAULT 0,
  total_lessons INT,
  completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, course_id)
);

-- USER LESSON PROGRESS
CREATE TABLE user_lesson_progress (
  user_id VARCHAR(255) REFERENCES users(clerk_id) ON DELETE CASCADE,
  lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, lesson_id)
);
