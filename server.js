import express from 'express';
import cors from 'cors';
import pgPool from './pg_connection.js'; 
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());
app.use(cors());

// Start the server
app.listen(3002, () => {
    console.log(`Server is running!`);
});

// Test database connection
(async () => {
    try {
        const client = await pgPool.connect();
        console.log('Database connected successfully!');
        client.release();
    } catch (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1);
    }
})();

// **Root Endpoint**
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// **Add Genre**
app.post('/genres', async (req, res) => {
    const { name } = req.query;
    try {
        const result = await pgPool.query('INSERT INTO Genre (Name) VALUES ($1) RETURNING *', [name]);
        

        res.status(201).json({ message: 'genre added successfully!', genre: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Get All Genres**
app.get('/genres', async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM Genre');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Add Movie**
app.post('/movies', async (req, res) => {
    const { name, year, genre_id } = req.query;
    try {
        const result = await pgPool.query(
            'INSERT INTO Movie (Name, Year, GenreID) VALUES ($1, $2, $3) RETURNING *',
            [name, year, genre_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Get All Movies with Pagination**
app.get('/movies', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const result = await pgPool.query('SELECT * FROM Movie LIMIT $1 OFFSET $2', [limit, offset]);
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

// **Search Movies by Keyword**
app.get('/movies/search', async (req, res) => {
    const keyword = req.query.keyword || '';
    try {
        let result;

        if (!keyword) {
            
            result = await pgPool.query(
                'SELECT Name, Year, GenreID FROM Movie'
            );
        } else {
            
            const formattedKeyword = `%${keyword.toLowerCase()}%`;
            result = await pgPool.query(
                'SELECT Name, Year, GenreID FROM Movie WHERE LOWER(Name) LIKE $1 OR CAST(Year AS TEXT) LIKE $1',
                [formattedKeyword]
            );
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Get Movie by ID**
app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgPool.query('SELECT * FROM Movie WHERE MovieID = $1', [id]);
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

// **Update Movie**
app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const { name, year, genre_id } = req.body;

    try {
        const result = await pgPool.query(
            'UPDATE Movie SET Name = $1, Year = $2, GenreID = $3 WHERE MovieID = $4 RETURNING *',
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

// **Delete Movie**
app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pgPool.query('DELETE FROM Movie WHERE MovieID = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Movie deleted successfully', movie: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        if (err.code === '23503') {
            res.status(400).json({
                error: 'Cannot delete movie because it is referenced by other records.',
            });
        } else {
            console.error('Error executing query:', err.stack);
            res.status(500).json({ error: 'Database error' });
        }
    }
});

// **Register Costumer**
app.post('/costumer', async (req, res) => {
    const { name, username, password, birthyear } = req.query;

    try {
        
        const userExists = await pgPool.query('SELECT * FROM Users WHERE Username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists. Please choose a different one.' });
        }

       
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        const result = await pgPool.query(
            'INSERT INTO Users (Name, Username, Password, BirthYear) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, username, hashedPassword, birthyear]
        );

        res.status(201).json({ message: 'Costumer registered successfully!', costumer: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add Movie Review
app.post('/reviews', async (req, res) => {
    const { username, stars, desc, movie_id } = req.query;

    try {
        
        const userResult = await pgPool.query('SELECT UserID FROM Users WHERE Username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user_id = userResult.rows[0].userid; 

        
        const result = await pgPool.query(
            'INSERT INTO Review (MovieID, UserID, Stars, ReviewText) VALUES ($1, $2, $3, $4) RETURNING *',
            [movie_id, user_id, stars, desc]
        );

        res.status(201).json({ message: 'Review added successfully!', review: result.rows[0] });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// **Add Favorite Movie**
app.post('/favorites', async (req, res) => {
    const { user_id, movie_id } = req.query; 
    try {
        const result = await pgPool.query(
            'INSERT INTO Connection_Table (UserID, MovieID) VALUES ($1, $2) RETURNING *',
            [user_id, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get favorite movies by user
app.get('/favorites/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pgPool.query(
            'SELECT m.Name, m.Year, m.GenreID ' +
            'FROM Connection_Table ct ' +
            'JOIN Users u ON ct.UserID = u.UserID ' +
            'JOIN Movie m ON ct.MovieID = m.MovieID ' +
            'WHERE u.Username = $1',
            [username]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

// Error Handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


