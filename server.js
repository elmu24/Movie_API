import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Umgebungsvariablen aus .env laden

const { Client } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL-Datenbankverbindung konfigurieren
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: process.env.PGSSL === 'true', // SSL als Boolean
});

// Verbindung zur Datenbank herstellen
async function connect() {
    try {
        await client.connect();
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Beende das Programm bei Verbindungsfehler
    }
}

// Verbindung initialisieren
connect();

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
        const result = await client.query('INSERT INTO genre (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Alle Genres abrufen**
app.get('/genres', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM genre');
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
        const result = await client.query(
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
        const result = await client.query('SELECT * FROM movie LIMIT $1 OFFSET $2', [limit, offset]);
        res.status(200).json({
            page,
            limit,
            total: result.rows.length,
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
        const result = await client.query(
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
        const result = await client.query('SELECT * FROM movie WHERE id = $1', [id]);
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
        const result = await client.query(
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
        const result = await client.query('DELETE FROM movie WHERE id = $1 RETURNING *', [id]);
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

// **Filmbewertung hinzufügen**
app.post('/reviews', async (req, res) => {
    const { movie_id, costumer_id, stars, reviewtext } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO review (movie_id, costumer_id, stars, reviewtext) VALUES ($1, $2, $3, $4) RETURNING *',
            [movie_id, costumer_id, stars, reviewtext]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Favoriten hinzufügen**
app.post('/favorites', async (req, res) => {
    const { costumer_id, movie_id } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO connection_table (costumer_id, movie_id) VALUES ($1, $2) RETURNING *',
            [costumer_id, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Favoriten eines Benutzers abrufen (mit Stored Procedure)**
app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await client.query('SELECT * FROM get_user_favorites($1)', [username]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Kundenregistrierung mit Passwort-Sicherheit**
app.post('/costumers', async (req, res) => {
    const { name, username, password, birthyear } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query(
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

// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
