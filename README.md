# Athletics Records Management System

![Symfony](https://img.shields.io/badge/Symfony-7.2-000000?style=flat&logo=symfony&logoColor=white)
![API Platform](https://img.shields.io/badge/API%20Platform-4.1-38AFDE?style=flat&logo=api-platform&logoColor=white)
![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
[![MySQL](https://img.shields.io/badge/MySQL-8.2-blue.svg?style=flat-square&logo=mysql)](https://www.mysql.com/)

A comprehensive full-stack web application for managing athletics records, featuring a modern API-first architecture with Symfony 7.2 backend and Nuxt.js 3 frontend.

## 🏃‍♀️ Features

### Athlete Management
- ✅ Complete CRUD operations for athlete profiles
- 📸 Profile image upload with VichUploaderBundle integration
- 🔍 Advanced filtering and search capabilities
- 📊 Performance tracking and historical data
- 🏆 Achievement and personal best tracking

### Record Management
- 📈 Track athletic performance across all disciplines
- 🕐 Historical record keeping with timestamps
- 🥇 Personal best and season best identification
- 📋 Detailed performance analytics
- 🎯 Goal setting and progress tracking

### Discipline Management
- 🏃 Running events (sprints, middle distance, long distance, relays)
- 🦘 Jumping events (long jump, high jump, pole vault, triple jump)
- 🥌 Throwing events (shot put, discus, hammer, javelin)
- ⚙️ Configurable discipline types and categories
- 📏 Custom measurement units and formats

### Location Management
- 🗺️ Venue management with GPS coordinates
- 🏟️ Track and field facility information
- 👥 Capacity and facility details
- 🌍 Geographic mapping integration
- 📍 Event location tracking

### Authentication & Authorization
- 🔐 JWT-based authentication system
- 👤 Role-based access control (ADMIN, USER)
- 🛡️ Secure API endpoints
- 🔑 Token refresh and validation
- 👥 User management commands

### Modern UI/UX
- 📱 Fully responsive design with Tailwind CSS
- 🎨 Modern component library with Nuxt UI
- 🧭 Breadcrumb navigation system
- 🔄 Real-time data updates with TanStack Query
- 🎭 Interactive forms with validation
- 🗂️ Advanced filtering and sorting

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Nuxt.js 3     │◄──►│   Symfony 7.2   │◄──►│   PostgreSQL    │
│   Vue 3 + TS    │    │   API Platform  │    │   Docker        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Entity Relationships
```
User ──┐
        │
        ▼
     Record ◄──► Athlete
        │
        ├──► Discipline
        └──► Location
```

## 🛠️ Technology Stack

### Backend
- **Symfony 7.2**: Modern PHP framework with autowiring and annotations
- **API Platform 4.1**: Hypermedia and GraphQL API development
- **Doctrine ORM**: Database abstraction layer with entity management
- **PostgreSQL 16**: Robust relational database with JSON support
- **Lexik JWT Bundle**: JWT authentication implementation
- **VichUploaderBundle**: File upload management
- **Faker**: Test data generation for fixtures

### Frontend
- **Nuxt.js 3**: Universal Vue.js framework with SSR/SPA modes
- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **TypeScript 5**: Static type checking and enhanced IDE support
- **Tailwind CSS 3**: Utility-first CSS framework
- **Nuxt UI**: Pre-built component library
- **Heroicons**: Beautiful hand-crafted SVG icons
- **Pinia**: Vue state management
- **TanStack Vue Query**: Data fetching and caching

### Infrastructure
- **Docker Compose**: Containerized development environment
- **Vite**: Fast frontend build tool
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **PHPStan**: PHP static analysis

## 🚀 Installation Guide

### Prerequisites
- **PHP 8.3+** with extensions: `pdo_pgsql`, `intl`, `opcache`, `apcu`
- **Composer 2.6+** for PHP dependency management
- **Node.js 18+** and **npm 9+** for frontend development
- **Docker & Docker Compose** for database management
- **Git** for version control

### Step-by-Step Setup

#### 1. Clone and Navigate
```bash
git clone <repository-url>
cd project
```

#### 2. Backend Setup
```bash
# Install PHP dependencies
composer install

# Copy environment configuration
cp .env .env.local

# Edit database credentials in .env.local
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
```

#### 3. Database Setup
```bash
# Start PostgreSQL container
docker-compose up -d

# Create database
php bin/console doctrine:database:create

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Load sample data (50 athletes, 12 disciplines, 9 locations, 500+ records)
php bin/console doctrine:fixtures:load --no-interaction
```

#### 4. JWT Configuration
```bash
# Generate JWT keypair
php bin/console lexik:jwt:generate-keypair

# Verify keys are created
ls -la config/jwt/
```

#### 5. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install Node.js dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

#### 6. Start Development Servers

**Backend (Terminal 1):**
```bash
# Start Symfony development server
symfony serve -d

# Or use PHP built-in server
php -S localhost:8000 -t public/
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

**Application URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs

## 🗄️ Database Setup

### Migration System
```bash
# Create new migration
php bin/console make:migration

# Execute pending migrations
php bin/console doctrine:migrations:migrate

# Check migration status
php bin/console doctrine:migrations:status
```

### Data Fixtures
The application includes comprehensive data fixtures:

```bash
# Load all fixtures
php bin/console doctrine:fixtures:load

# Load specific fixture group
php bin/console doctrine:fixtures:load --group=athletes
```

**Generated Test Data:**
- 50 athletes with diverse profiles and images
- 12 athletic disciplines across all categories
- 9 locations with realistic facility data
- 500+ performance records with historical data
- Admin and regular user accounts

### Database Schema
- **Athletes**: Personal information, nationality, date of birth, profile images
- **Records**: Performance data, timestamps, personal bests, seasonal records
- **Disciplines**: Sport categories, measurement units, record formats
- **Locations**: Venue details, GPS coordinates, facility specifications
- **Users**: Authentication data, roles, permissions

## 👤 User Management

### Create Administrative User
```bash
# Interactive user creation
php bin/console app:create-user

# Example usage
php bin/console app:create-user admin@example.com "SecurePassword123" ADMIN "John Doe"
```

### User Roles
- **ADMIN**: Full access to all resources and management features
- **USER**: Read access and limited write permissions

### Authentication Endpoints
```bash
# Login request
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'

# Access protected endpoint
curl -X GET http://localhost:8000/api/v1/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Athletes API

#### List Athletes
```http
GET /api/v1/athletes
```
**Query Parameters:**
- `page` (int): Page number for pagination
- `itemsPerPage` (int): Items per page (default: 30)
- `firstName` (string): Filter by first name
- `lastName` (string): Filter by last name
- `nationality` (string): Filter by nationality
- `order[firstName]` (asc|desc): Sort by first name

**Example Response:**
```json
{
  "hydra:member": [
    {
      "@id": "/api/v1/athletes/1",
      "@type": "Athlete",
      "id": 1,
      "firstName": "Usain",
      "lastName": "Bolt",
      "dateOfBirth": "1986-08-21",
      "nationality": "JM",
      "profileImageUrl": "/uploads/athletes/bolt.jpg"
    }
  ],
  "hydra:totalItems": 50,
  "hydra:view": {
    "@type": "hydra:PartialCollectionView",
    "hydra:first": "/api/v1/athletes?page=1",
    "hydra:last": "/api/v1/athletes?page=2"
  }
}
```

#### Create Athlete (with Image Upload)
```http
POST /api/v1/athletes
Content-Type: multipart/form-data
```
**Form Data:**
- `firstName` (string, required)
- `lastName` (string, required)
- `dateOfBirth` (date, required, format: YYYY-MM-DD)
- `nationality` (string, required, ISO 3166-1 alpha-2)
- `profileImageFile` (file, optional, max 5MB, jpg/png/webp)

#### Update Athlete (JSON)
```http
PUT /api/v1/athletes/{id}
Content-Type: application/json
```
```json
{
  "firstName": "Usain",
  "lastName": "Bolt",
  "dateOfBirth": "1986-08-21",
  "nationality": "JM"
}
```

### Records API

#### List Records
```http
GET /api/v1/records
```
**Query Parameters:**
- `athlete` (int): Filter by athlete ID
- `discipline` (int): Filter by discipline ID
- `location` (int): Filter by location ID
- `recordedAt[after]` (datetime): Records after date
- `recordedAt[before]` (datetime): Records before date
- `order[recordedAt]` (asc|desc): Sort by date

#### Create Record
```http
POST /api/v1/records
Content-Type: application/json
```
```json
{
  "value": "9.58",
  "recordedAt": "2009-08-16T20:00:00Z",
  "athlete": "/api/v1/athletes/1",
  "discipline": "/api/v1/disciplines/1",
  "location": "/api/v1/locations/1"
}
```

### Disciplines API

#### List Disciplines
```http
GET /api/v1/disciplines
```
**Query Parameters:**
- `type` (string): Filter by type (RUN, JUMP, THROW)
- `runningType` (string): Filter running events (SPRINT, MIDDLE_DISTANCE, LONG_DISTANCE, RELAY)

#### Example Disciplines Response
```json
{
  "hydra:member": [
    {
      "@id": "/api/v1/disciplines/1",
      "@type": "Discipline",
      "id": 1,
      "name": "100m",
      "type": "RUN",
      "runningType": "SPRINT",
      "unit": "s"
    }
  ]
}
```

### Locations API

#### List Locations
```http
GET /api/v1/locations
```

#### Example Locations Response
```json
{
  "hydra:member": [
    {
      "@id": "/api/v1/locations/1",
      "@type": "Location",
      "id": 1,
      "name": "Olympic Stadium",
      "city": "London",
      "country": "GB",
      "latitude": 51.5383,
      "longitude": -0.0164,
      "capacity": 80000
    }
  ]
}
```

### Key Components

#### Backend Architecture
- **Entities**: Core business models with Doctrine ORM
- **Repositories**: Data access layer with custom queries
- **API Platform**: RESTful API with automatic documentation
- **State Providers**: Custom data transformation logic
- **DataFixtures**: Automated test data generation

#### Frontend Architecture
- **Pages**: File-based routing with Nuxt.js
- **Components**: Reusable Vue components with TypeScript
- **Composables**: Shared business logic and state
- **Services**: API integration layer
- **Stores**: Global state management with Pinia

## ⚙️ Configuration Examples

### Symfony Configuration (.env)
```bash
# Environment
APP_ENV=dev
APP_SECRET=your-secret-key

# Database
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"

# JWT
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-jwt-passphrase

# File uploads
VICH_UPLOADER_ROOT_DIR=%kernel.project_dir%/public/uploads
```

### Nuxt.js Configuration (nuxt.config.ts)
```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api/v1'
    }
  },
  css: ['~/assets/css/main.css']
})
```

### Docker Compose (compose.yaml)
```yaml
services:
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: !ChangeMe!
      POSTGRES_USER: app
    ports:
      - "5432:5432"
    volumes:
      - database_data:/var/lib/postgresql/data

volumes:
  database_data:
```

## 🔄 Development Workflow

### Daily Development
```bash
# Start containers
docker-compose up -d

# Backend development
symfony serve -d

# Frontend development
cd client && npm run dev

# Run tests
php bin/phpunit && cd client && npm test
```

### Database Operations
```bash
# Reset database
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:fixtures:load --no-interaction
```

### Code Quality
```bash
# PHP analysis
./vendor/bin/phpstan analyse src tests

# Frontend linting
cd client
npm run lint
npm run lint:fix
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
php bin/phpunit

# Run specific test suite
php bin/phpunit tests/Api/
php bin/phpunit tests/Entity/

# Generate coverage report
php bin/phpunit --coverage-html coverage/
```

### Frontend Tests
```bash
cd client

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage
npm run test:coverage
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies and set up environment
4. Make your changes with tests
5. Run quality checks: `composer qa && cd client && npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- **PHP**: PSR-12 coding standard with PHPStan level 8
- **TypeScript**: ESLint + Prettier configuration
- **Commits**: Conventional Commits specification
- **Tests**: Minimum 80% code coverage required

### Author

[Quentin Sautière](https://github.com/SautiereQDev) - [contact@quentinsautiere.com](mailto:contact@quentinsautiere.com)

## 📄 License

This project is licensed under the Apache License 2 - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ using Symfony 7.2, API Platform 4.1, and Nuxt.js 3**