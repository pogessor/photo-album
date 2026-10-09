# Photo Album with AI-powered Descriptions

A full-stack photo album application with AI-generated image descriptions using Google Gemini.
Built as a personal portfolio project to demonstrate modern Java backend and full-stack development.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Model](#data-model)
- [Configuration](#configuration)
- [Roadmap](#roadmap)

## Features

- 📸 **Photo upload** with metadata (year, description)
- 🤖 **AI-generated descriptions** via Google Gemini (multimodal image understanding)
- 🔍 **Unified search** across year and description in a single query
- 🖼️ **Image serving** with proper MIME type detection
- ✏️ **Partial updates** (PATCH) for metadata
- 🗑️ **Delete** with cascading file cleanup
- 🛡️ **Global exception handling** with unified error responses
- ✅ **Bean Validation** on all inputs
- 📖 **Interactive API docs** via Swagger UI

## Tech Stack

### Backend
- **Java 21** – LTS version
- **Spring Boot 4.1.x** – application framework
- **Spring Data JPA / Hibernate** – ORM
- **Spring Web MVC** – REST API
- **Jakarta Bean Validation** – input validation
- **Maven** – build tool

### Database
- **PostgreSQL 16** – relational database

### AI
- **Google Gemini 3.8 Flash** via the official `google-genai` SDK
- `ThinkingLevel.LOW` for fast responses (~10s)

### Storage
- Local filesystem (with abstraction layer for future S3 migration)

### DevOps
- **Docker** + **Docker Compose** – containerization
- **Git** + **GitHub** – version control

### Documentation
- **springdoc-openapi** – Swagger UI
- **Markdown** – README and project docs

## Architecture

The application follows a classic **three-layer architecture**:

```
HTTP Request
     ↓
┌─────────────────┐
│   Controller    │  ← REST endpoints, HTTP handling, validation
└─────────────────┘
     ↓
┌─────────────────┐
│    Service      │  ← Business logic, transactions, orchestration
└─────────────────┘
     ↓
┌─────────────────┐
│   Repository    │  ← Data access (Spring Data JPA)
└─────────────────┘
     ↓
┌─────────────────┐
│   PostgreSQL    │  ← Persistence
└─────────────────┘

Side channels:
  - File Storage (local filesystem via PhotoStorageService abstraction)
  - Gemini AI (via GeminiService, called from PhotoService)
```

**Key design decisions:**

- **Controller → Service → Repository** separation, no shortcuts.
- **DTOs** for all API inputs/outputs, never exposing JPA entities directly.
- **PhotoStorageService** abstraction with pluggable implementations (local → S3).
- **Dependency Injection** via constructor (no field injection).
- **Global exception handling** via `@RestControllerAdvice`.

## Project Structure

```
photo-album/
├── backend/                          # Spring Boot application
│   ├── src/main/java/com/dancsopeter/photoalbum/
│   │   ├── PhotoAlbumBackendApplication.java    # Entry point + demo runner
│   │   ├── config/                              # Configuration classes
│   │   ├── controller/                          # REST controllers
│   │   ├── dto/                                 # Request/response DTOs
│   │   ├── entity/                              # JPA entities
│   │   ├── exception/                           # Custom exceptions + handlers
│   │   ├── repository/                          # Spring Data JPA repositories
│   │   └── service/                             # Business logic
│   ├── src/main/resources/
│   │   └── application.properties               # Configuration
│   ├── uploads/                                 # Uploaded files (mostly gitignored)
│   │   └── test.jpeg                            # Test image for Gemini
│   ├── Dockerfile                               # Multi-stage build
│   └── pom.xml                                  # Maven dependencies
├── frontend/                                    # React app (planned)
├── docker-compose.yml                           # Full-stack orchestration
├── .env                                         # Secrets (NOT in git)
├── .env.example                                 # Secret template (in git)
├── .gitignore
└── README.md
```

### Backend Package Overview

| Package | Purpose |
|---|---|
| `config` | Spring configuration (OpenAPI, CORS, etc.) |
| `controller` | HTTP endpoints, request/response handling |
| `dto` | Immutable records for API contracts |
| `entity` | JPA entities (database tables) |
| `exception` | Custom exceptions + `@RestControllerAdvice` |
| `repository` | Spring Data JPA interfaces |
| `service` | Business logic, transactions, external integrations |

## Getting Started

### Prerequisites

- **Java 21+** ([Eclipse Temurin](https://adoptium.net/))
- **Docker Desktop** (with WSL2 on Windows)
- **Git**
- **Gemini API key** ([get one here](https://aistudio.google.com/apikey))

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/pogessor/photo-album.git
   cd photo-album
   ```

2. **Create your `.env` file** (based on `.env.example`):

   ```
   GEMINI_API_KEY=your-api-key-here
   ```

3. **Run the full stack:**

   ```bash
   docker compose up --build
   ```

   The first build takes ~3-5 minutes. Subsequent starts are fast.

4. **Access the API:**
   - REST API: `http://localhost:8080/api/photos`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`

### Local Development (without Docker)

1. Start only the database:

   ```bash
   docker compose up -d postgres
   ```

2. Run the backend from your IDE (NetBeans, IntelliJ) or:

   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

## API Endpoints

### `GET /api/photos`

List all photos.

**Response:** `200 OK` – array of `Photo`

### `GET /api/photos/{id}`

Get photo metadata by ID.

**Response:** `200 OK` – `Photo` or `404 Not Found`

### `GET /api/photos/{id}/image`

Serve the actual image file.

**Response:** `200 OK` – binary image with proper `Content-Type`

### `GET /api/photos/search?keyword=...`

Search by year or description (case-insensitive, partial match).

**Query params:**
- `keyword` (optional) – search term

**Response:** `200 OK` – array of matching `Photo`

### `POST /api/photos`

Upload a new photo with metadata.

**Content-Type:** `multipart/form-data`

**Form fields:**
- `file` (required) – the image file
- `year` (required) – 4-digit year (1000-9999)
- `description` (optional) – max 1000 chars

**Response:** `201 Created` – created `Photo`

### `POST /api/photos/describe`

Generate a description for an image using Gemini AI (stateless, does not save).

**Content-Type:** `multipart/form-data`

**Form fields:**
- `file` (required) – the image file

**Response:** `200 OK` – `{ "description": "..." }`

**Note:** takes ~10 seconds (Gemini `ThinkingLevel.LOW`).

### `PATCH /api/photos/{id}`

Partially update photo metadata.

**Content-Type:** `application/json`

**Body:**
```json
{
  "year": 2024,
  "description": "Updated description"
}
```

**Response:** `200 OK` – updated `Photo`

### `DELETE /api/photos/{id}`

Delete a photo (both database record and file).

**Response:** `204 No Content`

## Data Model

### `Photo` entity

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Unique identifier |
| `year` | `Integer` | NOT NULL, 1000-9999 | The year the photo was taken |
| `description` | `String(1000)` | nullable | User or AI-generated description |
| `filename` | `String` | NOT NULL | Stored filename (UUID + extension) |
| `originalFilename` | `String` | nullable | Original filename from the client |
| `uploadedAt` | `LocalDateTime` | NOT NULL | Upload timestamp |

## Configuration

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |

Loaded from `.env` via `spring-dotenv`. The `.env` file is **gitignored**.

### `application.properties` highlights

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/photoalbum
spring.jpa.hibernate.ddl-auto=update

# File upload
spring.servlet.multipart.max-file-size=10MB
app.upload.dir=uploads

# Gemini
gemini.api.key=${GEMINI_API_KEY:}
gemini.api.model=gemini-3.8-flash

# Optional Gemini test on startup
app.gemini.test-on-startup=false
```

## Roadmap

- [x] Spring Boot backend with CRUD REST API
- [x] PostgreSQL integration
- [x] File upload and serving
- [x] Global exception handling
- [x] Bean Validation
- [x] Gemini AI integration for image descriptions
- [x] Docker Compose deployment
- [x] Swagger/OpenAPI documentation
- [ ] **React frontend** (gallery, upload, search)
- [ ] **Flyway** for database migrations
- [ ] **Unit and integration tests** (JUnit, Testcontainers)
- [ ] **JWT authentication** (multi-user support)
- [ ] **S3 storage** implementation
- [ ] **CI/CD** with GitHub Actions

## License

This is a personal learning project. Feel free to use it as reference.