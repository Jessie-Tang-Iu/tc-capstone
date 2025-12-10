INSERT INTO users (clerk_id, username, first_name, last_name, email, role, status) VALUES
('user_33TXk5AzMm228mH76TLzGUitM2U','joywong1228','Joy','Wong','s1041071@gmail.com','member','active'),
('user_33TltDhWmKiEGfSs7DJk6b1HlI1','Jessie','Jessie','Tang','jessiestitch666@gmail.com','member','active'),
('user_33TygiU42yjY3nfWxD5cEPCACv7','lamdao','Lam','Dao','lam.dao@edu.sait.ca','member','active'),
('user_347IKz8chgO4vioewBOUXv2DZTr','dione1','Dion','Emary','emarydion15@gmail.com','member','active'),
('user_345ZOK9fIENSJZtJi4CqfDxYkNO','dione2','Dion','Emary','emarydion16@gmail.com','employer','active'),
('user_345Zd39578QY7lu7hxmEHoVDKrU','dione3','Dion','Emary','emarydion17@gmail.com','advisor','active'),
('user_34RDeo5WKU2K8s6AArG7XBAODkb','admin','Admin','Account','admin@gmail.com','admin','active'),
('user_354NOlnmVLauZqHMM9kKE4mxprm','advisoracc123','Advisor','Account','advisor@gmail.com','advisor','active')
ON CONFLICT (clerk_id) DO NOTHING;

--advisors (5 active) - password: [first_name]Adv[index] - ex: MaryAdv1
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role, status) VALUES
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'testadvisor1', 'Mary', 'White', 'mary.w@gmail.com', '403-555-6001', 'advisor', 'active'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J','jamesadvisor2','James','Brown','jb@hotmail.com','403-555-6002','advisor','active'),
('user_36LtbOmcHhwL8SFxMVejTJuidjl','harryadvisor3','Harry','Potter','hp@gmail.com','403-555-6003','advisor','active'),
('user_36Lu1gq63tyhea7IZS2yPISpObd','lilyadvisor4','Lily','Potter','lily.p@gmail.com','403-555-6004','advisor','active'),
('user_36LuOUs6t5eeG3LcltRac4UHXID','johnadvisor5','John','Doe','john.doe@gmail.com','403-555-6005','advisor','active');

INSERT INTO advisors (clerk_id, company_name, company_role) VALUES 
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'Tech Solutions', 'Senior Developer'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'XYZ Tech Inc.', 'Career Advisor'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'Innovatech', 'Project Manager'),
('user_36LtbOmcHhwL8SFxMVejTJuidjl', 'ABC Company', 'Front-end Developer'),
('user_36Lu1gq63tyhea7IZS2yPISpObd', 'BCD Company', 'Full Stack Developer'),
('user_36LuOUs6t5eeG3LcltRac4UHXID', 'AAB Tech', 'Project Manager');

-- Add placeholder users so posts/comments have valid references
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role, status) VALUES
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'aliceuser1', 'Alice', 'Example', 'alice@example.com', '403-555-0001', 'member', 'active'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'bobuser2', 'Bob', 'Example', 'bob@example.com', '403-555-0002', 'member', 'active'),
('user_36MTe4Q0HGtiwbzjXkh5z0msm3E','johnuser3','John','Smith','john@example.com','403-555-0003','member','active'),
('user_36MTie8sONovgUFzzAmg38JSigF','janeuser4','Jane','Nguyen','jane@example.com','403-555-0004','member','active'),
('user_36MTqkFlFAI6FME7sUBSxISPCq2','alexuser5','Alex','Example','alex@example.com','403-555-0005','member','active');

-- Insert fake posts
INSERT INTO posts (author_id, title, content) VALUES
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'How to learn React?', 'I am new to React and want to know the best resources to get started.'),
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Best PostgreSQL tips?', 'Share your favorite tips and tricks for optimizing queries in Postgres.'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'Next.js vs Express?', 'When would you choose Next.js over a traditional Express backend?'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'Tailwind CSS worth it?', 'I see Tailwind CSS everywhere—what are the pros and cons compared to plain CSS or Bootstrap?');

