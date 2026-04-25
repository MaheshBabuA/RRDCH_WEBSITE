-- ====================================================================
-- RRDCH Website Database Schema
-- MySQL (InnoDB)
-- Created for WEBATHON 2026
-- ====================================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS rrdch_db;
USE rrdch_db;

-- ====================================================================
-- USERS TABLE (for patient/student login)
-- ====================================================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('patient', 'student', 'doctor', 'admin') DEFAULT 'patient',
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  city VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- ====================================================================
-- DEPARTMENTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) UNIQUE NOT NULL,
  short_name VARCHAR(50),
  description TEXT,
  head_name VARCHAR(100),
  contact_phone VARCHAR(15),
  contact_email VARCHAR(100),
  image_url VARCHAR(255),
  facilities JSON,
  postgraduate_specialization VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- ====================================================================
-- APPOINTMENTS TABLE (Core booking system)
-- ====================================================================
CREATE TABLE IF NOT EXISTS appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id VARCHAR(20) UNIQUE,
  patient_id INT,
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(15) NOT NULL,
  patient_email VARCHAR(100),
  department_id INT NOT NULL,
  department_name VARCHAR(100),
  doctor_name VARCHAR(100),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  confirmation_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_patient_phone (patient_phone),
  INDEX idx_status (status),
  INDEX idx_appointment_id (appointment_id)
);

-- ====================================================================
-- HOSTEL COMPLAINTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS hostel_complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  complaint_id VARCHAR(20) UNIQUE,
  student_id INT NOT NULL,
  student_name VARCHAR(100),
  student_phone VARCHAR(15),
  student_email VARCHAR(100),
  complaint_category ENUM('maintenance', 'food', 'hygiene', 'noise', 'other') NOT NULL,
  complaint_text TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  assigned_to VARCHAR(100),
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  INDEX idx_category (complaint_category),
  INDEX idx_complaint_id (complaint_id)
);

-- ====================================================================
-- FEEDBACK TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  user_name VARCHAR(100),
  user_email VARCHAR(100),
  user_phone VARCHAR(15),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  feedback_category ENUM('service', 'facility', 'staff', 'appointment', 'general') DEFAULT 'general',
  feedback_text TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'reviewed', 'archived') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);

-- ====================================================================
-- EVENTS TABLE (Calendar)
-- ====================================================================
CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_time TIME,
  location VARCHAR(200),
  category ENUM('academic', 'workshop', 'cultural', 'career', 'sports', 'seminar', 'other') DEFAULT 'academic',
  image_url VARCHAR(255),
  organizer VARCHAR(100),
  capacity INT,
  registered_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_date (event_date),
  INDEX idx_category (category)
);

-- ====================================================================
-- DOCTORS TABLE (for real-time availability)
-- ====================================================================
CREATE TABLE IF NOT EXISTS doctors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  name VARCHAR(100) NOT NULL,
  department_id INT NOT NULL,
  qualification VARCHAR(100),
  experience_years INT,
  phone VARCHAR(15),
  email VARCHAR(100),
  available_days JSON,
  available_hours JSON,
  availability_status ENUM('available', 'busy', 'offline', 'on_leave') DEFAULT 'offline',
  current_patient_queue INT DEFAULT 0,
  average_consultation_time INT DEFAULT 30,
  total_patients_today INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  INDEX idx_department_id (department_id),
  INDEX idx_availability_status (availability_status)
);

-- ====================================================================
-- COURSES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_name VARCHAR(150) NOT NULL,
  course_type ENUM('BDS', 'MDS', 'CERTIFICATE') NOT NULL,
  duration_years INT,
  intake INT,
  description TEXT,
  regulatory_body VARCHAR(100),
  syllabus_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- ANNOUNCEMENTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  target_audience ENUM('all', 'students', 'patients', 'staff') DEFAULT 'all',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_published BOOLEAN DEFAULT TRUE,
  published_date DATE,
  expires_on DATE,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_published_date (published_date)
);

