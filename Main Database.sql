-- =====================================================================
-- Alumni Portal - Complete PostgreSQL Schema & Production Seed Data
-- Compatible with PostgreSQL 13+ (uses built-in gen_random_uuid())
-- Run on an empty database:  psql -d alumni_portal -f Alumni_Portal_clean.sql
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS citext;    -- Case-insensitive emails
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- Fast fuzzy name / text search

-- ---------------------------------------------------------------------
-- Enum Types
-- ---------------------------------------------------------------------
CREATE TYPE user_role_enum            AS ENUM ('alumni', 'admin', 'staff');
CREATE TYPE gender_enum               AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE verification_method_enum  AS ENUM ('email', 'mobile', 'enrollment_number', 'admin_approval', 'linkedin');
CREATE TYPE verification_status_enum  AS ENUM ('pending', 'verified', 'failed', 'expired');
-- Event types cover both website UI filters and classic alumni activities
CREATE TYPE event_type_enum           AS ENUM (
    'virtual_event', 'online_session', 'department_meetup', 'in_person_event', 
    'summit', 'annual_event', 'competition', 'cultural_event', 'csr_event', 
    'social_event', 'reunion', 'webinar', 'workshop', 'networking', 'seminar', 'sports', 'other'
);
CREATE TYPE payment_method_enum       AS ENUM ('upi', 'card', 'net_banking', 'cheque', 'cash');
CREATE TYPE donation_status_enum      AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE gallery_category_enum     AS ENUM ('annual_event', 'virtual', 'networking', 'campus', 'academic', 'cultural', 'tech', 'competition', 'department', 'graduation', 'sports', 'social');
CREATE TYPE news_category_enum        AS ENUM ('reunion', 'community', 'success_story', 'programs', 'achievement', 'department_news', 'scholarship', 'platform_update');
CREATE TYPE contact_user_type_enum    AS ENUM ('alumnus', 'student', 'faculty', 'other');
CREATE TYPE contact_category_enum     AS ENUM ('general_reconnect', 'events', 'donations', 'career', 'transcripts_verification', 'mentorship', 'technical_issue', 'other');
CREATE TYPE contact_status_enum       AS ENUM ('new', 'in_progress', 'resolved', 'closed');
CREATE TYPE initiative_tag_enum       AS ENUM ('education_support', 'infrastructure', 'research_innovation', 'alumni_engagement');

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

