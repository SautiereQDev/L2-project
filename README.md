# 🏃‍♂️ Athletics Records Management System

[![Symfony](https://img.shields.io/badge/Symfony-7.2-blue.svg?style=flat-square&logo=symfony)](https://symfony.com/)
[![API Platform](https://img.shields.io/badge/API%20Platform-4.1-brightgreen.svg?style=flat-square)](https://api-platform.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D.svg?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.2-blue.svg?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED.svg?style=flat-square&logo=docker)](https://www.docker.com/)

A modern, full-stack athletics records management platform designed for sports clubs, athletic associations, and performance tracking. This application provides a comprehensive RESTful API for managing athletes, disciplines, locations, and athletic records, with an intuitive Vue.js frontend.

## 🚀 Features

- **Complete Athlete Management**: Profile creation, image uploads, performance tracking
- **Discipline Organization**: Running, jumping, throwing categories with detailed specifications
- **Records Tracking**: Historical performance data with location and date tracking
- **Location Management**: Venue and competition location database
- **JWT Authentication**: Secure user authentication with automatic token refresh
- **Real-time API**: RESTful API with auto-generated OpenAPI documentation
- **Modern Frontend**: Responsive Vue.js interface with TypeScript support
- **File Upload**: VichUploader integration for athlete profile images
- **Comprehensive Testing**: PHPUnit (backend) and Vitest (frontend) test suites

## 🏗️ Architecture

This project follows modern web development best practices with a clear separation of concerns:

### Backend (Symfony 7.2 + API Platform 4.1)
- **Framework**: Symfony 7.2 with API Platform for API-first development
- **Database**: MySQL 8.2 with Doctrine ORM
- **Authentication**: LexikJWTAuthenticationBundle for secure JWT tokens
- **File Handling**: VichUploaderBundle for file management
- **Testing**: PHPUnit with comprehensive test coverage

### Frontend (Nuxt 3 + Vue 3)
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: Pinia stores for reactive state management
- **Testing**: Vitest for unit and integration testing

### Infrastructure
- **Containerization**: Docker Compose for development environment
- **Database**: PostgreSQL with Docker container
- **Web Server**: Symfony development server or configurable web server

## 📋 Prerequisites

Before getting started, ensure you have the following installed on your system:

- **PHP**: 8.2 or higher with extensions: `ext-ctype`, `ext-iconv`, `ext-pdo`, `ext-pdo_pgsql`
- **Composer**: Latest version for PHP dependency management
- **Node.js**: 18.0 or higher with npm
- **Docker & Docker Compose**: For the containerized development environment
- **Git**: For version control
- **Symfony CLI**: Recommended for enhanced development experience

### Optional Tools
- **PHP CS Fixer**: For code formatting (included in dev dependencies)
- **PHPStan**: For static analysis (included in dev dependencies)
- **Postman/Insomnia**: For API testing (alternative to Swagger UI)

## 🚀 Quick Start

### Development Environment Setup (Docker - Recommended)

This project uses a Docker-based development environment for consistency and ease of setup. The Docker configuration is based on the [docker-symfony-wp-2024](https://gitlab.univ-lr.fr/ntrugeon/docker-symfony-wp-2024) template, optimized for Symfony applications.

#### 1. Clone and Prepare the Project

```bash
# Clone the repository
git clone <repository-url>
cd L2-project

# Copy environment configuration
cp .env .env.local
```

#### 2. Configure Environment Variables

Edit `.env.local` with your specific configuration:

```bash
# Symfony Environment
APP_ENV=dev
APP_SECRET=your-app-secret-here

# Database Configuration (for Docker)
DATABASE_URL="postgresql://app:!ChangeMe!@database:5432/app?serverVersion=16&charset=utf8"

# JWT Configuration
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-jwt-passphrase
```

#### 3. Launch the Development Environment

```bash
# Start the PostgreSQL database container
docker compose up -d

# Install PHP dependencies
composer install

# Install frontend dependencies
cd client && npm install && cd ..
```

#### 4. Configure JWT Authentication

```bash
# Create JWT directory
mkdir -p config/jwt

# Generate JWT key pair (you'll be prompted for a passphrase)
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout

# Set proper permissions
chmod 600 config/jwt/private.pem
chmod 644 config/jwt/public.pem
```

**Important**: Update your `.env.local` file with the JWT passphrase you created.

#### 5. Initialize the Database

```bash
# Create the database schema
php bin/console doctrine:database:create --if-not-exists

# Run database migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Load sample data (optional but recommended for development)
php bin/console doctrine:fixtures:load --no-interaction
```

#### 6. Start the Application

```bash
# Terminal 1: Start the Symfony API server
symfony server:start

# Terminal 2: Start the frontend development server
cd client && npm run dev
```

**Access Points:**
- 🌐 **Frontend**: http://localhost:3000
- 🔌 **API**: https://localhost:8443
- 📚 **API Documentation**: https://localhost:8443/api/docs
- 🗄️ **Database**: localhost:5432 (PostgreSQL)

### Alternative: Local Development (Without Docker)

If you prefer to run without Docker, ensure you have PostgreSQL installed locally:

```bash
# Install dependencies
composer install
cd client && npm install && cd ..

# Configure your local database in .env.local
DATABASE_URL="postgresql://username:password@127.0.0.1:5432/athletics_db?serverVersion=16&charset=utf8"

# Follow steps 4-6 from the Docker setup above
```

## 📖 API Documentation

### Interactive Documentation & Testing

The application provides comprehensive API documentation through multiple interfaces:

- **🔗 Swagger UI**: [https://localhost:8443/api/docs](https://localhost:8443/api/docs) - Interactive API explorer
- **📄 OpenAPI Specification**: [https://localhost:8443/api/docs.json](https://localhost:8443/api/docs.json) - Machine-readable API schema
- **🔍 API Platform Admin**: Auto-generated admin interface for data management

### API Health Check

```bash
# Verify API availability
curl -X GET https://localhost:8443/api/v1/health

# Expected response
{
  "status": "ok",
  "timestamp": "2025-05-30T12:00:00Z",
  "environment": "dev"
}
```

### 🔐 Authentication

The API uses JWT (JSON Web Tokens) for stateless authentication with automatic token refresh.

#### User Authentication Flow

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}

# Response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "refresh_token": "def50200..."
}
```

#### Authenticated Requests

Include the JWT token in the Authorization header:

```http
GET /api/v1/athletes
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
Content-Type: application/json
```

#### Token Refresh

```http
POST /api/token/refresh
Content-Type: application/json

{
  "refresh_token": "def50200..."
}
```

#### User Profile Management

```http
# Get current user profile
GET /api/v1/me
Authorization: Bearer <token>

# Update user profile
PATCH /api/v1/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Doe"
}

# Logout (invalidate token)
POST /api/v1/logout
Authorization: Bearer <token>
```

### 🏃‍♂️ Core API Endpoints

#### Athletes Management

```http
# List athletes with pagination and filtering
GET /api/v1/athletes?page=1&limit=20&country=FR&gender=M
Authorization: Bearer <token>

# Create a new athlete
POST /api/v1/athletes
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Usain",
  "lastName": "Bolt",
  "dateOfBirth": "1986-08-21",
  "country": "JM",
  "gender": "M",
  "height": 195,
  "weight": 94
}

# Get athlete with full details
GET /api/v1/athletes/123
Authorization: Bearer <token>

# Update athlete information
PUT /api/v1/athletes/123
Authorization: Bearer <token>
Content-Type: application/json

{
  "height": 196,
  "weight": 95
}

# Upload athlete profile image
POST /api/v1/athletes/123/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data: image (file)
```

#### Records Management

```http
# List records with advanced filtering
GET /api/v1/records?discipline=1&athlete=123&year=2025&location=paris
Authorization: Bearer <token>

# Create a new record
POST /api/v1/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "athlete": "/api/v1/athletes/123",
  "discipline": "/api/v1/disciplines/1",
  "location": "/api/v1/locations/456",
  "performance": "9.58",
  "unit": "seconds",
  "recordDate": "2025-05-30",
  "conditions": {
    "wind": "+1.2",
    "temperature": "25°C"
  }
}

# Get best records for a discipline
GET /api/v1/records/best?discipline=1&limit=10
Authorization: Bearer <token>
```

#### Disciplines & Categories

```http
# List all disciplines by category
GET /api/v1/disciplines?type=running&orderBy=name
Authorization: Bearer <token>

# Create a new discipline
POST /api/v1/disciplines
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "100m Sprint",
  "type": "running",
  "unit": "seconds",
  "description": "100 meters sprint race",
  "isOlympic": true
}

# Get disciplines with current records
GET /api/v1/disciplines/1/records?limit=1&orderBy=performance
Authorization: Bearer <token>
```

#### Locations & Venues

```http
# List locations with geographic filtering
GET /api/v1/locations?country=FR&city=Paris
Authorization: Bearer <token>

# Create a new location
POST /api/v1/locations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Stade de France",
  "city": "Saint-Denis",
  "country": "FR",
  "latitude": 48.9244,
  "longitude": 2.3601,
  "altitude": 40,
  "surfaceType": "track"
}
```

### 📊 Advanced API Features

#### Bulk Operations

```http
# Bulk upload athletes via CSV
POST /api/v1/athletes/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data: file (CSV file)
# CSV Format: firstName,lastName,dateOfBirth,country,gender,height,weight
```

#### Data Export

```http
# Export athletes data
GET /api/v1/athletes/export?format=csv&country=FR
Authorization: Bearer <token>

