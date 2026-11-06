const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// ВНИМАНИЕ: замени "12345" на свой пароль от PostgreSQL!
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Сначала подключаемся к дефолтной базе
  user: 'postgres',
  password: '0407' 
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web-school')));

// Функция для автоматического создания базы и таблиц
async function initDB() {
  try {
    // 1. Проверяем, есть ли база language_portal, если нет - создаем
    const dbCheck = await pool.query("SELECT 1 FROM pg_database WHERE datname = 'language_portal'");
    if (dbCheck.rowCount === 0) {
      await pool.query('CREATE DATABASE language_portal');
    }

    // 2. Переподключаемся уже к нашей базе
    const db = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'language_portal',
      user: 'postgres',
      password: '0407' // Тот же пароль
    });

    // 3. Создаем таблицы, если их нет
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        fullName VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        courseId INTEGER REFERENCES courses(id),
        created TIMESTAMP DEFAULT now()
      );
    `);

    // 4. Заполняем курсы, если таблица пустая
    const coursesCheck = await db.query('SELECT count(*) FROM courses');
    if (parseInt(coursesCheck.rows[0].count) === 0) {
      await db.query(`
        INSERT INTO courses (name) VALUES 
        ('Английский язык'), 
        ('Испанский язык'), 
        ('Китайский язык');
      `);
    }
    
    console.log('✅ База данных и таблицы успешно настроены!');
    return db;
  } catch (err) {
    console.error('❌ Ошибка при настройке базы:', err.message);
    process.exit(1);
  }
}

// Запускаем сервер после настройки БД
initDB().then((db) => {
  
  // API: получение курсов
  app.get('/api/courses', async (req, res) => {
    try {
      const { rows } = await db.query('SELECT id, name FROM courses ORDER BY id');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // API: отправка заявки
  app.post('/api/signup', async (req, res) => {
    const { fullName, phone, email, courseId } = req.body;
    const errors = {};

    if (!/^[А-ЯЁа-яё\s-]{3,100}$/.test(fullName || ''))
      errors.fullName = 'ФИО: только кириллица, пробелы и дефис (мин. 3 символа)';
    if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(phone || ''))
      errors.phone = 'Телефон: формат +7(XXX)-XXX-XX-XX';
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email || ''))
      errors.email = 'E-mail введён некорректно';
    if (!courseId) errors.courseId = 'Выберите курс';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      await db.query(
        'INSERT INTO applications (fullName, phone, email, courseId) VALUES ($1, $2, $3, $4)',
        [fullName.trim(), phone, email.trim(), courseId]
      );
      res.status(201).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => console.log(`🚀 Сайт: http://localhost:${PORT}`));
});