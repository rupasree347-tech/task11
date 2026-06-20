-- ==========================================
-- TASK 11 DATABASE
-- Authentication & RBAC System
-- PostgreSQL
-- ==========================================

-- Create Database


-- Connect to database
-- \c task11_db


-- ==========================================
-- ROLES TABLE
-- ==========================================

CREATE TABLE roles (

    id SERIAL PRIMARY KEY,

    name VARCHAR(20) UNIQUE NOT NULL,

    description VARCHAR(255)

);

INSERT INTO roles (name, description) VALUES
('Admin', 'Full system access'),
('Manager', 'Dashboard and reporting access'),
('Instructor', 'Access to student records'),
('Student', 'Access to personal profile only');


-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL
    REFERENCES roles(name)
    CHECK (
        role IN (
            'Admin',
            'Manager',
            'Instructor',
            'Student'
        )
    ),

    last_login TIMESTAMP,

    status VARCHAR(20) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- ==========================================
-- LOGIN HISTORY TABLE
-- ==========================================

CREATE TABLE login_history (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_login_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);


-- ==========================================
-- SESSIONS TABLE
-- ==========================================

CREATE TABLE sessions (

    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    token TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_session_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE

);


-- ==========================================
-- SAMPLE USERS
-- Password: 123456
-- ==========================================

INSERT INTO users
(
    name,
    email,
    password,
    role,
    status
)
VALUES
(
    'Admin User',
    'admin@gmail.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi8Fj2hY6g7j8mJkQv3mQ8L5S0y9QmG',
    'Admin',
    'Active'
);

INSERT INTO users
(
    name,
    email,
    password,
    role,
    status
)
VALUES
(
    'Manager User',
    'manager@gmail.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi8Fj2hY6g7j8mJkQv3mQ8L5S0y9QmG',
    'Manager',
    'Active'
);

INSERT INTO users
(
    name,
    email,
    password,
    role,
    status
)
VALUES
(
    'Instructor User',
    'instructor@gmail.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi8Fj2hY6g7j8mJkQv3mQ8L5S0y9QmG',
    'Instructor',
    'Active'
);

INSERT INTO users
(
    name,
    email,
    password,
    role,
    status
)
VALUES
(
    'Student User',
    'student@gmail.com',
    '$2a$10$7EqJtq98hPqEX7fNZaFWoOhi8Fj2hY6g7j8mJkQv3mQ8L5S0y9QmG',
    'Student',
    'Active'
);


-- ==========================================
-- SAMPLE LOGIN HISTORY
-- ==========================================

INSERT INTO login_history (user_id)
VALUES
(1),
(1),
(2),
(3),
(4);


-- ==========================================
-- SAMPLE SESSIONS
-- ==========================================

INSERT INTO sessions
(
    user_id,
    token
)
VALUES
(
    1,
    'sample_admin_session_token'
);

INSERT INTO sessions
(
    user_id,
    token
)
VALUES
(
    2,
    'sample_manager_session_token'
);


-- ==========================================
-- USEFUL QUERIES
-- ==========================================

-- Total Users

SELECT COUNT(*) AS total_users
FROM users;


-- Active Users

SELECT COUNT(*) AS active_users
FROM users
WHERE status = 'Active';


-- Users By Role

SELECT
role,
COUNT(*) AS count
FROM users
GROUP BY role;


-- Total Logins

SELECT COUNT(*) AS total_logins
FROM login_history;


-- User Profile

SELECT
id,
name,
email,
role,
last_login,
status
FROM users
WHERE id = 1;


-- All Users

SELECT *
FROM users;


-- All Login History

SELECT *
FROM login_history;


-- All Sessions

SELECT *
FROM sessions;