# Export records data
GET /api/v1/records/export?format=json&discipline=1&year=2025
Authorization: Bearer <token>
```

#### Statistics & Analytics

```http
# Get performance statistics
GET /api/v1/statistics/athlete/123/performance?discipline=1&period=2025
Authorization: Bearer <token>

# Get global records summary
GET /api/v1/statistics/records/summary?groupBy=discipline
Authorization: Bearer <token>
```

## 🗄️ Database Schema & Architecture

### Entity Relationship Diagram

The application uses a normalized database schema optimized for athletic records management:

```
User (Authentication)
│
├── Records Management
│   ├── Athlete (1:N with Record)
│   ├── Discipline (1:N with Record) 
│   ├── Location (1:N with Record)
│   └── Record (Central entity)
│
└── File Management
    └── Athlete Images (VichUploader)
```

### Core Entities

#### 🏃‍♂️ Athlete Entity
- **Properties**: firstName, lastName, dateOfBirth, country, gender, height, weight
- **Features**: Profile image upload, automatic slug generation
- **Relationships**: One-to-many with Records
- **Validations**: Country codes (ISO 3166), gender constraints, date validation

#### 🏆 Record Entity  
- **Properties**: performance, unit, recordDate, conditions (JSON)
- **Features**: Performance tracking, environmental conditions
- **Relationships**: Many-to-one with Athlete, Discipline, Location
- **Validations**: Performance format validation, date constraints

#### 🏃 Discipline Entity
- **Properties**: name, type (enum: running/jumping/throwing), unit, isOlympic
- **Features**: Categorization system, unit standardization
- **Relationships**: One-to-many with Records
- **Types**: Running, Jumping, Throwing, Combined events

#### 📍 Location Entity
- **Properties**: name, city, country, latitude, longitude, altitude, surfaceType
- **Features**: Geographic coordinates, venue classification
- **Relationships**: One-to-many with Records
- **Validations**: Coordinate bounds, elevation constraints

#### 👤 User Entity  
- **Properties**: email, password (hashed), roles, firstName, lastName
- **Features**: JWT authentication, role-based access control
- **Roles**: ROLE_USER, ROLE_ADMIN, ROLE_SUPER_ADMIN
- **Security**: BCrypt password hashing, secure session management

### Database Migrations

The project uses Doctrine migrations for database versioning:

```bash
# Create a new migration after entity changes
php bin/console make:migration

