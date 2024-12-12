import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import pgPool from "./pg_connection.js";


const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());


// Teste die Verbindung
(async () => {
    try {
        const client = await pgPool.connect();
        console.log('Database connected successfully!');
        client.release(); // Verbindung zurück in den Pool geben
    } catch (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Beende das Programm bei Verbindungsfehler
    }
})();

// Server starten
app.listen(3002, () => {
    console.log(`Server is running!!`);
});


// **Root-Endpunkt**
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// **Genre hinzufügen**
app.post('/genres', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pgPool.query('INSERT INTO genre (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Alle Genres abrufen**
app.get('/genres', async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM genre');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film hinzufügen**
app.post('/movies', async (req, res) => {
    const { name, year, genre_id, costumer_id } = req.body;
    try {
        const result = await pgPool.query(
            'INSERT INTO movie (name, year, genre_id, costumer_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, year, genre_id, costumer_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Alle Filme abrufen mit Pagination**
app.get('/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Standard: Seite 1
    const limit = parseInt(req.query.limit) || 10; // Standard: 10 Filme pro Seite
    const offset = (page - 1) * limit;

    try {
        const result = await pgPool.query('SELECT * FROM movie LIMIT $1 OFFSET $2', [limit, offset]);
        res.status(200).json({
            page,
            limit,
            total: result.rowCount,
            movies: result.rows,
        });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Filme nach Schlüsselwort durchsuchen**
app.get('/movies/search', async (req, res) => {
    const keyword = req.query.keyword || '';
    try {
        const result = await pgPool.query(
            'SELECT * FROM movie WHERE name ILIKE $1 OR CAST(year AS TEXT) ILIKE $1',
            [`%${keyword}%`]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film nach ID abrufen**
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgPool.query('SELECT * FROM movie WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film aktualisieren**
app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { name, year, genre_id } = req.body;

    try {
        const result = await pgPool.query(
            'UPDATE movie SET name = $1, year = $2, genre_id = $3 WHERE id = $4 RETURNING *',
            [name, year, genre_id, id]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Movie updated successfully', movie: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Film löschen mit erweiterter Fehlerbehandlung**
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgPool.query('DELETE FROM movie WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Movie deleted successfully', movie: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        if (err.code === '23503') {
            res.status(400).json({
                error: 'Cannot delete movie because it is referenced by other records (e.g., reviews or connections).',
            });
        } else {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// **Kundenregistrierung mit Passwort-Sicherheit**
app.post('/costumers', async (req, res) => {
    const { name, username, password, birthyear } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pgPool.query(
            'INSERT INTO costumer (name, username, password, birthyear) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, username, hashedPassword, birthyear]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fehlerbehandlung
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