-- ====================================================================
-- SEED DATA - DEPARTMENTS
-- ====================================================================
INSERT IGNORE INTO departments (name, short_name, description, head_name, contact_phone, postgraduate_specialization) VALUES
('Oral Medicine & Radiology', 'OMR', 'Diagnosis and treatment of oral diseases, diagnostic imaging services', 'Dr. Ramesh Kumar', '+91-9900112233', 'MDS in Oral Medicine'),
('Prosthetics & Crown & Bridge', 'Prostho', 'Restorative dentistry, prosthodontics, implant prosthetics', 'Dr. Anjali Singh', '+91-9900112234', 'MDS in Prosthodontics'),
('Oral & Maxillofacial Surgery', 'OMFS', 'Surgical procedures, implant placement, complex extractions, jaw surgery', 'Dr. Vikram Patel', '+91-9900112235', 'MDS in Oral Surgery'),
('Periodontology', 'Perio', 'Treatment of gum diseases, periodontal therapy, implant support', 'Dr. Savita Desai', '+91-9900112236', 'MDS in Periodontology'),
('Pedodontics & Preventive Dentistry', 'Pedo', 'Pediatric dentistry, preventive care, child behavior management', 'Dr. Meera Joshi', '+91-9900112237', 'MDS in Pedodontics'),
('Conservative Dentistry & Endodontics', 'Endo', 'Root canal therapy, restorative procedures, tooth preservation', 'Dr. Ashok Kumar', '+91-9900112238', 'MDS in Endodontics'),
('Orthodontics & Dentofacial Orthopedics', 'Ortho', 'Teeth alignment, malocclusion correction, facial development', 'Dr. Priya Reddy', '+91-9900112239', 'MDS in Orthodontics'),
('Public Health Dentistry', 'PHD', 'Community dentistry, epidemiology, health promotion', 'Dr. Rajesh Nair', '+91-9900112240', 'MDS in Public Health Dentistry'),
('Oral & Maxillofacial Pathology', 'OMP', 'Histopathological diagnosis, oral pathology analysis', 'Dr. Pooja Verma', '+91-9900112241', 'MDS in Oral Pathology'),
('Implantology', 'Implant', 'Dental implant planning, placement, restoration, bone grafting', 'Dr. Sanjay Singh', '+91-9900112242', 'Certificate in Implantology'),
('Orofacial Pain', 'OFP', 'Diagnosis and management of orofacial pain disorders', 'Dr. Neeta Sharma', '+91-9900112243', 'Specialization in Orofacial Pain');

-- ====================================================================
-- SEED DATA - COURSES
-- ====================================================================
INSERT IGNORE INTO courses (course_code, course_name, course_type, duration_years, intake, description, regulatory_body) VALUES
('BDS', 'Bachelor of Dental Surgery', 'BDS', 4, 60, 'Comprehensive 4-year undergraduate program in dental surgery with clinical training', 'DCI'),
('MDS', 'Master of Dental Surgery', 'MDS', 3, 50, 'Postgraduate specialization programs across various dental disciplines', 'DCI'),
('CERT-IMPLANT', 'Certificate in Implantology', 'CERTIFICATE', 1, 20, 'Advanced skill-based certificate program in dental implantology', 'DCI');

-- ====================================================================
-- SEED DATA - SAMPLE EVENTS
-- ====================================================================
INSERT IGNORE INTO events (title, description, event_date, event_time, location, category, organizer) VALUES
('Annual Dental Conference 2026', 'International speakers on latest techniques and clinical innovations in dentistry', '2026-04-20', '10:00:00', 'Main Auditorium', 'academic', 'Academic Affairs'),
('Student Workshop: Implant Dentistry', 'Hands-on practical workshop on implant placement techniques and protocols', '2026-04-25', '14:00:00', 'Surgical Clinic', 'workshop', 'Implantology Department'),
('Intra-College Sports Day', 'Annual sports competition featuring various games for all students', '2026-05-10', '08:00:00', 'Sports Complex', 'sports', 'Sports Committee'),
('Research Seminar: Oral Implants', 'Latest research presentations by faculty and postgraduate students', '2026-05-15', '16:00:00', 'Conference Hall', 'seminar', 'Research Cell'),
('Career Guidance Session', 'Discussion with alumni on career opportunities in dentistry and specializations', '2026-05-20', '15:00:00', 'Auditorium', 'career', 'Placement Cell');