# Execute pending migrations
php bin/console doctrine:migrations:migrate

# Check migration status
php bin/console doctrine:migrations:status

# Execute specific migration
php bin/console doctrine:migrations:execute --up 20250530150000
```

## 🛠️ Technology Stack & Architecture

### Backend Architecture (Symfony 7.2)

#### Core Components
- **Framework**: Symfony 7.2 with API Platform 4.1
- **Database**: PostgreSQL 16 with Doctrine ORM 3.0
- **Authentication**: LexikJWTAuthenticationBundle with RS256 encryption
- **API**: RESTful API with OpenAPI 3.0 documentation
- **File Handling**: VichUploaderBundle for profile images
- **Validation**: Symfony Validator with custom constraints

#### Key Bundles & Libraries
```json
{
  "symfony/framework-bundle": "^7.2",
  "api-platform/core": "^4.1",
  "doctrine/doctrine-bundle": "^2.12",
  "lexik/jwt-authentication-bundle": "^3.1",
  "vich/uploader-bundle": "^2.4",
  "nelmio/cors-bundle": "^2.5",
  "symfony/security-bundle": "^7.2"
}
```

#### Architecture Patterns
- **Domain-Driven Design**: Clear separation of business logic
- **Repository Pattern**: Data access abstraction
- **API-First Design**: Backend serves only JSON API
- **State Providers**: API Platform custom state management
- **Event-Driven**: Symfony EventDispatcher for decoupled operations

### Frontend Architecture (Nuxt 3 + Vue 3)

#### Core Technologies
- **Framework**: Nuxt 3.13 with Vue 3 Composition API
- **Language**: TypeScript 5.x for type safety
- **Styling**: Tailwind CSS 3.x for utility-first design
- **State**: Pinia 2.x for reactive state management
- **HTTP Client**: Nuxt's built-in $fetch with auto-refresh

#### Key Dependencies
```json
{
  "@nuxt/ui": "^2.18",
  "@pinia/nuxt": "^0.7",
  "@vueuse/nuxt": "^11.0",
  "@nuxt/image": "^1.8",
  "@tanstack/vue-query": "^5.58",
  "zod": "^3.23"
}
```

#### Design Patterns
- **Composables**: Reusable reactive logic
- **Auto-imports**: Automatic component and utility imports
- **Plugin System**: Modular functionality extensions
- **Middleware**: Route-level authentication and authorization
- **Layouts**: Template inheritance for consistent UI

### Development Workflow

#### Backend Development
```bash
# Start development environment
docker compose up -d
symfony server:start

