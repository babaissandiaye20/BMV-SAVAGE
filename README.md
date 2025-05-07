<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Salvage Inspection Backend

## Description

The Salvage Inspection Backend is a comprehensive API service built with NestJS that manages vehicle salvage inspections. This system allows users to register, upload vehicle-related documents, schedule inspection appointments, make payments, and communicate with administrators.

### Key Features

- User authentication and authorization with JWT
- Document upload and management
- Appointment scheduling for vehicle inspections
- Payment processing with Stripe
- WhatsApp notifications with Evolution API
- Real-time caching with Redis
- Comprehensive API documentation with Swagger

## Architecture

The application follows a modular architecture based on NestJS best practices:

### Core Modules

- **ConfigModule**: Manages environment variables and application configuration
- **PrismaModule**: Handles database operations using Prisma ORM
- **RedisModule**: Provides caching capabilities using Redis
- **ValidationModule**: Handles input validation and error responses

### Feature Modules

- **UserModule**: Manages user registration, profiles, and authentication
- **AuthModule**: Handles JWT authentication, token management, and authorization
- **DocumentModule**: Manages document uploads and storage using Cloudinary
- **AppointmentModule**: Handles scheduling and management of inspection appointments
- **PaymentModule**: Processes payments using Stripe
- **SmsModule**: Sends WhatsApp notifications using Evolution API
- **UploadModule**: Handles file uploads and storage

### Data Model

The application uses PostgreSQL with Prisma ORM and includes the following main entities:

- **User**: Stores user information and authentication details
- **Document**: Manages vehicle-related documents (licenses, titles, receipts)
- **Appointment**: Tracks inspection appointments with vehicle details
- **Payment**: Records payment transactions for appointments
- **PaymentMode**: Defines available payment methods
- **Message**: Stores communication between users and administrators

## API Endpoints

### Authentication

- **POST /auth/login**: Authenticate a user and get JWT tokens
- **POST /auth/logout**: Invalidate the current JWT token
- **POST /auth/refresh**: Get a new JWT token using a refresh token
- **POST /auth/request-password-reset**: Request a password reset code (sent via WhatsApp)
- **POST /auth/reset-password**: Reset password using the verification code

### Password Reset Flow

1. User requests a password reset by sending their email to `/auth/request-password-reset`
2. System sends a verification code to the user's WhatsApp
3. User submits the verification code, old password, and new password to `/auth/reset-password`
4. System verifies the code and old password, then updates the password

## WhatsApp Integration

The application uses Evolution API to send verification codes for password reset. This integration requires:

1. A self-hosted Evolution API server or access to a hosted instance
2. A WhatsApp account connected to Evolution API
3. Proper configuration in the .env file (EVOLUTION_API_BASE_URL, EVOLUTION_API_INSTANCE, EVOLUTION_API_KEY, WHATSAPP_FROM_NUMBER)

### About Evolution API

Evolution API is an open-source REST API for WhatsApp that allows you to send and receive messages without using the official WhatsApp Business API. It provides:

- Message sending and receiving
- Media handling (images, documents, etc.)
- Group management
- Status updates
- QR code authentication

Being open-source and self-hosted, Evolution API can be a cost-effective alternative to commercial WhatsApp API providers.

## Dependencies

### Core Dependencies

- **NestJS (@nestjs/*)**: Framework for building server-side applications
- **Prisma (@prisma/client)**: ORM for database access
- **Redis (@nestjs-modules/ioredis)**: In-memory data store for caching
- **JWT (@nestjs/jwt)**: JSON Web Token implementation for authentication
- **Passport (@nestjs/passport)**: Authentication middleware
- **Swagger (@nestjs/swagger)**: API documentation

### External Services

- **Stripe (stripe)**: Payment processing
- **Evolution API (axios)**: WhatsApp messaging
- **Cloudinary (cloudinary)**: Cloud-based image and file management

### Utilities

- **bcrypt**: Password hashing
- **class-validator & class-transformer**: Input validation and transformation
- **date-fns**: Date manipulation
- **uuid**: Unique identifier generation

## Project Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL
- Redis

### Installation

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your configuration

# Run database migrations
$ npx prisma migrate dev
```

### Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Docker Setup

The application is containerized using Docker and Docker Compose for easy deployment and development.

### Docker Architecture

The Docker setup consists of three main services:

1. **app**: The NestJS application container
2. **postgres**: PostgreSQL database container
3. **redis**: Redis cache container

All services are configured with appropriate environment variables and persistent volumes for data storage.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Copy the example environment file and update it with your own values:

```bash
$ cp .env.example .env
```

Required environment variables include:
- Database connection details
- Redis connection details
- JWT configuration
- Evolution API configuration
- Cloudinary API credentials
- Stripe API keys

### Running with Docker Compose

To start the application and its dependencies:

```bash
$ docker-compose up -d
```

This will start three containers:
- The NestJS application (accessible at http://localhost:3000)
- PostgreSQL database
- Redis cache

To stop the containers:

```bash
$ docker-compose down
```

To view logs:

```bash
$ docker-compose logs -f app
```

### Building the Docker Image

If you want to build the Docker image separately:

```bash
$ docker build -t salvage-inspection-backend .
```

### Testing the Docker Setup

A test script is provided to verify that the Docker setup works correctly:

```bash
$ chmod +x test-docker.sh  # Make the script executable (if not already)
$ ./test-docker.sh
```

This script will:
1. Build the Docker image
2. Start the containers with Docker Compose
3. Check if the application is running correctly
4. Stop the containers

## API Documentation

The API is documented using Swagger, which provides an interactive interface to explore and test the endpoints.

### Accessing Swagger Documentation

When the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:
- A list of all available endpoints
- Request and response schemas
- Authentication requirements
- The ability to test endpoints directly from the browser

### Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected endpoints:

1. Register or login to obtain a JWT token
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer <your_token>
   ```

## Development Guidelines

### Code Structure

- **Controllers**: Handle HTTP requests and define API endpoints
- **Services**: Contain business logic and interact with the database
- **DTOs**: Define data transfer objects for request/response validation
- **Entities**: Map to database models
- **Modules**: Group related functionality

### Adding New Features

1. Create a new module: `nest generate module feature-name`
2. Create a controller: `nest generate controller feature-name`
3. Create a service: `nest generate service feature-name`
4. Define DTOs and entities
5. Implement business logic in the service
6. Expose endpoints in the controller
7. Add the module to AppModule imports

## Deployment

The application can be deployed to any environment that supports Docker containers. For production deployments, consider:

- Setting up a CI/CD pipeline
- Using container orchestration (Kubernetes, AWS ECS)
- Implementing proper monitoring and logging
- Setting up database backups
- Configuring HTTPS

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Evolution API Documentation](https://github.com/evolution-api/evolution-api)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## License

This project is [MIT licensed](LICENSE).
