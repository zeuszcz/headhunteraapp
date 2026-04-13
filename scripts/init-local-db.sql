-- =============================================================================
-- Один раз: пользователь и база для headhunteraapp (локальный PostgreSQL + DBeaver)
-- =============================================================================
-- Подключение: суперпользователь (часто postgres), база postgres, порт вашего сервера.
-- Учётка приложения: логин headhunter / пароль headhunter / БД headhunter / порт 5432
-- =============================================================================

-- Шаг 1. Роль (идемпотентно)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'headhunter') THEN
    CREATE ROLE headhunter WITH LOGIN PASSWORD 'headhunter';
  END IF;
END$$;

-- Шаг 2. База (если база уже есть — будет ошибка, это нормально, идите к шагу 3)
CREATE DATABASE headhunter OWNER headhunter;
