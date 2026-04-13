-- Выполнить в DBeaver, подключившись к базе headhunter как суперпользователь (postgres).
-- Нужно один раз после создания БД, чтобы пользователь headhunter мог создавать таблицы.

GRANT ALL ON SCHEMA public TO headhunter;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO headhunter;
