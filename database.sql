CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    courseId INTEGER NOT NULL REFERENCES courses(id),
    created TIMESTAMP DEFAULT now()
);

INSERT INTO courses (name) VALUES 
('Английский язык'),
('Испанский язык'),
('Китайский язык')
ON CONFLICT (name) DO NOTHING;