-- Users table: Authentication & Core Credentials
CREATE TABLE users (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email          citext NOT NULL UNIQUE,
    phone          varchar(30) UNIQUE,
    password_hash  varchar(255) NOT NULL,
    role           user_role_enum NOT NULL DEFAULT 'alumni',
    is_active      boolean NOT NULL DEFAULT true,
    email_verified boolean NOT NULL DEFAULT false,
    phone_verified boolean NOT NULL DEFAULT false,
    last_login_at  timestamptz,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Departments table
CREATE TABLE departments (
    id           serial PRIMARY KEY,
    name         varchar(150) NOT NULL UNIQUE,
    short_name   varchar(20)  NOT NULL UNIQUE,
    slug         varchar(50)  NOT NULL UNIQUE,
    description  text,
    alumni_count integer NOT NULL DEFAULT 0,
    href         varchar(255),
    is_active    boolean NOT NULL DEFAULT true,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Members table: Detailed Alumni Profiles
CREATE TABLE members (
    id                  serial PRIMARY KEY,
    user_id             uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    enrollment_no       varchar(50) UNIQUE,
    name                varchar(200) NOT NULL,
    email               citext NOT NULL UNIQUE,
    phone               varchar(30),
    dob                 date,
    gender              gender_enum,
    avatar_url          text,
    degree              varchar(50) NOT NULL,
    graduation_year     char(4) NOT NULL,
    department_id       integer REFERENCES departments(id) ON DELETE SET NULL,
    institute           varchar(200) DEFAULT 'Tolani F. G. Polytechnic',
    company             varchar(200),
    role                varchar(200),
    industry            varchar(100),
    location            varchar(200),
    experience_years    smallint CHECK (experience_years IS NULL OR experience_years >= 0),
    linkedin_url        text,
    bio                 text CHECK (bio IS NULL OR char_length(bio) <= 500),
    verified            boolean NOT NULL DEFAULT false,
    verification_method verification_method_enum,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Skills Master
CREATE TABLE skills (
    id   serial PRIMARY KEY,
    name varchar(100) NOT NULL UNIQUE
);

-- Member Skills Many-to-Many
CREATE TABLE member_skills (
    member_id integer NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    skill_id  integer NOT NULL REFERENCES skills(id)  ON DELETE CASCADE,
    PRIMARY KEY (member_id, skill_id)
);

-- Member Achievements
CREATE TABLE member_achievements (
    id         serial PRIMARY KEY,
    member_id  integer NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    title      varchar(300) NOT NULL,
    year       char(4),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Events Master
CREATE TABLE events (
    id            serial PRIMARY KEY,
    title         varchar(300) NOT NULL,
    slug          varchar(150) NOT NULL UNIQUE,
    event_type    event_type_enum NOT NULL,
    description   text,
    event_date    date NOT NULL,
    start_time    time,
    end_time      time,
    location      varchar(300),
    is_online     boolean NOT NULL DEFAULT false,
    image_url     text DEFAULT '/campus-building.png',
    tags          text[] DEFAULT '{}',
    max_attendees integer CHECK (max_attendees IS NULL OR max_attendees > 0),
    is_published  boolean NOT NULL DEFAULT true,
    created_by    uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Event Registrations
CREATE TABLE event_registrations (
    id                   serial PRIMARY KEY,
    event_id             integer NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id            integer REFERENCES members(id) ON DELETE SET NULL,
    first_name           varchar(100) NOT NULL,
    last_name            varchar(100) NOT NULL,
    email                citext NOT NULL,
    phone                varchar(30) NOT NULL,
    graduation_year      char(4) NOT NULL,
    department           varchar(150) NOT NULL,
    company_designation  varchar(300),
    guest_count          smallint NOT NULL DEFAULT 0 CHECK (guest_count >= 0),
    special_requirements text,
    agreed_to_terms      boolean NOT NULL DEFAULT true,
    registered_at        timestamptz NOT NULL DEFAULT now(),
    UNIQUE (event_id, email)
);

-- Donation Initiatives
CREATE TABLE donation_initiatives (
    id            serial PRIMARY KEY,
    tag           initiative_tag_enum NOT NULL,
    title         varchar(300) NOT NULL,
    description   text,
    target_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (target_amount >= 0),
    raised_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (raised_amount >= 0),
    image_url     text DEFAULT '/campus-building.png',
    is_active     boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE donations (
    id               serial PRIMARY KEY,
    initiative_id    integer NOT NULL REFERENCES donation_initiatives(id) ON DELETE CASCADE,
    member_id        integer REFERENCES members(id) ON DELETE SET NULL,
    donor_full_name  varchar(200) NOT NULL,
    donor_email      citext NOT NULL,
    donor_phone      varchar(30),
    donor_pan        varchar(20),
    address_house_no varchar(50),
    address_area     varchar(200),
    address_city     varchar(100),
    address_state    varchar(100) DEFAULT 'Gujarat',
    address_pin_code varchar(10),
    amount           numeric(12,2) NOT NULL CHECK (amount > 0),
    payment_method   payment_method_enum NOT NULL DEFAULT 'upi',
    transaction_id   varchar(200),
    status           donation_status_enum NOT NULL DEFAULT 'pending',
    receipt_number   varchar(100),
    agreed_to_terms  boolean NOT NULL DEFAULT true,
    donated_at       timestamptz NOT NULL DEFAULT now(),
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Gallery Items
CREATE TABLE gallery_items (
    id           serial PRIMARY KEY,
    label        varchar(300) NOT NULL,
    category     gallery_category_enum NOT NULL,
    year         char(4),
    description  text,
    image_url    text NOT NULL DEFAULT '/campus-building.png',
    bg_color     varchar(20),
    sort_order   integer DEFAULT 0,
    is_published boolean NOT NULL DEFAULT true,
    uploaded_by  uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

-- News Articles
CREATE TABLE news_articles (
    id           serial PRIMARY KEY,
    title        varchar(500) NOT NULL,
    slug         varchar(250) NOT NULL UNIQUE,
    category     news_category_enum NOT NULL,
    author       varchar(200),
    read_time    varchar(20),
    excerpt      text,
    content      text,
    image_url    text DEFAULT '/campus-building.png',
    is_featured  boolean NOT NULL DEFAULT false,
    is_published boolean NOT NULL DEFAULT true,
    published_at timestamptz,
    created_by   uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Contact Inquiries
CREATE TABLE contact_inquiries (
    id               serial PRIMARY KEY,
    full_name        varchar(200) NOT NULL,
    email            citext NOT NULL,
    phone            varchar(30),
    user_type        contact_user_type_enum NOT NULL DEFAULT 'alumnus',
    department       varchar(150),
    batch_year       char(4),
    subject_category contact_category_enum NOT NULL DEFAULT 'general_reconnect',
    subject          varchar(500) NOT NULL,
    message          text NOT NULL,
    send_copy        boolean NOT NULL DEFAULT true,
    status           contact_status_enum NOT NULL DEFAULT 'new',
    resolved_by      uuid REFERENCES users(id) ON DELETE SET NULL,
    resolved_at      timestamptz,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
    id              serial PRIMARY KEY,
    email           citext NOT NULL UNIQUE,
    is_active       boolean NOT NULL DEFAULT true,
    subscribed_at   timestamptz NOT NULL DEFAULT now(),
    unsubscribed_at timestamptz
);

-- FAQs Master
CREATE TABLE faqs (
    id         serial PRIMARY KEY,
    question   text NOT NULL,
    answer     text NOT NULL,
    sort_order integer DEFAULT 0,
    is_active  boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Department Contacts
CREATE TABLE department_contacts (
    id         serial PRIMARY KEY,
    role_title varchar(200) NOT NULL,
    name       varchar(200) NOT NULL,
    department varchar(200),
    email      citext,
    phone      varchar(50),
    sort_order integer DEFAULT 0,
    is_active  boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Verification Requests (Signup Step 3 / OTP / Verification Links)
CREATE TABLE verification_requests (
    id          serial PRIMARY KEY,
    user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
    member_id   integer REFERENCES members(id) ON DELETE CASCADE,
    method      verification_method_enum NOT NULL CHECK (method IN ('email', 'mobile')),
    target      varchar(255) NOT NULL,          -- email address or phone number
    token_hash  varchar(255) NOT NULL,          -- hash of link token / OTP
    status      verification_status_enum NOT NULL DEFAULT 'pending',
    attempts    smallint NOT NULL DEFAULT 0,
    expires_at  timestamptz NOT NULL,
    verified_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Audit Log (Fixed entity_id to varchar(100) to support both integers and UUIDs)
CREATE TABLE audit_log (
    id          bigserial PRIMARY KEY,
    user_id     uuid REFERENCES users(id) ON DELETE SET NULL,
    action      varchar(100) NOT NULL,
    entity_type varchar(50),
    entity_id   varchar(100),
    metadata    jsonb DEFAULT '{}',
    ip_address  inet,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
CREATE INDEX idx_users_role            ON users (role);
CREATE INDEX idx_users_phone           ON users (phone);
CREATE INDEX idx_members_user_id       ON members (user_id);
CREATE INDEX idx_members_graduation    ON members (graduation_year);
CREATE INDEX idx_members_department    ON members (department_id);
CREATE INDEX idx_members_company       ON members (company);
CREATE INDEX idx_members_location      ON members (location);
CREATE INDEX idx_members_industry      ON members (industry);
CREATE INDEX idx_members_verified      ON members (verified);
CREATE INDEX idx_members_name_trgm     ON members USING gin (name gin_trgm_ops);
CREATE INDEX idx_verification_user     ON verification_requests (user_id, status);
CREATE INDEX idx_verification_member   ON verification_requests (member_id, status);
CREATE INDEX idx_verification_expires  ON verification_requests (expires_at);
CREATE INDEX idx_achievements_member   ON member_achievements (member_id);
CREATE INDEX idx_events_date           ON events (event_date);
CREATE INDEX idx_events_type           ON events (event_type);
CREATE INDEX idx_events_published      ON events (is_published);
CREATE INDEX idx_event_reg_member      ON event_registrations (member_id);
CREATE INDEX idx_donations_initiative  ON donations (initiative_id);
CREATE INDEX idx_donations_member      ON donations (member_id);
CREATE INDEX idx_donations_status      ON donations (status);
CREATE INDEX idx_donations_date        ON donations (donated_at);
CREATE INDEX idx_gallery_category      ON gallery_items (category);
CREATE INDEX idx_gallery_year          ON gallery_items (year);
CREATE INDEX idx_news_category         ON news_articles (category);
CREATE INDEX idx_news_featured         ON news_articles (is_featured);
CREATE INDEX idx_news_published        ON news_articles (is_published, published_at DESC);
CREATE INDEX idx_contact_status        ON contact_inquiries (status);
CREATE INDEX idx_contact_category      ON contact_inquiries (subject_category);
CREATE INDEX idx_newsletter_active     ON newsletter_subscriptions (is_active);
CREATE INDEX idx_audit_user            ON audit_log (user_id);
CREATE INDEX idx_audit_entity          ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_date            ON audit_log (created_at);

-- ---------------------------------------------------------------------
-- Trigger Functions
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Department Alumni Count Trigger Function
CREATE OR REPLACE FUNCTION update_department_alumni_count() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.department_id IS NOT NULL THEN
            UPDATE departments SET alumni_count = alumni_count + 1 WHERE id = NEW.department_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.department_id IS NOT NULL THEN
            UPDATE departments SET alumni_count = GREATEST(alumni_count - 1, 0) WHERE id = OLD.department_id;
        END IF;
        RETURN OLD;
    ELSE -- UPDATE
        IF OLD.department_id IS DISTINCT FROM NEW.department_id THEN
            IF OLD.department_id IS NOT NULL THEN
                UPDATE departments SET alumni_count = GREATEST(alumni_count - 1, 0) WHERE id = OLD.department_id;
            END IF;
            IF NEW.department_id IS NOT NULL THEN
                UPDATE departments SET alumni_count = alumni_count + 1 WHERE id = NEW.department_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
END;
$$;

-- Initiative Raised Amount Trigger Function (Fully handles amount & initiative updates)
CREATE OR REPLACE FUNCTION update_initiative_raised_amount() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.status = 'completed' THEN
            UPDATE donation_initiatives
               SET raised_amount = raised_amount + NEW.amount
             WHERE id = NEW.initiative_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Status changed to completed
        IF OLD.status <> 'completed' AND NEW.status = 'completed' THEN
            UPDATE donation_initiatives
               SET raised_amount = raised_amount + NEW.amount
             WHERE id = NEW.initiative_id;
        -- Status changed from completed to something else
        ELSIF OLD.status = 'completed' AND NEW.status <> 'completed' THEN
            UPDATE donation_initiatives
               SET raised_amount = GREATEST(raised_amount - OLD.amount, 0)
             WHERE id = OLD.initiative_id;
        -- Both completed, but amount or initiative_id updated
        ELSIF OLD.status = 'completed' AND NEW.status = 'completed' THEN
            IF OLD.initiative_id = NEW.initiative_id THEN
                IF OLD.amount <> NEW.amount THEN
                    UPDATE donation_initiatives
                       SET raised_amount = GREATEST(raised_amount + (NEW.amount - OLD.amount), 0)
                     WHERE id = NEW.initiative_id;
                END IF;
            ELSE
                UPDATE donation_initiatives
                   SET raised_amount = GREATEST(raised_amount - OLD.amount, 0)
                 WHERE id = OLD.initiative_id;
                UPDATE donation_initiatives
                   SET raised_amount = raised_amount + NEW.amount
                 WHERE id = NEW.initiative_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.status = 'completed' THEN
            UPDATE donation_initiatives
               SET raised_amount = GREATEST(raised_amount - OLD.amount, 0)
             WHERE id = OLD.initiative_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW v_member_directory AS
SELECT m.id, m.user_id, m.name, m.email, m.phone, m.degree, m.graduation_year,
       m.department_id, d.name AS department_name, d.short_name AS department_short,
       m.company, m.role, m.industry, m.location, m.experience_years, m.linkedin_url,
       m.bio, m.avatar_url, m.verified, m.institute, m.created_at,
       COALESCE((SELECT array_agg(s.name ORDER BY s.name)
                   FROM member_skills ms JOIN skills s ON s.id = ms.skill_id
                  WHERE ms.member_id = m.id), '{}'::varchar[]) AS skills,
       COALESCE((SELECT array_agg(ma.title ORDER BY ma.created_at)
                   FROM member_achievements ma
                  WHERE ma.member_id = m.id), '{}'::varchar[]) AS achievements
  FROM members m
  LEFT JOIN departments d ON d.id = m.department_id;

CREATE OR REPLACE VIEW v_upcoming_events AS
SELECT e.*, COALESCE(reg.registration_count, 0) AS registration_count
  FROM events e
  LEFT JOIN (SELECT event_id, count(*) AS registration_count
               FROM event_registrations GROUP BY event_id) reg ON reg.event_id = e.id
 WHERE e.event_date >= CURRENT_DATE AND e.is_published
 ORDER BY e.event_date ASC, e.start_time ASC NULLS LAST;

CREATE OR REPLACE VIEW v_initiative_progress AS
SELECT di.id, di.tag, di.title, di.description, di.target_amount, di.raised_amount,
       CASE WHEN di.target_amount > 0
            THEN round(di.raised_amount / di.target_amount * 100, 1)
            ELSE 0 END AS percentage,
       count(DISTINCT COALESCE(d.member_id::text, d.donor_email)) AS total_donors,
       count(d.id) AS total_donations,
       di.image_url, di.is_active
  FROM donation_initiatives di
  LEFT JOIN donations d ON d.initiative_id = di.id AND d.status = 'completed'
 GROUP BY di.id;

-- ---------------------------------------------------------------------
-- Seed Data
-- ---------------------------------------------------------------------

-- 1. Departments Seed (11 Departments from Website)
INSERT INTO departments (id, name, short_name, slug, description, alumni_count, href) VALUES
 (1,  'Computer Engineering',     'CSE',        'computer',   'Department of Computer Science & Engineering',           5248, '/departments/computer'),
 (2,  'Civil Engineering',        'Civil',      'civil',      'Department of Civil Engineering',                        3126, '/departments/civil'),
 (3,  'Electrical Engineering',   'Electrical', 'electrical', 'Department of Electrical Engineering',                   2860, '/departments/electrical'),
 (4,  'Mechanical Engineering',   'Mechanical', 'mechanical', 'Department of Mechanical Engineering',                   4112, '/departments/mechanical'),
 (5,  'CDDM',                     'CDDM',       'cddm',       'Costume Design & Dress Making',                          2340, '/departments/cddm'),
 (6,  'Information Technology',   'IT',         'it',         'Department of Information Technology',                   2100, '/departments/it'),
 (7,  'Electronics & Comm.',      'ECE',        'ece',        'Department of Electronics & Communication',              1800, '/departments/ece'),
 (8,  'Journalism & Mass Comm.',  'J&MC',       'journalism', 'Department of Journalism & Mass Communication',           950, '/departments/journalism'),
 (9,  'Business Administration',  'BBA',        'business',   'Department of Business Administration',                  1450, '/departments/business'),
 (10, 'Management Studies',       'MBA',        'management', 'Department of Management Studies',                        820, '/departments/management'),
 (11, 'Chemical Engineering',     'Chemical',   'chemical',   'Department of Chemical Engineering',                      680, '/departments/chemical');

-- 2. Initial Admin User (Default Password Hash for Admin@123)
INSERT INTO users (id, email, phone, password_hash, role, is_active, email_verified, phone_verified) VALUES
 ('a0000000-0000-0000-0000-000000000001', 'admin@tolani.ac.in', '+91 2836 260249', '$2b$10$eWjU942R0JvOqVj4p1XgxehT9kPvI7gM0B.qYd3i4A7NfT6HlU.62', 'admin', true, true, true);

-- 3. Initial Alumni Directory Members (16 Members from frontend store)
INSERT INTO members (id, name, degree, graduation_year, department_id, company, role, location, email, phone, linkedin_url, bio, experience_years, institute, verified) VALUES
 (1,  'Daksh Ahir',     'B.Tech',   '2025', 1,  'Google',       'Software Engineer',     'Bangalore, India', 'daksh.ahir@alumni.tolani.ac.in',    '+91 98765 43210', 'https://www.linkedin.com/in/daksh-ahir-759a863a7/',     'Passionate software engineer at Google, working on large-scale distributed systems. Former gold medalist at Tolani. Love open-source contributions and community building.', 2, 'Tolani F. G. Polytechnic', true),
 (2,  'Kunal Solanki',  'B.Tech',   '2024', 1,  'Microsoft',    'Product Manager',       'Hyderabad, India', 'kunal.solanki@alumni.tolani.ac.in', '+91 87654 32109', 'https://www.linkedin.com/in/kunal-solanki-3093613a8/',  'Product Manager at Microsoft Azure, driving cloud innovation. Alumni mentor and startup advisor.', 3, 'Tolani F. G. Polytechnic', true),
 (3,  'Khushal Bhatiya','BA (J&MC)','2026', 8,  'Zomato',       'Content Strategist',    'Gurugram, India',  'khushal.bhatiya@alumni.tolani.ac.in','+91 76543 21098', 'https://www.linkedin.com/in/khushal-bhatiya-33864942b/','Content Strategist at Zomato, crafting brand narratives. Passionate about digital media and creative storytelling.', 1, 'Tolani F. G. Polytechnic', true),
 (4,  'Raghav Rathod',  'BBA',      '2026', 9,  'Deloitte',     'Business Analyst',      'Mumbai, India',    'raghav.rathod@alumni.tolani.ac.in', '+91 65432 10987', 'https://www.linkedin.com/in/raghav-rathod-6b7945402/',  'Business Analyst at Deloitte Consulting. Expert in financial modelling and digital transformation.', 1, 'Tolani F. G. Polytechnic', true),
 (5,  'Bhoomi Sumbad',  'B.Tech',   '2026', 1,  'Amazon',       'SDE II',                'Chennai, India',   'bhoomi.sumbad@alumni.tolani.ac.in', '+91 54321 09876', 'https://www.linkedin.com/in/bhoomi-sumbad-1131683ba/',  'Software Development Engineer at Amazon Web Services. Backend systems enthusiast and competitive programmer.', 2, 'Tolani F. G. Polytechnic', true),
 (6,  'Dev Gouswami',   'BA (J&MC)','2020', 8,  'Times Of India','Senior Reporter',      'Kolkata, India',   'dev.gouswami@alumni.tolani.ac.in',  '+91 43210 98765', 'https://www.linkedin.com/in/dev-goswami-61467b2b9/',   'Senior Reporter at Times of India covering politics, culture and social affairs.', 5, 'Tolani F. G. Polytechnic', true),
 (7,  'Parth Pitroda',  'B.Tech',   '2023', 6,  'Infosys',      'Tech Lead',             'Pune, India',      'parth.pitroda@alumni.tolani.ac.in', '+91 32109 87654', 'https://www.linkedin.com/in/parth-pitroda1/',           'Tech Lead at Infosys managing enterprise application development. Passionate about clean code and agile methodologies.', 3, 'Tolani F. G. Polytechnic', true),
 (8,  'Solanki Yashvi', 'BBA',      '2021', 9,  'Accenture',    'Management Consultant', 'Noida, India',     'yashvi.solanki@alumni.tolani.ac.in','+91 21098 76543', 'https://www.linkedin.com/in/solankiyashvi',            'Management Consultant at Accenture Strategy. Specialist in digital transformation and ERP implementations.', 4, 'Tolani F. G. Polytechnic', true),
 (9,  'Priya Nair',     'B.Tech',   '2022', 7,  'TCS',          'Embedded Engineer',     'Kochi, India',     'priya.nair@alumni.tolani.ac.in',    '+91 91234 56789', 'https://www.linkedin.com/in/priyanair',                'Embedded systems engineer working on IoT devices at TCS Innovation Labs. Robotics enthusiast and IEEE volunteer.', 3, 'Tolani F. G. Polytechnic', true),
 (10, 'Vikram Tiwari',  'M.Tech',   '2021', 1,  'Wipro',        'Senior Architect',      'Bhopal, India',    'vikram.tiwari@alumni.tolani.ac.in', '+91 82345 67890', 'https://www.linkedin.com/in/vikramtiwari',             'Senior Solution Architect at Wipro. Specializes in enterprise cloud migrations and DevOps transformations. Guest faculty at Tolani.', 5, 'Tolani F. G. Polytechnic', true),
 (11, 'Meera Joshi',    'B.Tech',   '2020', 6,  'HCL',          'Data Scientist',        'Delhi, India',     'meera.joshi@alumni.tolani.ac.in',   '+91 73456 78901', 'https://www.linkedin.com/in/meerajoshi',               'Data Scientist at HCL Analytics building ML models for financial predictions. Kaggle expert. Published researcher in AI ethics.', 5, 'Tolani F. G. Polytechnic', true),
 (12, 'Aarav Singh',    'BBA',      '2023', 9,  'KPMG',         'Audit Associate',       'Ahmedabad, India', 'aarav.singh@alumni.tolani.ac.in',   '+91 64567 89012', 'https://www.linkedin.com/in/aaravsingh',               'Audit Associate at KPMG India. Specialist in statutory audit and risk advisory. CA finalist.', 2, 'Tolani F. G. Polytechnic', true),
 (13, 'Divya Patel',    'B.Tech',   '2024', 1,  'Flipkart',     'Full Stack Developer',  'Surat, India',     'divya.patel@alumni.tolani.ac.in',   '+91 55678 90123', 'https://www.linkedin.com/in/divyapatel',               'Full Stack Developer at Flipkart building scalable e-commerce solutions. React & Node specialist.', 2, 'Tolani F. G. Polytechnic', true),
 (14, 'Rahul Verma',    'MBA',      '2022', 10, 'HDFC Bank',    'Branch Manager',        'Jaipur, India',    'rahul.verma@alumni.tolani.ac.in',   '+91 46789 01234', 'https://www.linkedin.com/in/rahulverma',               'Branch Manager at HDFC Bank. Expert in retail banking and wealth management.', 4, 'Tolani F. G. Polytechnic', true),
 (15, 'Tanvi Desai',    'B.Tech',   '2021', 4,  'Tata Motors',  'Design Engineer',       'Vadodara, India',  'tanvi.desai@alumni.tolani.ac.in',   '+91 37890 12345', 'https://www.linkedin.com/in/tanvidesai',               'Automotive Design Engineer at Tata Motors, working on next-gen EV platforms.', 4, 'Tolani F. G. Polytechnic', true),
 (16, 'Karan Malhotra', 'B.Tech',   '2025', 2,  'L&T',          'Project Engineer',      'Chandigarh, India','karan.malhotra@alumni.tolani.ac.in','+91 28901 23456', 'https://www.linkedin.com/in/karanmalhotra',            'Project Engineer at L&T Construction managing large-scale infrastructure projects.', 1, 'Tolani F. G. Polytechnic', true);

-- 4. Skills Seed
INSERT INTO skills (id, name) VALUES
 (1, 'React'), (2, 'Node.js'), (3, 'Python'), (4, 'Cloud'), (5, 'Kubernetes'),
 (6, 'Product Strategy'), (7, 'Agile'), (8, 'Azure'), (9, 'Data Analytics'), (10, 'Leadership'),
 (11, 'Content Strategy'), (12, 'SEO'), (13, 'Social Media'), (14, 'Brand Writing'), (15, 'Analytics'),
 (16, 'Financial Modelling'), (17, 'Consulting'), (18, 'Excel'), (19, 'Power BI'), (20, 'Strategy'),
 (21, 'Java'), (22, 'AWS'), (23, 'System Design'), (24, 'Microservices'), (25, 'DSA'),
 (26, 'Investigative Journalism'), (27, 'Reporting'), (28, 'Editing'), (29, 'Video Production'),
 (30, 'Java EE'), (31, 'Spring Boot'), (32, 'Docker'), (33, 'CI/CD'), (34, 'Oracle DB'),
 (35, 'Management Consulting'), (36, 'SAP'), (37, 'Change Management'), (38, 'ERP'), (39, 'PMO'),
 (40, 'Embedded C'), (41, 'RTOS'), (42, 'IoT'), (43, 'PCB Design'), (44, 'ARM Cortex'),
 (45, 'Cloud Architecture'), (46, 'DevOps'), (47, 'Terraform'), (48, 'Solution Design'),
 (49, 'Machine Learning'), (50, 'TensorFlow'), (51, 'SQL'), (52, 'Data Visualization'),
 (53, 'Audit'), (54, 'Risk Advisory'), (55, 'IFRS'), (56, 'Financial Analysis'), (57, 'Compliance'),
 (58, 'MongoDB'), (59, 'GraphQL'), (60, 'TypeScript'),
 (61, 'Banking'), (62, 'Wealth Management'), (63, 'CRM'), (64, 'Risk Management'),
 (65, 'CAD/CAM'), (66, 'SolidWorks'), (67, 'ANSYS'), (68, 'EV Systems'), (69, 'GD&T'),
 (70, 'AutoCAD'), (71, 'STAAD Pro'), (72, 'Project Management'), (73, 'Structural Analysis'), (74, 'MS Project');

-- 5. Member Skills Map
INSERT INTO member_skills (member_id, skill_id) VALUES
 (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
 (2, 6), (2, 7), (2, 8), (2, 9), (2, 10),
 (3, 11), (3, 12), (3, 13), (3, 14), (3, 15),
 (4, 16), (4, 17), (4, 18), (4, 19), (4, 20),
 (5, 21), (5, 22), (5, 23), (5, 24), (5, 25),
 (6, 26), (6, 27), (6, 28), (6, 29),
 (7, 30), (7, 31), (7, 32), (7, 33), (7, 34),
 (8, 35), (8, 36), (8, 37), (8, 38), (8, 39),
 (9, 40), (9, 41), (9, 42), (9, 43), (9, 44),
 (10, 45), (10, 46), (10, 47), (10, 8), (10, 48),
 (11, 3), (11, 49), (11, 50), (11, 51), (11, 52),
 (12, 53), (12, 54), (12, 55), (12, 56), (12, 57),
 (13, 1), (13, 2), (13, 58), (13, 59), (13, 60),
 (14, 61), (14, 62), (14, 63), (14, 10), (14, 64),
 (15, 65), (15, 66), (15, 67), (15, 68), (15, 69),
 (16, 70), (16, 71), (16, 72), (16, 73), (16, 74);

-- 6. Member Achievements
INSERT INTO member_achievements (member_id, title, year) VALUES
 (1, 'Dean''s List 2024–25', '2025'),
 (1, 'Best Project Award 2025', '2025'),
 (1, 'Smart India Hackathon Winner', '2024'),
 (2, 'Microsoft Rising Star 2025', '2025'),
 (2, 'Alumni Mentor of the Year', '2024'),
 (3, 'Best Journalist Award 2026', '2026'),
 (3, 'Editor, Tolani Times', '2025'),
 (4, 'Deloitte Rising Talent 2026', '2026'),
 (4, 'CFA Level 1', '2025'),
 (5, 'Amazon Star Performer Q2 2026', '2026'),
 (5, 'Open Source Contributor', '2025'),
 (6, 'Press Club Award 2024', '2024'),
 (6, 'Tolani Distinguished Alumnus', '2025'),
 (7, 'Infosys Insta Award 2025', '2025'),
 (7, 'Certified Scrum Master', '2024'),
 (8, 'Accenture ACE Award 2024', '2024'),
 (8, 'Tolani Top 10 Graduates', '2021'),
 (9, 'TCS Star of the Month', '2024'),
 (9, 'IEEE Best Paper Award', '2023'),
 (9, 'Robotics Club Founder', '2022'),
 (10, 'Wipro Pinnacle Award', '2024'),
 (10, 'Guest Faculty Tolani 2024', '2024'),
 (10, 'AWS Certified Architect', '2023'),
 (11, 'Kaggle Expert Badge', '2024'),
 (11, 'HCL Excellence Award', '2023'),
 (11, 'Published AI Research Paper', '2022'),
 (12, 'KPMG Future Leader 2024', '2024'),
 (12, 'CA Finalist', '2025'),
 (12, 'NSC Gold Medal', '2023'),
 (13, 'Flipkart Spark Award', '2025'),
 (13, 'Women in Tech Lead', '2024'),
 (13, 'HackWithIndia Winner', '2024'),
 (14, 'HDFC Fastest Growth Award', '2025'),
 (14, 'Youngest Branch Manager', '2024'),
 (14, 'MBA Gold Medal', '2022'),
 (15, 'Tata Innovator Award 2024', '2024'),
 (15, 'Best Design Thesis 2021', '2021'),
 (15, 'SAE India Member', '2023'),
 (16, 'L&T Star Performer 2025', '2025'),
 (16, 'Best Civil Graduate 2025', '2025'),
 (16, 'LEED Green Associate', '2024');

-- 7. Events Seed (From Website events page)
INSERT INTO events (id, title, slug, event_type, description, event_date, start_time, location, is_online, tags, image_url) VALUES
 (1,  'Global Alumni Meet 2026',            'global-alumni-meet-2026',           'virtual_event',     'Join alumni from across the world for an inspiring virtual meet. This flagship event brings together thousands of Tolani alumni to reconnect, share experiences and celebrate achievements together.', '2026-06-25', '10:00:00', 'Online',                true,  ARRAY['Virtual', 'Networking'], '/campus-building.png'),
 (2,  'Career Growth Webinar',              'career-growth-webinar-2026',         'online_session',    'Learn from industry experts and explore new career opportunities. This session covers resume building, interview tips and the latest job market trends.', '2026-07-10', '16:00:00', 'Online',                true,  ARRAY['Career', 'Online'],      '/campus-building.png'),
 (3,  'Code. Connect. Contribute.',         'code-connect-contribute-2026',       'department_meetup', 'A meetup for developers to collaborate and build together. Showcase your projects, connect with tech alumni and contribute to open source initiatives.', '2026-08-18', '11:00:00', 'Tolani Campus',         false, ARRAY['Tech', 'In-Person'],     '/campus-building.png'),
 (4,  'Alumni Leadership Talk',             'alumni-leadership-talk-2026',        'in_person_event',   'An interactive session with accomplished alumni leaders. Gain insights on leadership, entrepreneurship and building a successful career.', '2026-08-30', '14:00:00', 'Tolani Auditorium',     false, ARRAY['Leadership', 'In-Person'], '/campus-building.png'),
 (5,  'Entrepreneurship Summit 2026',       'entrepreneurship-summit-2026',       'summit',            'A full-day summit dedicated to entrepreneurship and startup culture. Meet investors, mentors and fellow alumni entrepreneurs.', '2026-09-15', '09:00:00', 'Tolani Convention Hall',false, ARRAY['Startup', 'In-Person'],    '/campus-building.png'),
 (6,  'Women in Tech Webinar',              'women-in-tech-webinar-2026',         'online_session',    'A special webinar celebrating and empowering women in technology. Hear from inspiring female alumni working at leading tech companies globally.', '2026-09-22', '17:00:00', 'Online',                true,  ARRAY['Virtual', 'Diversity'],  '/campus-building.png'),
 (7,  'Civil Engineering Symposium',        'civil-engineering-symposium-2026',   'department_meetup', 'Explore the latest trends in infrastructure, smart cities and sustainable construction. A must-attend for Civil Department alumni.', '2026-10-10', '10:30:00', 'Tolani Campus',         false, ARRAY['Civil', 'In-Person'],    '/campus-building.png'),
 (8,  'Tolani Homecoming 2026',             'tolani-homecoming-2026',             'annual_event',      'The most awaited alumni event of the year. Relive campus memories, meet old friends and celebrate your Tolani journey together.', '2026-10-28', '11:00:00', 'Tolani Campus',         false, ARRAY['Annual', 'In-Person'],   '/campus-building.png'),
 (9,  'Mechanical Innovation Challenge',    'mechanical-innovation-challenge-2026','competition',     'A hands-on competition for Mechanical Department alumni to showcase engineering innovation and creative problem-solving skills.', '2026-11-05', '09:00:00', 'Tolani Labs',           false, ARRAY['Mechanical', 'In-Person'], '/campus-building.png'),
 (10, 'Annual CDDM Fashion Show',           'annual-cddm-fashion-show-2026',      'cultural_event',    'A grand fashion showcase by CDDM alumni and students, presenting original designs inspired by cultural heritage and modern trends.', '2026-11-20', '18:00:00', 'Tolani Auditorium',     false, ARRAY['CDDM', 'Cultural'],      '/campus-building.png'),
 (11, 'Alumni Donation Drive',              'alumni-donation-drive-2026',         'csr_event',         'Give back to your alma mater. Contribute to scholarships, lab upgrades and student welfare programs to support the next generation.', '2026-12-08', '10:00:00', 'Online',                true,  ARRAY['CSR', 'Virtual'],        '/campus-building.png'),
 (12, 'New Year Networking Bash',           'new-year-networking-bash-2026',      'social_event',      'End the year with an exciting networking event. Meet alumni from all departments, celebrate 2026 achievements and welcome 2027 together.', '2026-12-20', '19:00:00', 'Tolani Banquet Hall',    false, ARRAY['Networking', 'Social'],  '/campus-building.png');

-- 8. Donation Initiatives Seed
INSERT INTO donation_initiatives (id, tag, title, description, target_amount, raised_amount, image_url) VALUES
 (1, 'education_support',   'Scholarship Fund',          'Help deserving students achieve their dreams with financial support.',            500000, 250000, '/campus-building.png'),
 (2, 'infrastructure',      'Campus Development Fund',   'Build a modern and smart campus for future generations.',                         600000, 320000, '/campus-building.png'),
 (3, 'research_innovation', 'Research & Innovation Fund','Support cutting-edge research and innovation by our faculty and students.',      400000, 180000, '/campus-building.png'),
 (4, 'alumni_engagement',   'Alumni Engagement Fund',    'Connect, support and empower our alumni community.',                              200000,  95000, '/campus-building.png');

-- 9. Gallery Items Seed (From Website gallery page)
INSERT INTO gallery_items (id, label, bg_color, category, year, description, image_url) VALUES
 (1,  'Alumni Meet 2026',                 '#2a1a1f', 'annual_event', '2026', 'A grand gathering of Tolani alumni from across the globe, celebrating bonds and shared memories.',              '/campus-building.png'),
 (2,  'Virtual Alumni Reunion',           '#1a2030', 'virtual',      '2026', 'An online reunion connecting alumni from 50+ countries through screens and shared stories.',                '/campus-building.png'),
 (3,  'Networking Session',               '#1e2820', 'networking',   '2026', 'An evening of meaningful connections, collaborations and career conversations among alumni.',              '/campus-building.png'),
 (4,  'Campus Visit',                     '#203020', 'campus',       '2026', 'Alumni walked the hallways they once called home, reliving the golden days of their college years.',       '/campus-building.png'),
 (5,  'Guest Lecture Series',             '#1c1c2e', 'academic',     '2026', 'Distinguished alumni shared their journeys and insights with current students and fellow graduates.',      '/campus-building.png'),
 (6,  'Cultural Night 2026',              '#2e1c1c', 'cultural',     '2026', 'A vibrant evening filled with music, dance and art celebrating the diverse cultures of Tolani.',          '/campus-building.png'),
 (7,  'Computer Lab Hackathon',           '#1e293b', 'tech',         '2026', '48-hour coding marathon where Computer Department alumni built innovative solutions together.',           '/campus-building.png'),
 (8,  'Annual Tech Symposium',            '#9B2335', 'tech',         '2025', 'Industry leaders and alumni came together to discuss emerging technologies and future trends.',            '/campus-building.png'),
 (9,  'Coding Competition Finals',        '#0f766e', 'competition',  '2026', 'The exciting finale of the annual coding competition, showcasing top talent from all batches.',             '/campus-building.png'),
 (10, 'Civil Engineering Site Visit',     '#3b0764', 'department',   '2026', 'Civil Department alumni visited a major infrastructure project guided by their fellow alumni.',              '/campus-building.png'),
 (11, 'Department Graduation 2026',       '#451a03', 'graduation',   '2026', 'A proud and emotional ceremony marking the beginning of new journeys for the Class of 2026.',               '/campus-building.png'),
 (12, 'Tolani Sports Day',                '#1e3a5f', 'sports',       '2025', 'Alumni came together for friendly sporting competitions, reliving the energy of their campus days.',        '/campus-building.png'),
 (13, 'Electrical Lab Workshop',          '#064e3b', 'department',   '2026', 'A hands-on workshop in the electrical labs demonstrating power systems and automation projects.',             '/campus-building.png'),
 (14, 'CDDM Fashion Show',                '#500724', 'cultural',     '2026', 'A dazzling fashion showcase by CDDM alumni presenting original designs on a grand runway.',                '/campus-building.png'),
 (15, 'Mechanical Innovation Expo',       '#365314', 'department',   '2026', 'Mechanical alumni showcased cutting-edge design projects and engineering prototypes.',                     '/campus-building.png'),
 (16, 'Alumni Award Ceremony',            '#1c1917', 'annual_event', '2025', 'Celebrating outstanding alumni for their contributions to industry, society and innovation.',             '/campus-building.png'),
 (17, 'Sports Tournament 2025',           '#1e3a3a', 'sports',       '2025', 'A thrilling inter-batch sports tournament with cricket, football and badminton championships.',            '/campus-building.png'),
 (18, 'New Year Alumni Bash',             '#2d1b69', 'social',       '2025', 'A grand end-of-year celebration bringing alumni together to welcome the new year with joy.',               '/campus-building.png');

-- 10. News Articles Seed (From Website news page)
INSERT INTO news_articles (id, title, slug, category, author, read_time, excerpt, image_url, is_featured, is_published, published_at) VALUES
 (1,  'Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27', 'dar-es-salaam-tanzania-alumni-reunion-2026-27', 'reunion',          'Alumni Relations Team',      '3 min read', 'The Tolani Alumni Association successfully organized a grand reunion in Dar es Salaam, Tanzania, bringing together over 200 alumni from East Africa.', '/campus-building.png', true, true, '2026-08-05 10:00:00+00'),
 (2,  'Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion',   'building-stronger-alumni-community-northeast',  'community',        'Chapter Coordinators',       '4 min read', 'Alumni from the Northeast chapters of India gathered virtually for an emotional and inspiring reunion.', '/campus-building.png', true, true, '2026-08-03 14:00:00+00'),
 (3,  'Strengthening Connections: Virtual Alumni Reunion Central India',            'strengthening-connections-central-india',       'reunion',          'Regional Chapter Team',      '2 min read', 'A landmark virtual reunion brought together alumni from four central Indian states, fostering regional bonds and new professional collaborations.', '/campus-building.png', true, true, '2026-07-31 09:30:00+00'),
 (4,  'Tolani Alumni Entrepreneur Raises ₹50 Crore in Series B Funding',             'tolani-alumni-entrepreneur-series-b-funding',   'success_story',    'Alumni Portal Editorial',    '5 min read', 'Batch 2018 alumnus Mr. Harsh Mehta''s EdTech startup secured ₹50 crore in Series B funding from leading venture capital firms.', '/campus-building.png', false, true, '2026-07-25 11:00:00+00'),
 (5,  'New Mentorship Program Connects 500+ Alumni with Current Students',          'new-mentorship-program-connects-500-alumni',    'programs',         'Mentorship Cell',            '3 min read', 'The Alumni Mentorship Program 2026 launched with a record 500+ alumni volunteers mentoring final-year students across all departments.', '/campus-building.png', false, true, '2026-07-20 10:15:00+00'),
 (6,  'Tolani Polytechnic Ranks in Top 50 Polytechnics of India 2026',              'tolani-polytechnic-ranks-top-50-2026',          'achievement',      'College Relations',          '2 min read', 'Tolani Foundation Group of Institutes has been ranked among the Top 50 Polytechnic Institutions of India in 2026.', '/campus-building.png', false, true, '2026-07-15 15:45:00+00'),
 (7,  'Civil Department Alumni Lead Major Infrastructure Project in Gujarat',       'civil-alumni-lead-infrastructure-gujarat',      'department_news',  'Civil Dept. Alumni Cell',    '4 min read', 'A team of five Civil Department alumni is leading the engineering and project management of a ₹200 crore highway expansion project in Gujarat.', '/campus-building.png', false, true, '2026-07-10 12:00:00+00'),
 (8,  'Annual Alumni Scholarship Program Opens Applications for 2026-27',           'annual-alumni-scholarship-applications-2026-27','scholarship',      'Alumni Foundation',          '3 min read', 'The Tolani Alumni Scholarship Program is now accepting applications for the 2026-27 academic year.', '/campus-building.png', false, true, '2026-07-05 08:30:00+00'),
 (9,  'CDDM Alumni Showcased at International Fashion Week, Milan',                  'cddm-alumni-milan-fashion-week-2026',           'achievement',      'CDDM Alumni Cell',           '3 min read', 'Three CDDM Department alumni presented their original collections at the prestigious Milan Fashion Week 2026.', '/campus-building.png', false, true, '2026-06-28 17:00:00+00'),
 (10, 'Electrical Department Alumni Contribute to National Smart Grid Initiative',   'electrical-alumni-national-smart-grid',         'department_news',  'Electrical Dept. Alumni Cell','4 min read', 'Eight Electrical Department alumni are key contributors to India''s ambitious National Smart Grid Mission.', '/campus-building.png', false, true, '2026-06-20 14:20:00+00'),
 (11, 'Tolani Alumni Job Portal Crosses 1,000+ Active Listings Milestone',          'tolani-alumni-job-portal-1000-listings',        'platform_update',  'Alumni Portal Team',         '2 min read', 'The Tolani Alumni Job Portal has crossed a major milestone with over 1,000 active job listings posted by alumni employers.', '/campus-building.png', false, true, '2026-06-15 11:30:00+00'),
 (12, 'Mechanical Department Alumni Collaborate on EV Startup',                      'mechanical-alumni-collaborate-ev-startup',      'success_story',    'Mechanical Alumni Cell',     '5 min read', 'A group of five Mechanical Department alumni co-founded an Electric Vehicle component startup.', '/campus-building.png', false, true, '2026-06-08 16:00:00+00');

-- 11. FAQs Seed
INSERT INTO faqs (id, question, answer, sort_order) VALUES
 (1, 'How can I update my profile and contact details in the Alumni Directory?',
     'You can update your personal, academic, and professional details by logging into your portal account or by submitting an inquiry here with your full name, roll number, and graduation year.', 1),
 (2, 'How do I request official transcripts or degree verification from the institute?',
     'Transcript and verification requests are processed by the Student Section & Examination Cell. Select ''Transcripts & Verifications'' in the contact form, and our desk coordinator will share the official verification form and guidelines.', 2),
 (3, 'Can alumni organize a batch reunion or departmental meet on campus?',
     'Absolutely! We warmly welcome alumni to reconnect on campus. Please notify the Alumni Relations Cell at least 3 weeks prior so we can arrange seminar halls, faculty meetings, and campus access.', 3),
 (4, 'How can I volunteer to mentor current students or conduct a guest lecture?',
     'We are always eager to connect our accomplished alumni with students! Choose ''Mentorship & Guest Lectures'' in the contact form or email our Training & Placement Officer directly.', 4),
 (5, 'How can I contribute or donate to campus development initiatives?',
     'You can visit our dedicated Donation page (/donation) to explore ongoing scholarship and campus development funds, or get in touch with our Relations Desk for corporate CSR partnerships.', 5);

-- 12. Department Contacts Seed
INSERT INTO department_contacts (id, role_title, name, department, email, phone, sort_order) VALUES
 (1, 'Alumni Relations Officer',     'Prof. D. B. Patel', 'Central Alumni Cell',        'alumni-cell@tolani.ac.in', '+91 2836 260249 Ext. 104', 1),
 (2, 'Training & Placement Officer', 'Prof. K. M. Mehta', 'TPO & Industry Relations',   'placement@tolani.ac.in',   '+91 2836 260249 Ext. 112', 2),
 (3, 'Examination Cell Coordinator', 'Prof. S. R. Joshi', 'Student Section & Exams',    'exams@tolani.ac.in',       '+91 2836 260249 Ext. 108', 3),
 (4, 'IT & Portal Support',          'Mr. A. K. Sharma',  'IT Infrastructure',          'it-support@tolani.ac.in',  '+91 2836 260249 Ext. 120', 4);

-- ---------------------------------------------------------------------
-- Set Sequence Values (Safe from NULL)
-- ---------------------------------------------------------------------
SELECT setval('departments_id_seq',          COALESCE((SELECT max(id) FROM departments), 1));
SELECT setval('members_id_seq',              COALESCE((SELECT max(id) FROM members), 1));
SELECT setval('skills_id_seq',               COALESCE((SELECT max(id) FROM skills), 1));
SELECT setval('member_achievements_id_seq',  COALESCE((SELECT max(id) FROM member_achievements), 1));
SELECT setval('events_id_seq',               COALESCE((SELECT max(id) FROM events), 1));
SELECT setval('donation_initiatives_id_seq', COALESCE((SELECT max(id) FROM donation_initiatives), 1));
SELECT setval('gallery_items_id_seq',        COALESCE((SELECT max(id) FROM gallery_items), 1));
SELECT setval('news_articles_id_seq',        COALESCE((SELECT max(id) FROM news_articles), 1));
SELECT setval('faqs_id_seq',                 COALESCE((SELECT max(id) FROM faqs), 1));
SELECT setval('department_contacts_id_seq',  COALESCE((SELECT max(id) FROM department_contacts), 1));

-- ---------------------------------------------------------------------
-- Triggers (Created after seed insert so seed rows aren't double counted)
-- ---------------------------------------------------------------------
CREATE TRIGGER trg_donation_update_raised
    AFTER INSERT OR DELETE OR UPDATE OF status, amount, initiative_id ON donations
    FOR EACH ROW EXECUTE FUNCTION update_initiative_raised_amount();

CREATE TRIGGER trg_member_dept_count
    AFTER INSERT OR DELETE OR UPDATE OF department_id ON members
    FOR EACH ROW EXECUTE FUNCTION update_department_alumni_count();

-- Timestamps Keep Fresh Triggers
CREATE TRIGGER trg_users_updated_at               BEFORE UPDATE ON users                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_departments_updated_at         BEFORE UPDATE ON departments          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_members_updated_at             BEFORE UPDATE ON members              FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_events_updated_at              BEFORE UPDATE ON events               FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_initiatives_updated_at         BEFORE UPDATE ON donation_initiatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_donations_updated_at           BEFORE UPDATE ON donations            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_gallery_updated_at             BEFORE UPDATE ON gallery_items        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_news_updated_at                BEFORE UPDATE ON news_articles        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_contact_updated_at             BEFORE UPDATE ON contact_inquiries    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_faqs_updated_at                BEFORE UPDATE ON faqs                 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_department_contacts_updated_at BEFORE UPDATE ON department_contacts  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
