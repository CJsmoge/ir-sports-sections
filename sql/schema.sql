-- DDL: Спортивные секции
-- PostgreSQL

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    level VARCHAR(20)
);

CREATE TABLE halls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    capacity INT NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL REFERENCES trainers(id),
    hall_id INT NOT NULL REFERENCES halls(id),
    section_id INT NOT NULL REFERENCES sections(id),
    start_at TIMESTAMP NOT NULL,
    duration_min INT NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'planned'
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id),
    lesson_id INT NOT NULL REFERENCES lessons(id),
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    visited BOOLEAN DEFAULT FALSE,
    marked_at TIMESTAMP
);

-- Индексы
CREATE INDEX idx_lessons_trainer ON lessons(trainer_id);
CREATE INDEX idx_lessons_hall ON lessons(hall_id);
CREATE INDEX idx_lessons_section ON lessons(section_id);
CREATE INDEX idx_lessons_start ON lessons(start_at);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_lesson ON bookings(lesson_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_attendance_booking ON attendance(booking_id);