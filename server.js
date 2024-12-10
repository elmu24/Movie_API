import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;

// PostgreSQL-Datenbankverbindung konfigurieren
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres1234',
    port: 5432, // Standardport für PostgreSQL
});

const app = express();
app.use(express.json());
app.use(cors());

// Port konfigurieren
const PORT = 3002;

// **Root-Endpunkt**
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// **Genre hinzufügen**
app.post('/genres', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO genre (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Alle Genres abrufen**
app.get('/genres', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM genre');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film hinzufügen**
app.post('/movies', async (req, res) => {
    const { name, year, genre_id, costumer_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movie (name, year, genre_id, costumer_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, year, genre_id, costumer_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Alle Filme abrufen mit Pagination**
app.get('/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Standard: Seite 1
    const limit = parseInt(req.query.limit) || 10; // Standard: 10 Filme pro Seite
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query('SELECT * FROM movie LIMIT $1 OFFSET $2', [limit, offset]);
        res.status(200).json({
            page,
            limit,
            total: result.rows.length,
            movies: result.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Filme nach Schlüsselwort durchsuchen**
app.get('/movies/search', async (req, res) => {
    const keyword = req.query.keyword || '';
    try {
        const result = await pool.query(
            'SELECT * FROM movie WHERE name ILIKE $1 OR CAST(year AS TEXT) ILIKE $1',
            [`%${keyword}%`]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film nach ID abrufen**
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM movie WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film aktualisieren**
app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { name, year, genre_id } = req.body;

    try {
        const result = await pool.query(
            'UPDATE movie SET name = $1, year = $2, genre_id = $3 WHERE id = $4 RETURNING *',
            [name, year, genre_id, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Movie updated successfully', movie: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film löschen**
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM movie WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Movie deleted successfully', movie: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Fehlerbehandlung**
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
