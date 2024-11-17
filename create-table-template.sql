-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
CREATE TABLE Genre (
    GenreID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(50) NOT NULL
);
INSERT INTO Genre VALUES 
('drama'),('comedy'),('scifi'),('fantasy'),('action'),('triller');

CREATE TABLE FavoriteMovie (
    FavoriteMovieID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
);


CREATE TABLE User (
    UserID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    FavoriteMovieID INT,
    Name VARCHAR(50) NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Birthyear INT,
    FOREIGN KEY (FavoriteMovieID) REFERENCES FavoriteMovie(FavoriteMovieID)
);
INSERT INTO User VALUES
('reimarii', 'Reima Riihimäki', 'qwerty123', 1986),
('lizzy', 'Lisa Simpson', 'abcdef', 1991 ),
('boss', 'Ben Bossy', 'salasana', 1981 )

CREATE TABLE Movie (
    MovieID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    GenreID INT,
    Name VARCHAR(50) NOT NULL,
    Year INT,
    UserID INT,
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);
INSERT INTO Movie (name, year, genre) VALUES 
('Inception', 2010, 'action'),
('The Terminator', 1984, 'action'),
('Tropic Thunder', 2008, 'comedy'),
('Borat', 2006, 'comedy'),
('Interstellar', 2014, 'drama'),
('Joker', 2019, 'drama');

CREATE TABLE Review (
    ReviewID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    MovieID INT,
    UserID INT,
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText VARCHAR(50),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Connection_table (
    FavoriteMovieID INT NOT NULL,
    MovieID INT NOT NULL,
    PRIMARY KEY (FavoriteMovieID, MovieID),
    FOREIGN KEY (FavoriteMovieID) REFERENCES FavoriteMovie(FavoriteMovieID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);
