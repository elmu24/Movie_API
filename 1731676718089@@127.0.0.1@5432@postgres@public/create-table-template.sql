-- Table: Genre
CREATE TABLE Genre (
    GenreID INT GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (GenreID)
);

-- Insert Data in Genre
INSERT INTO Genre (Name) VALUES 
('Drama'), ('Comedy'), ('Sci-fi'), ('Fantasy'), ('Action'), ('Thriller');


-- Table: Users
CREATE TABLE Users (
    UserID INT GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(200) NOT NULL,
    Username VARCHAR(200) NOT NULL UNIQUE,
    Password VARCHAR(200) NOT NULL,
    BirthYear INT NOT NULL,
    PRIMARY KEY (UserID)
);

-- Insert Data in Users
INSERT INTO Users (Name, Username, Password, BirthYear) VALUES
('Reima Riihimäki', 'reima', 'qwerty123', 1986),
('Lisa Simpson', 'lisa', 'abcdef', 1991),
('Ben Bossy', 'ben', 'salasana', 1981),
('Anna Doe', 'anna', '123456', 1990),
('John Smith', 'john', 'password123', 1995),
('Emma Brown', 'emma', 'mypassword', 1988),
('Tom White', 'tom', 'securepass', 2000);


-- Table: Movie
CREATE TABLE Movie (
    MovieID INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    GenreID INT,
    Name VARCHAR(50),
    Year INT,
    PRIMARY KEY (MovieID),
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID) ON DELETE CASCADE
);

-- Insert Data in Movie
INSERT INTO Movie (Name, Year, GenreID) VALUES
('Inception', 2010, 5),
('The Terminator', 1984, 5),
('Tropic Thunder', 2008, 2),
('Borat', 2006, 2),
('Interstellar', 2014, 1),
('Joker', 2019, 1),
('Avatar', 2009, 3),
('Harry Potter', 2001, 4),
('The Matrix', 1999, 3),
('Pulp Fiction', 1994, 1),
('The Dark Knight', 2008, 5);


-- Table: Review
CREATE TABLE Review (
    ReviewID INT GENERATED ALWAYS AS IDENTITY,
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText VARCHAR(5000),
    MovieID INT NOT NULL,
    UserID INT NOT NULL,
    PRIMARY KEY (ReviewID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Insert Data in Review
INSERT INTO Review (Stars, ReviewText, MovieID, UserID) VALUES
(5, 'Amazing movie with great plot!', 1, 1),
(4, 'Classic action movie!', 2, 2),
(3, 'Not as funny as I expected.', 3, 3),
(5, 'Brilliant storytelling!', 5, 4),
(2, 'Not my taste.', 6, 5);


-- Table: FavoriteMovie
CREATE TABLE FavoriteMovie (
    FavoriteMovieID INT GENERATED ALWAYS AS IDENTITY,
    Title VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (FavoriteMovieID)
);

-- Insert Data in FavoriteMovie
INSERT INTO FavoriteMovie (Title) VALUES
('Sci-fi Masterpieces'),
('Comedy Classics'),
('Drama Favorites'),
('Action Hits'),
('Fantasy Adventures');


-- Table: Connection_Table (Mapping Users to Favorite Movies and Movies)
CREATE TABLE Connection_Table (
    FavoriteMovieID INT,
    UserID INT,
    MovieID INT,
    PRIMARY KEY (FavoriteMovieID, UserID, MovieID),
    FOREIGN KEY (FavoriteMovieID) REFERENCES FavoriteMovie(FavoriteMovieID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID) ON DELETE CASCADE
);

-- Insert Data in Connection_Table
INSERT INTO Connection_Table (FavoriteMovieID, UserID, MovieID) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 5),
(4, 4, 6),
(5, 5, 7),
(1, 6, 8),
(2, 1, 9),
(3, 2, 10);
