# <img src="https://github.com/user-attachments/assets/f1e92f06-aa34-49ad-b68f-807866a830a3" width="64" /> Allergy Tracker

A full-stack web application for tracking and managing allergy exposures. Monitor your allergy symptoms, record exposure incidents, and analyze patterns over time to better understand and manage your allergies.

## How to Run

### Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb your_database_name
   ```

2. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your local PostgreSQL credentials:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/your_database_name
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

### Backend Setup

1. Navigate to the project root directory:
   ```bash
   cd allergy-tracker
   ```

2. Run the Spring Boot application:
   ```bash
   ./gradlew bootRun
   ```

   The backend API will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to the UI directory:
   ```bash
   cd allergy-tracker-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Running with Mocks (Development)

To run the frontend with mock data (no backend required):
```bash
cd allergy-tracker-ui
npm run dev:mock
```

### Running Tests

**Backend tests:**
```bash
./gradlew test
```

**Frontend tests:**
```bash
cd allergy-tracker-ui
npm test
```

## Technologies

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Lombok
- Gradle
- JUnit & H2

### Frontend
- React
- TypeScript
- Vite
- Material-UI (MUI)
- React Router
- TanStack Query
- Axios
- Day.js
- MUI X Charts
- MSW (Mock Service Worker)
- Vitest
- ESLint & Prettier
