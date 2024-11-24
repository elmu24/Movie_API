import express from 'express';
import multer from 'multer';
import { Pool } from 'pg';

const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: 'uploads/' }).none());
app.use(express.json());

// PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'moviesdb',
  password: '1234',
  port: 5432,
});

// Server initialization
app.listen(3001, () => {
  console.log('Server running on port 3001');
});

// POST endpoint to add genres
app.post('/genres', async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('INSERT INTO Genre (Name) VALUES ($1) RETURNING *', [name]);
    res.status(201).json({ message: 'Genre added', genre: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST endpoint to add movies
app.post('/movies', async (req, res) => {
  const { name, year, genreId } = req.body;
  try {
    const result = await pool.query('INSERT INTO Movie (Name, Year, GenreID) VALUES ($1, $2, $3) RETURNING *', [name, year, genreId]);
    res.status(201).json({ message: 'Movie added', movie: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint to retrieve a movie by ID
app.get('/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM Movie WHERE MovieID = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE endpoint to remove a movie by ID
app.delete('/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await pool.query('DELETE FROM Movie WHERE MovieID = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted', movie: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint to list movies (pagination)
app.get('/movies', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  try {
    const result = await pool.query('SELECT * FROM Movie ORDER BY MovieID LIMIT $1 OFFSET $2', [limit, offset]);
    res.json({ page, movies: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