-- ====================================================================
-- SEED DATA - SAMPLE DOCTORS (for real-time updates)
-- ====================================================================
INSERT IGNORE INTO doctors (name, department_id, qualification, experience_years, phone, availability_status, current_patient_queue) VALUES
('Dr. Ramesh Kumar', 1, 'BDS, MDS', 15, '+91-9900112250', 'available', 3),
('Dr. Anjali Singh', 2, 'BDS, MDS', 12, '+91-9900112251', 'busy', 7),
('Dr. Vikram Patel', 3, 'BDS, MDS', 18, '+91-9900112252', 'available', 2),
('Dr. Savita Desai', 4, 'BDS, MDS', 10, '+91-9900112253', 'available', 4),
('Dr. Meera Joshi', 5, 'BDS, MDS', 8, '+91-9900112254', 'busy', 6),
('Dr. Ashok Kumar', 6, 'BDS, MDS, PhD', 20, '+91-9900112255', 'available', 5),
('Dr. Priya Reddy', 7, 'BDS, MDS', 11, '+91-9900112256', 'offline', 0),
('Dr. Rajesh Nair', 8, 'BDS, MDS, MPH', 14, '+91-9900112257', 'available', 1),
('Dr. Pooja Verma', 9, 'BDS, MDS', 9, '+91-9900112258', 'available', 2),
('Dr. Sanjay Singh', 10, 'BDS, MDS', 16, '+91-9900112259', 'busy', 8),
('Dr. Neeta Sharma', 11, 'BDS, MDS', 7, '+91-9900112260', 'available', 3);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
-- CREATE INDEX idx_appointments_date_department ON appointments(appointment_date, department_id);
-- CREATE INDEX idx_complaints_student_status ON hostel_complaints(student_id, status);
-- CREATE INDEX idx_events_upcoming ON events(event_date, is_published);
-- CREATE INDEX idx_doctors_department_status ON doctors(department_id, availability_status);

-- ====================================================================
-- VIEW: Available Doctors Dashboard
-- ====================================================================
CREATE OR REPLACE VIEW available_doctors_dashboard AS
SELECT 
  d.id,
  d.name,
  d.phone,
  dept.name as department,
  d.availability_status,
  d.current_patient_queue,
  d.average_consultation_time,
  CEIL(d.current_patient_queue * d.average_consultation_time / 60) as estimated_wait_minutes
FROM doctors d
JOIN departments dept ON d.department_id = dept.id
WHERE d.availability_status != 'offline'
ORDER BY d.availability_status, d.current_patient_queue;

-- ====================================================================
-- VIEW: Upcoming Events
-- ====================================================================
CREATE OR REPLACE VIEW upcoming_events_view AS
SELECT 
  id,
  title,
  event_date,
  event_time,
  location,
  category,
  DATEDIFF(event_date, CURDATE()) as days_away
FROM events
WHERE is_published = TRUE AND event_date >= CURDATE()
ORDER BY event_date ASC;

-- ====================================================================
-- VERIFICATION QUERIES (uncomment to test)
-- ====================================================================
-- SELECT * FROM departments;
-- SELECT * FROM courses;
-- SELECT * FROM events;
-- SELECT * FROM available_doctors_dashboard;
-- SELECT * FROM upcoming_events_view;

-- ====================================================================
-- END OF SCHEMA
-- ====================================================================
