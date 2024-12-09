import express from 'express';

var app = express();
app.use(express.json()); // Middleware for parsing JSON bodies

// Define raw endpoints

// Add a new genre
app.post('/genres', (req, res) => {
    res.send('Add genre endpoint - Placeholder');
});

// Add a new movie
app.post('/movies', (req, res) => {
    res.send('Add movie endpoint - Placeholder');
});

// Register a new user
app.post('/users', (req, res) => {
    res.send('Register user endpoint - Placeholder');
});

// Get a movie by ID
app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    res.send(`Get movie by ID ${movieId} - Placeholder`);
});

// Delete a movie by ID
app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    res.send(`Delete movie by ID ${movieId} - Placeholder`);
});

// Get all movies
app.get('/movies', (req, res) => {
    res.send('Get all movies endpoint - Placeholder');
});

// Get movies by keyword
app.get('/movies/search', (req, res) => {
    const keyword = req.query.keyword;
    res.send(`Search movies by keyword: ${keyword} - Placeholder`);
});

// Add a movie review
app.post('/reviews', (req, res) => {
    res.send('Add movie review endpoint - Placeholder');
});

// Add favorite movie for a user
app.post('/favorites', (req, res) => {
    res.send('Add favorite movie endpoint - Placeholder');
});

// Get favorite movies by username
app.get('/favorites/:username', (req, res) => {
    const username = req.params.username;
    res.send(`Get favorite movies for user ${username} - Placeholder`);
});

app.listen(3001, () => {
    console.log('The server is running on port 3001!');
});
