# Структура хранения
## Проект: «Спортивные секции: запись и расписание»

## Логическая модель

| Таблица | Атрибуты | PK | FK |
|---|---|---|---|
| clients | id, name, phone, email, created_at | id | — |
| trainers | id, name, phone, specialization, is_active | id | — |
| sections | id, name, description, level | id | — |
| halls | id, name, capacity, address | id | — |
| lessons | id, trainer_id, hall_id, section_id, start_at, duration_min, capacity, status | id | trainer_id, hall_id, section_id |
| bookings | id, client_id, lesson_id, status, created_at | id | client_id, lesson_id |
| attendance | id, booking_id, visited, marked_at | id | booking_id |

## Физическая модель

**СУБД:** PostgreSQL

**Типы данных:**
- ID — SERIAL
- Строки — VARCHAR(50–255)
- Текст — TEXT
- Даты — TIMESTAMP
- Флаги — BOOLEAN

**Индексы:**
| Таблица | Индекс | Назначение |
|---|---|---|
| clients | UNIQUE(phone) | Уникальность телефона |
| lessons | INDEX(trainer_id) | Поиск занятий тренера |
| lessons | INDEX(hall_id) | Поиск занятий в зале |
| lessons | INDEX(section_id) | Поиск по секции |
| lessons | INDEX(start_at) | Поиск по дате |
| lessons | INDEX(status) | Фильтр по статусу |
| bookings | INDEX(client_id) | Записи клиента |
| bookings | INDEX(lesson_id) | Записи на занятие |
| bookings | INDEX(status) | Фильтр по статусу |
| attendance | INDEX(booking_id) | Отметки по записи |

## DDL
См. `sql/schema.sql`