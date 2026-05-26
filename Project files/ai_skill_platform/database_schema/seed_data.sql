-- ============================================================
-- AI SKILL INTELLIGENCE PLATFORM - SEED DATA
-- ============================================================
-- This script populates initial data for testing and development
-- Platform: Microsoft Azure SQL Database
-- Date: April 2026

-- ============================================================
-- 1. INSERT SAMPLE SKILLS TAXONOMY
-- ============================================================

-- Programming Languages
INSERT INTO dbo.Skills (SkillName, SkillCategory, Description, SkillLevel, DemandTrend, ProfilingFrequency, PredictedGrowthRate)
VALUES 
    ('Python', 'Programming Languages', 'High-level programming language', 'expert', 'rising', 95, 12.5),
    ('JavaScript', 'Programming Languages', 'Web development language', 'expert', 'stable', 90, 5.0),
    ('SQL', 'Programming Languages', 'Database query language', 'intermediate', 'stable', 88, 2.0),
    ('Java', 'Programming Languages', 'Object-oriented programming', 'advanced', 'stable', 85, 3.0),
    ('C#', 'Programming Languages', 'Microsoft .NET framework language', 'advanced', 'stable', 70, 4.0),
    ('Rust', 'Programming Languages', 'Systems programming language', 'beginner', 'rising', 45, 25.0),
    ('Go', 'Programming Languages', 'Cloud-native programming', 'beginner', 'rising', 50, 20.0),
    ('TypeScript', 'Programming Languages', 'Typed JavaScript superset', 'intermediate', 'rising', 75, 15.0);

-- Data Science & ML
INSERT INTO dbo.Skills (SkillName, SkillCategory, Description, SkillLevel, DemandTrend, ProfilingFrequency, PredictedGrowthRate)
VALUES 
    ('Machine Learning', 'Data Science & AI', 'ML algorithms and models', 'advanced', 'rising', 92, 18.0),
    ('Deep Learning', 'Data Science & AI', 'Neural networks and neural architectures', 'advanced', 'rising', 85, 20.0),
    ('TensorFlow', 'Data Science & AI', 'ML framework by Google', 'intermediate', 'rising', 75, 15.0),
    ('PyTorch', 'Data Science & AI', 'ML framework by Meta', 'intermediate', 'rising', 73, 17.0),
    ('Natural Language Processing', 'Data Science & AI', 'NLP and text analysis', 'advanced', 'rising', 80, 16.0),
    ('Computer Vision', 'Data Science & AI', 'Image and video processing', 'advanced', 'rising', 78, 18.0),
    ('Data Analysis', 'Data Science & AI', 'Statistical analysis and insights', 'intermediate', 'stable', 85, 8.0),
    ('Pandas', 'Data Science & AI', 'Data manipulation library', 'intermediate', 'stable', 80, 5.0),
    ('Scikit-learn', 'Data Science & AI', 'ML library', 'intermediate', 'stable', 75, 6.0),
    ('Azure Machine Learning', 'Data Science & AI', 'Azure ML platform', 'intermediate', 'rising', 55, 22.0);

-- Cloud & DevOps
INSERT INTO dbo.Skills (SkillName, SkillCategory, Description, SkillLevel, DemandTrend, ProfilingFrequency, PredictedGrowthRate)
VALUES 
    ('Azure', 'Cloud Platforms', 'Microsoft Azure cloud platform', 'intermediate', 'rising', 78, 18.0),
    ('AWS', 'Cloud Platforms', 'Amazon Web Services', 'advanced', 'stable', 92, 8.0),
    ('GCP', 'Cloud Platforms', 'Google Cloud Platform', 'intermediate', 'rising', 65, 14.0),
    ('Docker', 'DevOps & Containerization', 'Container technology', 'intermediate', 'stable', 88, 10.0),
    ('Kubernetes', 'DevOps & Containerization', 'Container orchestration', 'advanced', 'rising', 82, 12.0),
    ('CI/CD', 'DevOps & Containerization', 'Continuous integration and deployment', 'intermediate', 'stable', 80, 9.0),
    ('Terraform', 'DevOps & Containerization', 'Infrastructure as Code', 'intermediate', 'rising', 72, 15.0),
    ('Git', 'DevOps & Containerization', 'Version control system', 'expert', 'stable', 98, 2.0);

-- Web & Mobile
INSERT INTO dbo.Skills (SkillName, SkillCategory, Description, SkillLevel, DemandTrend, ProfilingFrequency, PredictedGrowthRate)
VALUES 
    ('React', 'Web Development', 'Frontend library by Meta', 'advanced', 'stable', 90, 6.0),
    ('Angular', 'Web Development', 'Frontend framework by Google', 'intermediate', 'declining', 65, -5.0),
    ('Vue.js', 'Web Development', 'Progressive frontend framework', 'intermediate', 'rising', 60, 8.0),
    ('Node.js', 'Web Development', 'JavaScript runtime', 'intermediate', 'stable', 88, 7.0),
    ('FastAPI', 'Web Development', 'Modern Python web framework', 'intermediate', 'rising', 68, 17.0),
    ('Django', 'Web Development', 'Python web framework', 'intermediate', 'stable', 72, 4.0),
    ('REST APIs', 'Web Development', 'RESTful API design', 'intermediate', 'stable', 85, 5.0),
    ('GraphQL', 'Web Development', 'Query language for APIs', 'intermediate', 'rising', 70, 12.0),
    ('React Native', 'Mobile Development', 'Mobile app framework', 'intermediate', 'stable', 65, 6.0),
    ('Flutter', 'Mobile Development', 'Mobile app framework', 'intermediate', 'rising', 60, 10.0);