-- Insert fake comments (referencing posts by ID)
INSERT INTO comments (post_id, author_id, content) VALUES
(1, 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'I recommend the official React docs—they are super well written!'),
(1, 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Try Scrimba or Frontend Mentor, very interactive.'),
(2, 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Use EXPLAIN ANALYZE to understand query performance.'),
(2, 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Don’t forget to index frequently used columns.'),
(3, 'user_36MS55rT6vLJjFls1z62mKG2rRO', 'Next.js is great if you need SSR, otherwise Express is simpler.'),
(4, 'user_36MS55rT6vLJjFls1z62mKG2rRO', 'Tailwind is amazing once you get used to utility classes.'),
(4, 'user_36MS55rT6vLJjFls1z62mKG2rRO', 'I prefer writing raw CSS for full control, but Tailwind is fast for prototyping.');
-- test data

--booked slots
INSERT INTO advisory_bookings (advisor_id, client_id, date, startTime, description, endTime, status) VALUES 
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-11-6', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-11-5', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-11-6', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-11-5', '10:00:00', 'I need some advise on my front-end project', '12:00:00', 'booked'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-10-22', '12:00:00', 'I need some advise on my front-end project', '14:00:00', 'booked');

--open slots
INSERT INTO advisory_bookings (advisor_id, date, startTime, endTime, status) VALUES 
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-3', '10:00:00', '12:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-4', '12:00:00', '14:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-5', '12:00:00', '14:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-5', '14:00:00', '16:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-6', '11:00:00', '13:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-7', '10:00:00', '12:00:00', 'open'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', '2025-11-3', '10:00:00', '12:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-3', '10:00:00', '12:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-4', '12:00:00', '14:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-5', '12:00:00', '14:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-5', '14:00:00', '16:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-6', '11:00:00', '13:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-7', '10:00:00', '12:00:00', 'open'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', '2025-11-3', '10:00:00', '12:00:00', 'open'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-10-13', '12:00:00', '14:00:00', 'open'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-10-14', '12:00:00', '14:00:00', 'open'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-10-15', '12:00:00', '14:00:00', 'open'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-10-16', '11:00:00', '13:00:00', 'open'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', '2025-10-17', '10:00:00', '12:00:00', 'open');

-- test data for advisory session
INSERT INTO advisory_sessions (advisor_id, client_id, message, status) VALUES 
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'I need help with front-end', 'active'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'I need help with backend', 'pending'),
('user_354NOlnmVLauZqHMM9kKE4mxprm', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', null, 'closed'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'I need help with front-end', 'active'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'I need help with backend', 'pending'),
('user_36LsgiytrqklL4r6V2fqus5wfVo', 'user_36LtMEozUBovhSFgSeW8hkWRJ6J', null, 'closed'),
('user_36LtMEozUBovhSFgSeW8hkWRJ6J', 'user_36LsgiytrqklL4r6V2fqus5wfVo', 'I need help with front-end', 'active');

-- Test data for applications

-- resume
INSERT INTO resume (user_id, summary, skills, experience, education, certifications, additional_info) VALUES
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Experienced software developer with a passion for creating innovative solutions.', ARRAY['JavaScript, Python, SQL'], ARRAY['Full Stack Developer | TechCorp | Contract | April | 2013 | June | 2018'], ARRAY['University X | Bachelor | Computer Science | 2010 | 2014'], ARRAY['Certified Scrum Master'], 'Open to relocation.'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'Detail-oriented data analyst with expertise in data visualization and statistical analysis.', ARRAY['R, Python, Tableau'], ARRAY['Data Analyst | Data Insights | Full-time | January | 2020 | August | 2022'], ARRAY['University Y | Master | Data Science | 2012 | 2016'], ARRAY['Certified Data Analyst'], 'Looking for remote opportunities.')
ON CONFLICT (user_id) DO NOTHING;

-- cover letter
INSERT INTO cover_letter (user_id, content) VALUES
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your esteemed company. With over 5 years of experience in full stack development and a strong background in JavaScript and Python, I am confident in my ability to contribute effectively to your team.\n\nI have attached my resume for your review and would welcome the opportunity to discuss how my skills and experiences align with your needs.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'Dear Hiring Manager,\n\nI am excited to apply for the Data Analyst position at your organization. With a Master degree in Data Science and 3 years of hands-on experience in data analysis and visualization, I am eager to bring my expertise to your team.\n\nPlease find my resume attached for your consideration. I look forward to the possibility of discussing how I can contribute to your company success.\n\nThank you for your time and consideration.\n\nBest regards,\nJane Smith')
ON CONFLICT (user_id) DO NOTHING;

-- TEST DATA FOR JOB BOARD

-- users
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role, status) VALUES 
('user_36MVovbCJp6OkcXlDRHpBtfuDfX', 'tcemployer1', 'Techcorp', 'Employer', 'employer1@techcorp.com', '403-555-2001', 'employer', 'active'),
('user_36MW1kRcnK6VscYofJWZOj0NhTR', 'hfemployer2', 'HealthFirst', 'Employer', 'employer2@healthfirst.com', '403-555-2002', 'employer', 'active'),
('user_36MWFpxHChGaSyZSICjyAGIgy9X', 'btemployer3', 'BankTrust', 'Employer', 'employer3@banktrust.com', '403-555-2003', 'employer', 'active'),
('user_36MWNcpJ6UDWMF5P3CHHEKn3Tjt', 'btemployer4', 'InfraBuild', 'Employer', 'employer4@infrabuild.com', '403-555-2004', 'employer', 'active'),
('user_36MWvQuGOjHD902BVDSbGAz0s67', 'bmemployer5', 'BrightMinds', 'Employer', 'employer5@brightminds.com', '403-555-2005', 'employer', 'active')
ON CONFLICT (clerk_id) DO NOTHING;

