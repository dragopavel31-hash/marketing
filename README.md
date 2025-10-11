# Marketing Simulator

A full-stack web application for simulating marketing campaign results based on budget allocation across different channels.

## Features

- Allocate budget across TV, Digital, and Email marketing channels
- Real-time simulation of marketing campaign results
- Visualize campaign performance with interactive charts
- Track historical campaign data
- Filter and sort campaign results

## Tech Stack

- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: React, Recharts, TailwindCSS
- **Database**: PostgreSQL

## Prerequisites

- Python 3.10 or higher
- Node.js 16+ and npm
- PostgreSQL

## Backend Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/marketing_simulator
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Database Schema

The application uses a single table with the following structure:

```sql
CREATE TABLE campaign_results (
    id SERIAL PRIMARY KEY,
    tv_budget NUMERIC(10,2) NOT NULL,
    digital_budget NUMERIC(10,2) NOT NULL,
    email_budget NUMERIC(10,2) NOT NULL,
    reach NUMERIC(10,2) NOT NULL,
    sales NUMERIC(10,2) NOT NULL,
    roi NUMERIC(10,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## License

This project is licensed under the MIT License.
