# Musical Instruments Database

This project is a web application that serves as a database of musical instruments from around the world. It provides a user-friendly interface to explore, filter, and learn about various instruments. The application is built with a modern tech stack and features a complete API for accessing the instrument data.

## Running Locally

To run the application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/musical-instruments-database.git
   cd musical-instruments-database
   ```
2. **Install dependencies:**
   ```bash
   bun install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your Supabase project URL and anon key to the `.env` file:
   ```
    VITE_SUPABASE_URL=https://your-project.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example-anon-key
   ```
4. **Run the development server:**
   ```bash
   bun run dev
   ```
The application will be available at http://localhost:5173.

## Tech Stack

- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** React Query
- **Backend:** Supabase
- **Linting:** ESLint
- **Package Manager:** Bun

## API Endpoints

The application exposes the following API endpoints for accessing the instrument data:

- `GET /functions/v1/instruments-api`: Get all instruments with optional filters.
- `GET /functions/v1/instruments-api/:id`: Get a specific instrument by ID.
- `GET /functions/v1/instruments-api/categories`: Get all instrument categories.
- `GET /functions/v1/instruments-api/stats`: Get database statistics.
