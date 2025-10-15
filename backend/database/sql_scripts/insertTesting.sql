-- Insert fake posts
INSERT INTO posts (user_id, author, title, content) VALUES
('99999999-9999-9999-9999-999999999999', 'Alice', 'How to learn React?', 'I am new to React and want to know the best resources to get started.'),
('99999999-9999-9999-9999-999999999999', 'Bob', 'Best PostgreSQL tips?', 'Share your favorite tips and tricks for optimizing queries in Postgres.'),
('22222222-2222-2222-2222-222222222222', 'Charlie', 'Next.js vs Express?', 'When would you choose Next.js over a traditional Express backend?'),
('22222222-2222-2222-2222-222222222222', 'Dana', 'Tailwind CSS worth it?', 'I see Tailwind CSS everywhere—what are the pros and cons compared to plain CSS or Bootstrap?');
 
-- Insert fake comments (referencing posts by ID)
INSERT INTO comments (post_id, user_id, author, content) VALUES
(1, '99999999-9999-9999-9999-999999999999', 'Eve', 'I recommend the official React docs—they are super well written!'),
(1, '99999999-9999-9999-9999-999999999999', 'Frank', 'Try Scrimba or Frontend Mentor, very interactive.'),
(2, '99999999-9999-9999-9999-999999999999', 'Grace', 'Use EXPLAIN ANALYZE to understand query performance.'),
(2, '99999999-9999-9999-9999-999999999999', 'Heidi', 'Don’t forget to index frequently used columns.'),
(3, '22222222-2222-2222-2222-222222222222', 'Ivan', 'Next.js is great if you need SSR, otherwise Express is simpler.'),
(4, '22222222-2222-2222-2222-222222222222', 'Judy', 'Tailwind is amazing once you get used to utility classes.'),
(4, '22222222-2222-2222-2222-222222222222', 'Karl', 'I prefer writing raw CSS for full control, but Tailwind is fast for prototyping.');

-- test data
--booked slots
INSERT INTO advisory_bookings (advisor_id, client_id, date, startTime, description, endTime, status) VALUES 
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '2025-10-16', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '2025-10-15', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-10-22', '12:00:00', 'I need some advise on my front-end project', '14:00:00', 'booked');

--open slots
INSERT INTO advisory_bookings (advisor_id, date, startTime, endTime, status) VALUES 
('99999999-9999-9999-9999-999999999999', '2025-10-13', '10:00:00', '12:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-10-14', '12:00:00', '14:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-10-15', '12:00:00', '14:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-10-15', '14:00:00', '16:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-10-16', '11:00:00', '13:00:00', 'open'),
('99999999-9999-9999-9999-999999999999', '2025-10-17', '10:00:00', '12:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-13', '10:00:00', '12:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-13', '12:00:00', '14:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-14', '12:00:00', '14:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-15', '12:00:00', '14:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-16', '11:00:00', '13:00:00', 'open'),
('22222222-2222-2222-2222-222222222222', '2025-10-17', '10:00:00', '12:00:00', 'open');

-- test data for advisory session
INSERT INTO advisory_sessions (advisor_id, client_id, status) VALUES 
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'active'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'pending'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'closed'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'active');

INSERT INTO "user" (id, firstname, lastname, email, role) VALUES
(11111, 'John', 'Smith', 'JohnS@sample.com', 'member'),
(22222, 'Jane', 'Nguyen', 'JaneNg@sample.com', 'member')
ON CONFLICT (id) DO NOTHING;

INSERT INTO resume (user_id, summary, skills, experience, education, certifications, additional_info) VALUES
(11111, 'Experienced software developer with a passion for creating innovative solutions.', 'JavaScript, Python, SQL', '5 years at TechCorp as a Full Stack Developer', 'B.Sc. in Computer Science from University X', 'Certified Scrum Master', 'Open to relocation.'),
(22222, 'Detail-oriented data analyst with expertise in data visualization and statistical analysis.', 'R, Python, Tableau', '3 years at DataInsights as a Data Analyst', 'M.Sc. in Data Science from University Y', 'Certified Data Analyst', 'Looking for remote opportunities.');

