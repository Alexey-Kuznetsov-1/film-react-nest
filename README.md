# FILM! - API Сервис бронирования билетов в кинотеатр

## Описание проекта

API-сервис для онлайн-бронирования билетов в кинотеатр. Проект включает:
- Бэкенд на NestJS с использованием PostgreSQL и TypeORM
- Фронтенд на React (в папке frontend)

## Технологии

- **NestJS** - фреймворк для построения серверных приложений
- **TypeORM** - ORM для работы с PostgreSQL
- **PostgreSQL** - реляционная база данных
- **TypeScript** - типизированный JavaScript

## Установка

### Требования

- Node.js (версия 18 или выше)
- PostgreSQL (версия 13 или выше)
- npm или yarn

### Установка PostgreSQL

#### macOS
brew install postgresql
brew services start postgresql

#### Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

#### Windows
Скачайте установщик с официального сайта PostgreSQL: https://www.postgresql.org/download/windows/

### Настройка базы данных

1. Создайте пользователя и базу данных:

CREATE USER prac WITH PASSWORD 'prac';
CREATE DATABASE prac OWNER prac;
GRANT ALL PRIVILEGES ON DATABASE prac TO prac;

2. Выполните SQL-скрипты для создания таблиц и заполнения тестовыми данными:

# В корне проекта
psql -U prac -d prac -f backend/test/prac.init.sql
psql -U prac -d prac -f backend/test/prac.films.sql
psql -U prac -d prac -f backend/test/prac.shedules.sql

### Установка бэкенда

# Перейдите в папку бэкенда
cd backend

# Установите зависимости
npm install

# Создайте .env файл из примера
cp .env.example .env

Настройте .env файл:

DATABASE_DRIVER=postgres
DATABASE_URL=postgresql://prac:prac@localhost:5432/prac
DATABASE_USERNAME=prac
DATABASE_PASSWORD=prac
PORT=3000

### Запуск бэкенда

# Режим разработки
npm run start:dev

# Режим отладки
npm run start:debug

# Сборка
npm run build

# Продакшн
npm run start

### Установка фронтенда

# Перейдите в папку фронтенда
cd frontend

# Установите зависимости
npm install

# Создайте .env файл
cp .env.example .env

Настройте .env фронтенда:

VITE_API_URL=http://localhost:3000/api/afisha
VITE_CDN_URL=http://localhost:3000/content/afisha

### Запуск фронтенда

npm run dev

## API Эндпоинты

Бэкенд доступен по адресу: http://localhost:3000

### Фильмы

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | /api/afisha/films | Получить список всех фильмов |
| GET | /api/afisha/films/:id/schedule | Получить расписание фильма |

### Заказы

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | /api/afisha/order | Создать заказ (бронирование билетов) |

### Статика

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| GET | /content/afisha/* | Получение статических файлов (афиши) |

## Тестирование

### Запуск тестов

# В папке backend
npm run test

### Проверка API через curl

# Получить список фильмов
curl http://localhost:3000/api/afisha/films

# Получить расписание фильма
curl http://localhost:3000/api/afisha/films/0e33c7f6-27a7-4aa0-8e61-65d7e5effecf/schedule

# Забронировать билет
curl -X POST http://localhost:3000/api/afisha/order \
  -H "Content-Type: application/json" \
  -d '[{"film":"0e33c7f6-27a7-4aa0-8e61-65d7e5effecf","session":"f2e429b0-685d-41f8-a8cd-1d8cb63b99ce","daytime":"2024-06-28T10:00:53+03:00","row":1,"seat":1,"price":350}]'

## Структура проекта

backend/
├── src/
│   ├── films/          # Модуль фильмов
│   │   ├── dto/        # DTO для фильмов
│   │   ├── entities/   # Сущности Film и Schedule
│   │   ├── films.controller.ts
│   │   ├── films.service.ts
│   │   └── films.repository.ts
│   ├── order/          # Модуль заказов
│   │   ├── dto/        # DTO для заказов
│   │   ├── order.controller.ts
│   │   └── order.service.ts
│   ├── app.module.ts   # Главный модуль
│   └── main.ts         # Точка входа
├── test/               # Тесты и SQL скрипты
└── public/             # Статические файлы

frontend/
├── src/                # Исходники React
└── public/             # Статика фронтенда

## Деплой

Проект развернут и доступен по следующим адресам:

- **Фронтенд:** http://film-project.nomoreparties.site (или http://111.88.147.38)
- **pgAdmin:** http://film-project.nomoreparties.site:8080 (или http://111.88.147.38:8080)
  - Логин: `admin@example.com`
  - Пароль: `admin`
- **API:** http://film-project.nomoreparties.site/api/afisha

### Docker образы

Образы опубликованы в GitHub Container Registry:

- [film-backend](https://github.com/Alexey-Kuznetsov-1/film-react-nest/pkgs/container/film-react-nest%2Ffilm-backend)
- [film-frontend](https://github.com/Alexey-Kuznetsov-1/film-react-nest/pkgs/container/film-react-nest%2Ffilm-frontend)

### Запуск на сервере

```bash
# Скопировать docker-compose.yml на сервер
# Запустить контейнеры
docker compose pull
docker compose up -d