-- ==========================================
-- RRDCH DATABASE SCHEMA & SEED DATA
-- Database: rrdch_db
-- Tables: 9
-- ==========================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS rrdch_db;
USE rrdch_db;

-- ==========================================
-- TABLE CREATION
-- ==========================================

-- Table 1: users
-- Stores authentication data for admins, doctors, students, and patients
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'doctor', 'student', 'patient') NOT NULL DEFAULT 'patient',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 2: departments
-- Stores the 11 clinical and non-clinical dental departments
CREATE TABLE IF NOT EXISTS `departments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `head_of_department` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: doctors
-- Stores detailed profiles for doctors/faculty
CREATE TABLE IF NOT EXISTS `doctors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `department_id` INT,
    `full_name` VARCHAR(100) NOT NULL,
    `qualifications` VARCHAR(150),
    `specialization` VARCHAR(100),
    `experience_years` INT DEFAULT 0,
    `bio` TEXT,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
);

-- Table 4: courses
-- Stores academic courses offered by the college (BDS, MDS, etc.)
CREATE TABLE IF NOT EXISTS `courses` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `degree_level` ENUM('Undergraduate', 'Postgraduate', 'Diploma', 'Certificate') NOT NULL,
    `duration_years` DECIMAL(3,1) NOT NULL,
    `total_seats` INT NOT NULL,
    `description` TEXT
);

-- Table 5: students
-- Stores data about enrolled students
CREATE TABLE IF NOT EXISTS `students` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `course_id` INT,
    `full_name` VARCHAR(100) NOT NULL,
    `enrollment_number` VARCHAR(50) UNIQUE NOT NULL,
    `admission_year` YEAR NOT NULL,
    `current_year` INT DEFAULT 1,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE SET NULL
);

-- Table 6: patients
-- Stores patient records for the hospital
CREATE TABLE IF NOT EXISTS `patients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT DEFAULT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `phone_number` VARCHAR(20) NOT NULL,
    `blood_group` VARCHAR(5),
    `address` TEXT,
    `registered_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Table 7: appointments
-- Stores hospital appointments mapped to patients and departments/doctors
CREATE TABLE IF NOT EXISTS `appointments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `doctor_id` INT,
    `department_id` INT NOT NULL,
    `appointment_date` DATETIME NOT NULL,
    `reason_for_visit` TEXT,
    `status` ENUM('Scheduled', 'Completed', 'Cancelled', 'No Show') DEFAULT 'Scheduled',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE
);

-- Table 8: events
-- Stores college and hospital events, news, and announcements
CREATE TABLE IF NOT EXISTS `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `event_date` DATE NOT NULL,
    `location` VARCHAR(150),
    `is_published` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 9: contact_inquiries
-- Stores messages submitted through the website's contact form
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `visitor_name` VARCHAR(100) NOT NULL,
    `visitor_email` VARCHAR(100) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed exactly 11 valid dental departments for RRDCH
INSERT INTO `departments` (`name`, `description`, `head_of_department`) VALUES
('Prosthodontics and Crown & Bridge', 'Deals with the restoration and maintenance of oral function by replacing missing teeth.', 'Dr. A. Sharma'),
('Conservative Dentistry and Endodontics', 'Focuses on the conservation of teeth, diagnosis and treatment of dental caries and pulp ailments.', 'Dr. R. K. Iyer'),
('Oral and Maxillofacial Surgery', 'Treats many diseases, injuries and defects in the head, neck, face, and jaws.', 'Dr. V. Patil'),
('Periodontology', 'Study of the specialized system of hard and soft tissues that supports your teeth and maintains their position in the jaw.', 'Dr. S. Reddy'),
('Orthodontics and Dentofacial Orthopedics', 'Deals with diagnosis, prevention, interception, and correction of malocclusion.', 'Dr. M. Menon'),
('Oral Medicine and Radiology', 'Involves clinical diagnosis and medical management of mucosal diseases and radiographic evaluation.', 'Dr. K. Joshi'),
('Public Health Dentistry', 'Focuses on dental health education, epidemiology, and the prevention of dental diseases.', 'Dr. L. Kumar'),
('Pediatric and Preventive Dentistry', 'Provides both primary and comprehensive preventive and therapeutic oral health care for infants and children.', 'Dr. P. Sen'),
('Oral Pathology and Microbiology', 'Deals with the nature, identification, and management of diseases affecting the oral and maxillofacial regions.', 'Dr. T. Das'),
('Dental Anatomy and Oral Histology', 'Focuses on the morphological characteristics and microscopic study of tissues in the oral cavity.', 'Dr. S. Gupta'),
('Implantology', 'Specialized department focusing exclusively on advanced dental implant procedures and clinical research.', 'Dr. N. Rao');


-- ==========================================
-- USER CREATION AND PERMISSIONS
-- ==========================================

-- Create the test user 'rrdch_user' with the specific password
CREATE USER IF NOT EXISTS 'rrdch_user'@'localhost' IDENTIFIED BY 'RrdchSecure123!';

-- Grant all privileges to the user on the rrdch_db database
GRANT ALL PRIVILEGES ON rrdch_db.* TO 'rrdch_user'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Test Connection / Query
-- You can verify by running: SELECT NOW();
