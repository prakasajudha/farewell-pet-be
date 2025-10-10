# VapeStore Backend

A TypeScript-based backend API for a vape store management system. This project provides a robust foundation for managing vape products, users, and related functionalities.

## 🚀 Features

- RESTful API architecture
- TypeScript implementation
- PostgreSQL database with TypeORM
- JWT authentication
- File upload capabilities
- Database migrations and seeding
- Environment-based configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file based on `.env.example`)
4. Start the development server:
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── api/            # API routes and controllers
├── config/         # Configuration files
├── console/        # CLI commands and generators
├── core/           # Core business logic
├── db/             # Database related files
│   ├── migrations/ # Database migrations
│   └── seeders/    # Database seeders
├── lib/            # Shared libraries and utilities
├── util/           # Utility functions
├── app.ts          # Express application setup
└── server.ts       # Server entry point
```

## 🔄 Database Management

### Migrations

Create a new migration:
```bash
npm run create-migration src/db/migrations/<migration_name>
```

Run migrations:
```bash
npm run migrate
```

Revert last migration:
```bash
npm run migrate:revert
```

### Seeding

To seed the database with initial data:
```bash
npm run seed
```

## 🛠️ Development

The project uses TypeScript and includes several development tools:

- TypeORM for database management
- Express.js for the web server
- JWT for authentication
- Class-validator for request validation
- Multer for file uploads

## 📦 Dependencies

Key dependencies include:
- Express.js
- TypeORM
- PostgreSQL
- JWT
- Class-validator
- Multer
- And more (see package.json for complete list)

## 🔐 Environment Variables

Create a `.env` file with the following variables:
- Database configuration
- JWT secret
- Server port
- Other environment-specific settings

## 📝 License

Vapestore