# Code generation
php bin/console make:entity
php bin/console make:controller
php bin/console make:migration

# Development tools
php bin/console debug:router
php bin/console debug:container
symfony var:export --multiline
```

#### Frontend Development
```bash
cd client

# Development server with hot reload
npm run dev

# Type checking in watch mode
npm run typecheck --watch

# Component development
npm run storybook  # If configured

# Build optimization analysis
npm run analyze
```

### Infrastructure & DevOps

#### Docker Environment
- **PostgreSQL**: Official PostgreSQL 16 Alpine image
- **Volume Persistence**: Named volumes for data persistence
- **Network**: Internal Docker network for service communication
- **Health Checks**: Container health monitoring

#### Development Tools
- **Symfony CLI**: Enhanced development experience
- **Docker Compose**: Consistent development environment
- **Git Hooks**: Pre-commit code quality checks
- **VS Code**: Recommended extensions for development

#### Performance Optimizations
- **OPcache**: PHP bytecode caching (production)
- **Doctrine Query Cache**: Database query optimization
- **Vite HMR**: Fast frontend hot module replacement
- **Asset Optimization**: Automatic CSS/JS minification
- **Image Processing**: On-demand image resizing and optimization

### Security Implementation

#### Backend Security
- **JWT Tokens**: RS256 asymmetric encryption
- **Password Hashing**: BCrypt with configurable cost
- **CORS Configuration**: Restrictive cross-origin policies
- **Input Validation**: Multi-layer validation (entity + API)
- **SQL Injection Protection**: Doctrine ORM parameter binding

#### Frontend Security
- **XSS Protection**: Vue 3 template escaping
- **CSRF Prevention**: Stateless API design
- **Token Storage**: Secure httpOnly cookie option
- **Route Protection**: Authentication middleware
- **Input Sanitization**: Client-side validation with Zod

### Database Management

#### Create Migration
```bash
php bin/console make:migration
```

#### Reset Database
```bash
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

#### Load Fixtures
```bash
php bin/console doctrine:fixtures:load
```

## 🚢 Deployment

### Production Build

#### Backend
```bash
composer install --no-dev --optimize-autoloader
php bin/console cache:clear --env=prod
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

### Environment Variables

#### Backend (.env.prod)
```env
APP_ENV=prod
APP_SECRET=your_production_secret
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
```

#### Frontend (.env.production)
```env
NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Properly configured CORS headers
- **Input Validation**: Server and client-side validation
- **SQL Injection Protection**: Doctrine ORM parameterized queries
- **XSS Protection**: Vue 3 built-in protection
- **CSRF Protection**: API stateless design

## 📈 Performance Optimizations

- **Database Indexing**: Optimized database queries
- **Caching**: Symfony cache for improved performance
- **Code Splitting**: Automatic code splitting with Nuxt 3
- **Image Optimization**: Optimized image handling with VichUploader
- **API Pagination**: Efficient data loading with pagination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker compose ps

# Check database logs
docker compose logs database
```

#### JWT Token Issues
```bash
# Generate new JWT keys
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout
```

#### Frontend Build Issues
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📞 Support

For support and questions:
- Check the API documentation at `/api/docs`
- Review the test files for usage examples
- Check the troubleshooting section above

---

### Original Author

[Quentin Sautière](https://github.com/SautiereQDev) - [contact@quentinsautiere.com](mailto:contact@quentinsautiere.com)
