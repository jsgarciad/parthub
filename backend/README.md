# PartHub Backend

Backend API for the PartHub application, a marketplace for auto parts.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=parthub
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=24h
   ```
5. Create the PostgreSQL database:
   ```
   createdb parthub
   ```

### Running the Application

- Development mode:
  ```
  npm run dev
  ```
- Production build:
  ```
  npm run build
  npm start
  ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new store
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Parts

- `GET /api/parts/public` - Get all available parts (public)
- `POST /api/parts` - Create a new part (requires authentication)
- `GET /api/parts/store` - Get all parts for the authenticated store
- `GET /api/parts/:id` - Get a specific part
- `PUT /api/parts/:id` - Update a part
- `DELETE /api/parts/:id` - Delete a part

## License

This project is licensed under the ISC License. 