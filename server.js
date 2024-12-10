import express from 'express';

var app = express();
app.listen(3002, ()=>{
console.log('The server is running!!');
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});

// Adding new genre
app.post('/genres', (req, res) => {
    const genre = req.body;
    res.send({ message: 'Genre added successfully', genre });
});

// Adding new movie
app.post('/movies', (req, res) => {
    const movie = req.body;
    res.send({ message: 'Movie added successfully', movie });
});

// Registering new user
app.post('/user', (req, res) => {
    const user = req.body;
    res.send({ message: 'User register successfully', user });
});

// Getting movie with ID
app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    res.send({ message: `Movie with ID ${movieId} retrieved successfully` });
});

// Deleting movie by ID
app.delete('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    res.send({ message: `Movie with ID ${movieId} deleted successfully` });
});

// Getting all movies
app.get('/movies', (req, res) => {
    res.send({ message: 'All movies retrieved successfully' });
});

// Getting movies by keyword
app.get('/movies/search', (req, res) => {
    const keyword = req.query.keyword;
    res.send({ message: `Movies matching keyword: ${keyword} retrieved successfully` });
});

// Adding movie review
app.post('/reviews', (req, res) => {
    const review = req.body;
    res.send({ message: 'Review added successfully', review });
});

// Adding favorite movie for user
app.post('/favorites', (req, res) => {
    const favorite = req.body;
    res.send({ message: 'Favorite movie added successfully', favorite });
});

// Get favorite movies by username
app.get('/favorites/:username', (req, res) => {
    const username = req.params.username;
    res.send({ message: `Favorite movies for user ${username} retrieved successfully` });
});