-- employers
INSERT INTO employers (clerk_id, company_name, company_role) VALUES
('user_36MVovbCJp6OkcXlDRHpBtfuDfX', 'TechCorp company', 'HR assistant'),
('user_36MW1kRcnK6VscYofJWZOj0NhTR', 'HealthFirst company', 'project manager'),
('user_36MWFpxHChGaSyZSICjyAGIgy9X', 'BankTrust company', 'HR assistant'),
('user_36MWNcpJ6UDWMF5P3CHHEKn3Tjt', 'InfraBuild company', 'HR assistant'),
('user_36MWvQuGOjHD902BVDSbGAz0s67', 'BrightMinds academy', 'HR assistant')
ON CONFLICT (clerk_id) DO NOTHING;

-- industries
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

-- types
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

-- experience
INSERT INTO job_experience (name) VALUES
('Entry'),
('Senior'),
('Mid-Senior'),
('Junior'),
('Associate'),
('Other');

-- workplaces
INSERT INTO job_workplace (name) VALUES
('On-site'),
('Remote'),
('Hybrid'),
('Other');

-- jobs
INSERT INTO job (title, employer_id, company_info, location, posted_at, industry_id, workplace_id, type_id, experience_id, salary_per_hour, link, description, responsibilities, requirements, details, benefits) VALUES
('Software Engineer', 'user_36MVovbCJp6OkcXlDRHpBtfuDfX', 'TechCorp is a leading technology solutions provider specializing in cloud computing and AI-driven products.', 'Vancouver, BC', '2025-09-10', 1, 2, 1, 3, 32.35, 'https://techcorp.com/jobs/123', 'Develop and maintain software applications.', 'Design, code, test software.', 'Bachelors degree in Computer Science.', 'Full job details here.', 'Health insurance, 401k'),
('Nurse Practitioner', 'user_36MW1kRcnK6VscYofJWZOj0NhTR', 'HealthFirst operates a network of clinics focused on patient-centered care and innovative health solutions.', 'Calgary, AB', '2025-09-12', 4, 2, 2, 2, 45.00, 'https://healthfirst.com/careers/np', 'Provide primary and specialty healthcare services.', 'Diagnose and treat patients.', 'Registered Nurse with NP license.', 'Full job details here.', 'Comprehensive health benefits'),
('Financial Analyst', 'user_36MWFpxHChGaSyZSICjyAGIgy9X', 'BankTrust is a major Canadian bank offering a wide range of financial services to individuals and businesses.', 'Toronto, ON', '2025-09-08', 2, 3, 3, 3, 29.75, 'https://banktrust.com/jobs/finanalyst', 'Analyze financial data and trends.', 'Prepare reports and forecasts.', 'Degree in Finance or related field.', 'Full job details here.', 'Retirement plan, bonuses'),
('Civil Engineer', 'user_36MWNcpJ6UDWMF5P3CHHEKn3Tjt', 'InfraBuild specializes in large-scale infrastructure projects, including bridges, highways, and public works.', 'Edmonton, AB', '2025-09-11', 8, 2, 4, 3, 36.50, 'https://infrabuild.com/careers/civileng', 'Design and oversee construction projects.', 'Project management and site supervision.', 'P.Eng. designation required.', 'Full job details here.', 'Vehicle allowance, health benefits'),
('Teacher', 'user_36MWvQuGOjHD902BVDSbGAz0s67', 'BrightMinds Academy is a private K-12 school dedicated to innovative teaching and student success.', 'Winnipeg, MB', '2025-09-09', 17, 1, 5, 1, 28.00, 'https://brightminds.ca/jobs/teacher', 'Teach and mentor students in assigned subjects.', 'Lesson planning and classroom management.', 'Teaching certificate required.', 'Full job details here.', 'Professional development, pension');