-- Database & Data
INSERT INTO dbo.Skills (SkillName, SkillCategory, Description, SkillLevel, DemandTrend, ProfilingFrequency, PredictedGrowthRate)
VALUES 
    ('SQL Server', 'Databases', 'Microsoft SQL database', 'advanced', 'stable', 82, 3.0),
    ('PostgreSQL', 'Databases', 'Open-source SQL database', 'intermediate', 'stable', 80, 5.0),
    ('MongoDB', 'Databases', 'NoSQL database', 'intermediate', 'stable', 78, 6.0),
    ('Redis', 'Databases', 'In-memory data store', 'intermediate', 'stable', 75, 7.0),
    ('Elasticsearch', 'Databases', 'Search and analytics engine', 'intermediate', 'rising', 70, 10.0),
    ('Spark', 'Big Data', 'Big data processing framework', 'advanced', 'stable', 75, 8.0),
    ('Hadoop', 'Big Data', 'Distributed computing framework', 'advanced', 'declining', 60, -2.0),
    ('Kafka', 'Big Data', 'Streaming platform', 'intermediate', 'rising', 72, 12.0);

-- ============================================================
-- 2. INSERT SAMPLE USERS
-- ============================================================

DECLARE @UserId1 UNIQUEIDENTIFIER = NEWID();
DECLARE @UserId2 UNIQUEIDENTIFIER = NEWID();
DECLARE @UserId3 UNIQUEIDENTIFIER = NEWID();

INSERT INTO dbo.Users (Email, FirstName, LastName, CurrentRole, TargetRole, Department, EmploymentStatus, YearsOfExperience)
VALUES 
    ('john.doe@example.com', 'John', 'Doe', 'Senior Software Engineer', 'AI/ML Engineer', 'Engineering', 'employed', 8),
    ('jane.smith@example.com', 'Jane', 'Smith', 'Data Analyst', 'Machine Learning Specialist', 'Analytics', 'employed', 5),
    ('alex.johnson@example.com', 'Alex', 'Johnson', 'Junior Developer', 'Full Stack Engineer', 'Engineering', 'employed', 2);

-- ============================================================
-- 3. INSERT SAMPLE JOB POSTINGS
-- ============================================================

INSERT INTO dbo.JobPostings (JobTitle, CompanyName, Industry, SalaryMin, SalaryMax, Currency, Location, EmploymentType, ExperienceLevel, PostedDate, Source)
VALUES 
    ('Senior Machine Learning Engineer', 'TechCorp AI', 'Technology', 150000, 210000, 'USD', 'San Francisco, CA', 'full-time', 'senior', GETUTCDATE(), 'indeed'),
    ('Data Scientist', 'Analytics Plus', 'Finance', 110000, 160000, 'USD', 'New York, NY', 'full-time', 'intermediate', DATEADD(DAY, -5, GETUTCDATE()), 'indeed'),
    ('Full Stack Developer', 'WebFirst Inc', 'Software', 90000, 140000, 'USD', 'Austin, TX', 'full-time', 'intermediate', DATEADD(DAY, -10, GETUTCDATE()), 'indeed'),
    ('AI Research Scientist', 'DeepMind Labs', 'Technology', 170000, 250000, 'USD', 'Remote', 'full-time', 'senior', DATEADD(DAY, -2, GETUTCDATE()), 'linkedin');

-- ============================================================
-- 4. INSERT SAMPLE AI JOBS
-- ============================================================

INSERT INTO dbo.AIJobs (JobTitle, CompanyName, AICategory, SalaryRange, GrowthPotential, FutureRelevance, PostedDate, DataYear)
VALUES 
    ('Prompt Engineer', 'OpenAI', 'generative_ai', '$80K-$150K', 9, 10, GETUTCDATE(), 2026),
    ('LLM Fine-tuning Specialist', 'Anthropic', 'generative_ai', '$120K-$180K', 10, 10, GETUTCDATE(), 2026),
    ('Computer Vision Engineer', 'Tesla', 'computer_vision', '$130K-$190K', 8, 9, GETUTCDATE(), 2026),
    ('Robotics ML Specialist', 'Boston Dynamics', 'robotics', '$140K-$200K', 8, 8, DATEADD(DAY, -5, GETUTCDATE()), 2026),
    ('NLP Researcher', 'Google Brain', 'nlp', '$150K-$220K', 9, 10, DATEADD(DAY, -7, GETUTCDATE()), 2026);

-- ============================================================
-- 5. INSERT SAMPLE SKILLS PRIORITY RANKINGS
-- ============================================================

INSERT INTO dbo.SkillPriorityRankings (UserId, SkillId, Rank, PriorityScore, Justification, CalculatedAt)
SELECT TOP 3
    u.UserId,
    s.SkillId,
    ROW_NUMBER() OVER (PARTITION BY u.UserId ORDER BY s.ProfilingFrequency DESC),
    s.ProfilingFrequency,
    'High market demand and growth potential',
    GETUTCDATE()
FROM dbo.Users u, dbo.Skills s
WHERE s.SkillCategory IN ('Data Science & AI', 'Cloud Platforms')
AND u.Email = 'john.doe@example.com';

-- ============================================================
-- 6. SUMMARY
-- ============================================================
-- Seed data complete:
-- - 36 sample skills across 8 categories
-- - 3 sample users
-- - 4 sample job postings
-- - 5 sample AI jobs
-- - 3 skill priority rankings

PRINT 'Seed data insertion complete!'