INSERT INTO cover_letter (user_id, content) VALUES
(11111, 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your esteemed company. With over 5 years of experience in full stack development and a strong background in JavaScript and Python, I am confident in my ability to contribute effectively to your team.\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my skills and experiences align with your needs.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe'),
(22222, 'Dear Hiring Manager,\n\nI am excited to apply for the Data Analyst position at your organization. With a Master degree in Data Science and 3 years of hands-on experience in data analysis and visualization, I am eager to bring my expertise to your team.\n\nPlease find my resume attached for your consideration. I look forward to the possibility of discussing how I can contribute to your company success.\n\nThank you for your time and consideration.\n\nBest regards,\nJane Smith');

-- Insert data into job tables
INSERT INTO job_industry (name) VALUES
('IT'),
('Banking'),
('Insurance'),
('Healthcare'),
('Manufacturing'),
('Hospitality'),
('Transportation'),
('Construction'),
('Real Estate'),
('Marketing'),
('Sales'),
('Human Resources'),
('Legal'),
('Arts & Entertainment'),
('Non-Profit'),
('Government'),
('Telecommunications'),
('Education'),
('Retail'),
('Pharmaceutical'),
('Energy'),
('Agriculture'),
('Food & Beverage'),
('Consulting'),
('Media & Publishing'),
('Travel & Tourism'),
('Other');

INSERT INTO job_type (name) VALUES
('Full-time'),
('Part-time'),
('Contract'),
('Temporary'),
('Internship'),
('Co-op'),
('Volunteer'),
('Freelance'),
('Other');

INSERT INTO job_experience (name) VALUES
('Entry'),
('Senior'),
('Mid-Senior'),
('Junior'),
('Associate'),
('Other');

INSERT INTO job_workplace (name) VALUES
('On-site'),
('Remote'),
('Hybrid'),
('Other');

INSERT INTO job (title, company, company_info, location, posted_at, industry_id, workplace_id, type_id, experience_id, salary_per_hour, link, description, responsibilities, requirements, details, benefits) VALUES
('Software Engineer', 'TechCorp', 'TechCorp is a leading technology solutions provider specializing in cloud computing and AI-driven products.', 'Vancouver, BC', '2025-09-10', 1, 3, 1, 3, 32.35, 'https://techcorp.com/jobs/123', 'Develop and maintain software applications.', 'Design, code, test software.', 'Bachelors degree in Computer Science.', 'Full job details here.', 'Health insurance, 401k'),
('Nurse Practitioner', 'HealthFirst', 'HealthFirst operates a network of clinics focused on patient-centered care and innovative health solutions.', 'Calgary, AB', '2025-09-12', 4, 1, 1, 2, 45.00, 'https://healthfirst.com/careers/np', 'Provide primary and specialty healthcare services.', 'Diagnose and treat patients.', 'Registered Nurse with NP license.', 'Full job details here.', 'Comprehensive health benefits'),
('Financial Analyst', 'BankTrust', 'BankTrust is a major Canadian bank offering a wide range of financial services to individuals and businesses.', 'Toronto, ON', '2025-09-08', 2, 2, 1, 3, 29.75, 'https://banktrust.com/jobs/finanalyst', 'Analyze financial data and trends.', 'Prepare reports and forecasts.', 'Degree in Finance or related field.', 'Full job details here.', 'Retirement plan, bonuses'),
('Civil Engineer', 'InfraBuild', 'InfraBuild specializes in large-scale infrastructure projects, including bridges, highways, and public works.', 'Edmonton, AB', '2025-09-11', 8, 1, 1, 3, 36.50, 'https://infrabuild.com/careers/civileng', 'Design and oversee construction projects.', 'Project management and site supervision.', 'P.Eng. designation required.', 'Full job details here.', 'Vehicle allowance, health benefits'),
('Teacher', 'BrightMinds Academy', 'BrightMinds Academy is a private K-12 school dedicated to innovative teaching and student success.', 'Winnipeg, MB', '2025-09-09', 17, 1, 1, 1, 28.00, 'https://brightminds.ca/jobs/teacher', 'Teach and mentor students in assigned subjects.', 'Lesson planning and classroom management.', 'Teaching certificate required.', 'Full job details here.', 'Professional development, pension');

INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'Hey there, this is ME sending the first test message.', 'S'),
('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Hi ME! Got your message just fine.', 'R'),
('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hello user 2222, testing another peer chat.', 'S'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Replying to ME from user 2222.', 'D'),
('11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 'Follow-up message to user 9999.', 'S');

-- not involving ME
INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'This chat is between 3333 and 4444 only.', 'S'),
('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Reply back to 3333 from 4444.', 'R');


-- =========================================
-- reports
INSERT INTO reports (source_page, followup_id, reported_user_id, reason, is_removed, is_banned, public_code)
VALUES
('profile', 'fup-1001', '550e8400-e29b-41d4-a716-446655440000', 'hate_speech', FALSE, FALSE, '10000001'),
('post', 'fup-1002', '550e8400-e29b-41d4-a716-446655440001', 'spam', TRUE, FALSE, '10000002'),
('comment', 'fup-1003', '550e8400-e29b-41d4-a716-446655440002', 'harassment', FALSE, TRUE, '10000003'),
('post/abc123', NULL, '550e8400-e29b-41d4-a716-446655440003', 'fake_account', FALSE, FALSE, '10000004'),
('profile', 'fup-1005', '550e8400-e29b-41d4-a716-446655440004', 'other', FALSE, FALSE, '10000005'),
('post', NULL, '550e8400-e29b-41d4-a716-446655440005', 'spam', TRUE, TRUE, '10000006'),
('profile/settings', 'fup-1007', '550e8400-e29b-41d4-a716-446655440006', 'harassment', FALSE, FALSE, '10000007'),
('post/xyz789', NULL, '550e8400-e29b-41d4-a716-446655440007', 'hate_speech', TRUE, TRUE, '10000008'),
('comment/555', 'fup-1009', '550e8400-e29b-41d4-a716-446655440008', 'other', FALSE, FALSE, '10000009'),
('profile/edit', 'fup-1010', '550e8400-e29b-41d4-a716-446655440009', 'fake_account', FALSE, TRUE, '10000010'),
('post/longtext', NULL, '550e8400-e29b-41d4-a716-446655440010', 'harassment', TRUE, FALSE, '10000011'),
('profile/pic', 'fup-1012', '550e8400-e29b-41d4-a716-446655440011', 'spam', FALSE, FALSE, '10000012');


--workshop
INSERT INTO events (title, date, start_time, location, description, highlight)
VALUES
('Ace the Interview: Confidence Meets Strategy',
 '2025-06-27',
 '18:00:00',
 'Online Meeting',
 'Tech Connect Alberta is excited to be part of this engaging career development session.`',
 'Join Us for an Empowering Career Workshop: Ace the Interview - Confidence Meets Strategy!'),

('Launch Your Startup: Funding & Pitching Essentials',
 '2025-07-01',
 '12:00:00',
 'Calgary Tech Hub',
 'This workshop will help you refine your pitch, understand funding stages, and build investor confidence.',
 'Get expert guidance on pitching, funding, and launching your own tech startup.'),

('AI Tools for Career Advancement',
 '2025-07-10',
 '15:00:00',
 'Online Webinar',
 'Discover how to use tools like ChatGPT, LinkedIn AI, and job matchers to boost your job hunt.',
 'Explore modern AI tools that can help you level up your career.'),

('Building Your Brand as a Developer',
 '2025-08-15',
 '13:00:00',
 'Online Workshop',
 'We''ll explore LinkedIn optimization, GitHub portfolios, and storytelling strategies for tech professionals.',
 'Learn how to craft your personal brand and digital portfolio effectively.'),

('Tech Industry Mixer',
 '2025-09-03',
 '17:00:00',
 'SAIT Downtown Campus',
 'An in-person event to connect with key players in Calgary''s tech scene — refreshments provided!',
 'Network with employers, alumni, and industry mentors.'),

('Career Growth with AI: Mastering Tools and Strategies',
 '2025-10-08',
 '14:00:00',
 'Online Webinar',
 'Learn how AI can accelerate your career development with practical hands-on strategies.',
 'Harness AI tools to boost productivity, networking, and career decision-making.'),

('Startup Funding Bootcamp',
 '2025-10-22',
 '10:00:00',
 'Calgary Innovation Centre',
 'A full-day intensive session on pitching, funding rounds, and investor engagement for early-stage startups.',
 'Hands-on workshops to prepare founders for funding success.');