-- Questions field can include questions like:
UPDATE job
   SET questions = ARRAY[
    'Why are you interested in this position?',
    'Describe a challenging situation you faced at work and how you handled it.',
    'What are your salary expectations?',
    'When can you start?']
 WHERE id IN (1, 2, 3, 4, 5);

INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('user_36MTqkFlFAI6FME7sUBSxISPCq2', 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Hey there, this is ME sending the first test message.', 'S'),
('user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'user_36MTqkFlFAI6FME7sUBSxISPCq2', 'Hi ME! Got your message just fine.', 'R'),
('user_36MTqkFlFAI6FME7sUBSxISPCq2', 'user_36MS55rT6vLJjFls1z62mKG2rRO', 'Hello user 2222, testing another peer chat.', 'S'),
('user_36MS55rT6vLJjFls1z62mKG2rRO', 'user_36MTqkFlFAI6FME7sUBSxISPCq2', 'Replying to ME from user 2222.', 'D'),
('user_36MTqkFlFAI6FME7sUBSxISPCq2', 'user_36MRxcVmgtvX9V7SuCkpT20UQ6n', 'Follow-up message to user 9999.', 'S');

-- not involving ME
INSERT INTO message (sent_user_id, receive_user_id, content, status) VALUES
('user_36MTe4Q0HGtiwbzjXkh5z0msm3E', 'user_36MTie8sONovgUFzzAmg38JSigF', 'This chat is between 3333 and 4444 only.', 'S'),
('user_36MTie8sONovgUFzzAmg38JSigF', 'user_36MTe4Q0HGtiwbzjXkh5z0msm3E', 'Reply back to 3333 from 4444.', 'R');


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
INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Ace the Interview: Confidence Meets Strategy',
 '2025-05-12',
 '10:00',
 '12:00',
 'active',
 'Calgary Downtown Campus, Room 304',
 '<h2>About this Workshop</h2>
 <p>This interactive session helps participants master the art of confident communication. You will learn <strong>interview techniques</strong>, body language awareness, and strategic storytelling to make a lasting impression. Mock interviews and personalized feedback will be included.</p>
 <h3>Key Takeaways</h3>
 <ul>
   <li>Build confidence under pressure</li>
   <li>Structure answers using the STAR method</li>
   <li>Learn how to research company culture effectively</li>
 </ul>',
 'https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6b',
 50, 0, '2025-05-10 23:59:00',
 'Mock interviews and real recruiter feedback',
 0.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Tech Career Fair 2025',
 '2025-06-15',
 '09:00',
 '16:00',
 'active',
 'SAIT Main Hall, Calgary',
 '<h2>Event Overview</h2>
 <p>Meet over <strong>40 top tech employers</strong> from Alberta and beyond. Bring your resume, network with recruiters, and explore internship and full-time opportunities.</p>
 <h3>Participating Companies</h3>
 <p>Amazon, IBM, Benevity, Unity Technologies, and more.</p>
 <h3>Preparation Tips</h3>
 <ul>
   <li>Dress professionally</li>
   <li>Prepare a 30-second elevator pitch</li>
   <li>Bring 5+ printed resumes</li>
 </ul>',
 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
 500, 0, '2025-06-13 23:59:00',
 'Largest student-employer event of the year',
 0.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('AI in Healthcare Conference',
 '2025-07-22',
 '09:30',
 '17:30',
 'active',
 'University of Calgary, Science Theatre',
 '<h2>Conference Details</h2>
 <p>This one-day event explores how <strong>artificial intelligence</strong> is transforming the healthcare industry. Sessions include predictive diagnosis, medical imaging, and ethics in AI-driven systems.</p>
 <h3>Speakers</h3>
 <ul>
   <li>Dr. Mei Chen (Google Health)</li>
   <li>Prof. Alan Roberts (UCalgary)</li>
   <li>Sophia Nguyen (AI Ethics Researcher)</li>
 </ul>
 <p><em>Networking reception and light lunch included.</em></p>',
 'https://images.unsplash.com/photo-1581091870622-3b7b5e1a7a29',
 300, 0, '2025-07-20 23:59:00',
 'Global leaders in AI and healthcare innovation',
 50.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Building Cloud Infrastructure with Azure',
 '2025-08-05',
 '13:00',
 '17:00',
 'active',
 'Tech Hub Lab 204',
 '<h2>Hands-On Workshop</h2>
 <p>Learn to deploy scalable virtual machines, configure Azure Blob Storage, and automate with Azure Functions. Participants will follow a guided lab to create a mini cloud infrastructure from scratch.</p>
 <h3>Requirements</h3>
 <ul>
   <li>Laptop with admin privileges</li>
   <li>Microsoft Azure Student Account</li>
 </ul>
 <p>All attendees will receive a digital certificate upon completion.</p>',
 'https://images.unsplash.com/photo-1555949963-aa79dcee981d',
 40, 0, '2025-08-03 23:59:00',
 'Live cloud infrastructure lab session',
 20.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Women in Tech Leadership Panel',
 '2025-08-28',
 '15:00',
 '17:00',
 'active',
 'Calgary Central Library Auditorium',
 '<h2>Event Summary</h2>
 <p>Join a panel of inspiring women leaders who have transformed the tech industry. This session focuses on <strong>career progression, inclusivity, and mentorship</strong>.</p>
 <h3>Panelists</h3>
 <ul>
   <li>Maria Chen – VP of Engineering, Benevity</li>
   <li>Ayesha Singh – Founder of SheCodes Alberta</li>
   <li>Emily Zhao – Senior Cloud Architect, Microsoft</li>
 </ul>
 <p>Snacks and coffee provided. Open to all genders.</p>',
 'https://images.unsplash.com/photo-1600880292089-90e24c92a3c7',
 200, 0, '2025-08-26 23:59:00',
 'Hear from Canada’s top women tech executives',
 0.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Networking Night: Developers Connect',
 '2025-09-10',
 '18:00',
 '21:00',
 'active',
 'The Edison Building Rooftop, Calgary',
 '<h2>What to Expect</h2>
 <p>An informal evening to connect with software engineers, UX designers, and data professionals. Enjoy appetizers, casual games, and meaningful discussions.</p>
 <h3>Activities</h3>
 <ul>
   <li>Speed Networking</li>
   <li>Tech Trivia</li>
   <li>Startup Pitch Corner</li>
 </ul>',
 'https://images.unsplash.com/photo-1561484930-998b6a7b63fe',
 120, 0, '2025-09-08 23:59:00',
 'Food, games, and networking under the stars',
 10.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Data Visualization with Python and Power BI',
 '2025-09-25',
 '10:00',
 '15:00',
 'active',
 'SAIT Innovation Centre Lab',
 '<h2>Workshop Content</h2>
 <p>Transform raw datasets into powerful visual stories. Learn to clean, model, and visualize data using <strong>Pandas, Matplotlib, and Power BI</strong>.</p>
 <h3>Skills Covered</h3>
 <ul>
   <li>Python data manipulation</li>
   <li>Power BI dashboards</li>
   <li>Storytelling with data</li>
 </ul>',
 'https://images.unsplash.com/photo-1556761175-4b46a572b786',
 60, 0, '2025-09-23 23:59:00',
 'Hands-on data visualization crash course',
 25.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Cybersecurity Awareness Bootcamp',
 '2025-10-12',
 '09:00',
 '17:00',
 'active',
 'Calgary Tech Hub',
 '<h2>Program Outline</h2>
 <p>Designed for IT students and professionals who want to strengthen their cybersecurity foundations. Topics include <strong>network defense, ethical hacking, and incident response</strong>.</p>
 <h3>Included Labs</h3>
 <ul>
   <li>Wireshark Traffic Analysis</li>
   <li>SQL Injection Simulation</li>
   <li>Phishing Defense Workshop</li>
 </ul>',
 'https://images.unsplash.com/photo-1614064641938-3b70c1d6cc0f',
 80, 0, '2025-10-10 23:59:00',
 'Full-day cybersecurity training with labs',
 35.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('AI Hackathon: Code for Change',
 '2025-11-15',
 '08:00',
 '23:59',
 'active',
 'Platform Calgary',
 '<h2>Hackathon Overview</h2>
 <p>Join a 15-hour hackathon to solve social issues using AI. Teams will compete to develop innovative applications addressing <strong>mental health, sustainability, and accessibility</strong>.</p>
 <h3>Prizes</h3>
 <ul>
   <li>$2000 Cash Prize</li>
   <li>Mentorship from Google Cloud Engineers</li>
   <li>Free cloud credits</li>
 </ul>',
 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
 150, 0, '2025-11-13 23:59:00',
 '15-hour innovation sprint for a better world',
 15.00);


INSERT INTO events 
(title, date, start_time, end_time, status, location, description, image_url, max_capacity, current_capacity, registration_deadline, highlight, price)
VALUES
('Portfolio Showcase & Networking Gala',
 '2025-12-05',
 '17:00',
 '21:00',
 'active',
 'Telus Convention Centre',
 '<h2>Event Summary</h2>
 <p>Celebrate the end of the academic year with an elegant evening where students present their capstone projects. Industry guests, recruiters, and faculty will attend.</p>
 <h3>Agenda</h3>
 <ul>
   <li>Student Project Demos</li>
   <li>Awards Ceremony</li>
   <li>Networking Dinner</li>
 </ul>',
 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
 300, 0, '2025-12-03 23:59:00',
 'Formal gala celebrating student innovation',
 40.00);


-- under reivew user
-- 7 new advisors
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role, status)
VALUES
('user_36LuW3xqICj7ZjdFec7xVsmFp9L','liamadvisor6','Liam','Wong','liam.wong@sample.com','403-555-6006','advisor','under-review'),
('user_36Lud5Qr140OWVjnGzyI8sgKNsp','chloeadvisor7','Chloe','Park','chloe.park@sample.com','403-555-6007','advisor','under-review'),
('user_36LujVUa51HBuJYktaa7GVGBQuS','noahadvisor8','Noah','Chan','noah.chan@sample.com','403-555-6008','advisor','under-review'),
('user_36LwKkX9d7lcxmNoVeOmO5AMgXC','emmaadvisor9','Emma','Lee','emma.lee@sample.com','403-555-6009','advisor','under-review'),
('user_36LwS1Twi0OQlRCt1ReErjZhjjJ','masonadvisor10','Mason','Ng','mason.ng@sample.com','403-555-6010','advisor','under-review'),
('user_36Lwa069wSfjnhrOxX5aYumDZ78','sophiaadvisor11','Sophia','Lam','sophia.lam@sample.com','403-555-6011','advisor','under-review'),
('user_36LwpQ3kb4RPiZYrxhMmHiKkh6g','ethanadvisor12','Ethan','Ho','ethan.ho@sample.com','403-555-6012','advisor','under-review');

INSERT INTO advisors (clerk_id, company_name, company_role)
VALUES
('user_36LuW3xqICj7ZjdFec7xVsmFp9L', 'MindBridge Analytics', 'Data Analyst'),
('user_36Lud5Qr140OWVjnGzyI8sgKNsp', 'Aurora Systems', 'Tech Consultant'),
('user_36LujVUa51HBuJYktaa7GVGBQuS', 'NovaSoft', 'Product Designer'),
('user_36LwKkX9d7lcxmNoVeOmO5AMgXC', 'CloudWave', 'Full Stack Engineer'),
('user_36LwS1Twi0OQlRCt1ReErjZhjjJ', 'NextEdge', 'Project Manager'),
('user_36Lwa069wSfjnhrOxX5aYumDZ78', 'PrimeWorks', 'Software Engineer'),
('user_36LwpQ3kb4RPiZYrxhMmHiKkh6g', 'Orbit Tech', 'UX Lead');

-- 7 new employers
INSERT INTO users (clerk_id, username, first_name, last_name, email, phone, role, status)
VALUES
('user_36MXBxvWzKLVeMxB2okxvEUY9h2', 'emellaemployer6', 'Ella', 'Kim', 'ella.kim@sample.com', '403-555-2006', 'employer', 'under-review'),
('user_36MXJsNRQJOy5rj0tCyki5GMT0F', 'jackemployer7', 'Jack', 'Wu', 'jack.wu@sample.com', '403-555-2007', 'employer', 'under-review'),
('user_36MXTGp0nKn55nh59uncYuZ73sa', 'oliviaemployer8', 'Olivia', 'Tran', 'olivia.tran@sample.com', '403-555-2008', 'employer', 'under-review'),
('user_36MXZr6PNPVtDoQ7NtPP38OiWHV', 'lucasemployer9', 'Lucas', 'Zhao', 'lucas.zhao@sample.com', '403-555-2009', 'employer', 'under-review'),
('user_36MXgqFiwNOAvQoUv2GYKJst8l7', 'miaemployer10', 'Mia', 'Cheung', 'mia.cheung@sample.com', '403-555-2010', 'employer', 'under-review'),
('user_36MXogG7p1mO7syNAuvNYkL2ixV', 'benjaminemployer11', 'Benjamin', 'Leung', 'benjamin.leung@sample.com', '403-555-2011', 'employer', 'under-review'),
('user_36MXwXUpY52BJCd5u1001eSz4qH', 'isabellaemployer12', 'Isabella', 'Kwan', 'isabella.kwan@sample.com', '403-555-2012', 'employer', 'under-review');

INSERT INTO employers (clerk_id, company_name, company_role)
VALUES
('user_36MXBxvWzKLVeMxB2okxvEUY9h2', 'DataForge Inc', 'HR Lead'),
('user_36MXJsNRQJOy5rj0tCyki5GMT0F', 'Zenith Labs', 'Operations Manager'),
('user_36MXTGp0nKn55nh59uncYuZ73sa', 'TechNova Ltd', 'HR Assistant'),
('user_36MXZr6PNPVtDoQ7NtPP38OiWHV', 'EcoStream Energy', 'Recruitment Lead'),
('user_36MXgqFiwNOAvQoUv2GYKJst8l7', 'BluePeak Digital', 'People Manager'),
('user_36MXogG7p1mO7syNAuvNYkL2ixV', 'CoreByte Systems', 'HR Specialist'),
('user_36MXwXUpY52BJCd5u1001eSz4qH', 'HoloView Media', 'HR Coordinator');

-- =========================================
-- MESSAGE DATA INSERTS (For admin (user_34RDeo5WKU2K8s6AArG7XBAODkb))
-- =========================================
INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    ('user_34RDeo5WKU2K8s6AArG7XBAODkb', 'user_36MVovbCJp6OkcXlDRHpBtfuDfX', 'We noticed high interest in your Software Engineer posting. Can you handle the volume of applications?', NOW() - INTERVAL '1 hour', 'S'),
    ('user_36MVovbCJp6OkcXlDRHpBtfuDfX', 'user_34RDeo5WKU2K8s6AArG7XBAODkb', 'Yes, our HR team is on top of it. Thanks for checking in!', NOW() - INTERVAL '45 minutes', 'R');
INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    ('user_33TygiU42yjY3nfWxD5cEPCACv7', 'user_34RDeo5WKU2K8s6AArG7XBAODkb', 'My profile summary isn''t saving properly. Could an admin please look into this?', NOW() - INTERVAL '30 minutes', 'S'), 
    ('user_34RDeo5WKU2K8s6AArG7XBAODkb', 'user_33TygiU42yjY3nfWxD5cEPCACv7', 'Hello Lam, I''ve forwarded your issue to our tech team. We will update you shortly.', NOW() - INTERVAL '15 minutes', 'S');

INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    ('user_34RDeo5WKU2K8s6AArG7XBAODkb', 'user_36LuW3xqICj7ZjdFec7xVsmFp9L', 'Your advisor application is currently under review. Please confirm your primary company role.', NOW() - INTERVAL '10 minutes', 'S'),
    ('user_36LuW3xqICj7ZjdFec7xVsmFp9L', 'user_34RDeo5WKU2K8s6AArG7XBAODkb', 'My primary role is Data Analyst. Thanks!', NOW() - INTERVAL '5 minutes', 'S');

INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES (
    'user_36MVovbCJp6OkcXlDRHpBtfuDfX', 
    'user_34RDeo5WKU2K8s6AArG7XBAODkb', 
    'We are ready to post another job soon. What is the process for reviewing new employer posts?', 
    NOW(), 
    'S' 
);

-- =========================================
-- MESSAGE DATA INSERTS for Joy Wong (user_33TXk5AzMm228mH76TLzGUitM2U)
-- =========================================

-- Conversation 1: Joy (Member) to Admin
INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    (
        'user_33TXk5AzMm228mH76TLzGUitM2U', 
        'user_34RDeo5WKU2K8s6AArG7XBAODkb', 
        'I am having trouble accessing the "AI in Healthcare" conference details. Can you send me the link?', 
        NOW() - INTERVAL '3 hours', 
        'S'
    ),
    (
        'user_34RDeo5WKU2K8s6AArG7XBAODkb', 
        'user_33TXk5AzMm228mH76TLzGUitM2U', 
        'Hi Joy, I have verified the link. Please clear your cache and try again. Let me know if the issue persists.', 
        NOW() - INTERVAL '2 hours', 
        'R'
    );

-- Conversation 2: Advisor (Mary White) initiating contact with Joy (Member)
INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    (
        'user_36LsgiytrqklL4r6V2fqus5wfVo', 
        'user_33TXk5AzMm228mH76TLzGUitM2U', 
        'I saw your resume on the platform. Would you be interested in a quick 15-minute chat about your career goals?', 
        NOW() - INTERVAL '1 hour', 
        'S'
    ),
    (
        'user_33TXk5AzMm228mH76TLzGUitM2U', 
        'user_36LsgiytrqklL4r6V2fqus5wfVo', 
        'Yes, I would! Thank you for reaching out. Are you available next Tuesday afternoon?', 
        NOW() - INTERVAL '40 minutes', 
        'S'
    );

-- Conversation 3: Employer (TechCorp) sends an application status update to Joy
INSERT INTO message (sent_user_id, receive_user_id, content, sent_at, status)
VALUES
    (
        'user_36MVovbCJp6OkcXlDRHpBtfuDfX', 
        'user_33TXk5AzMm228mH76TLzGUitM2U', 
        'Your application for the Software Engineer position is now under review. We will contact you soon for an interview.', 
        NOW() - INTERVAL '10 minutes', 
        'S'
    );