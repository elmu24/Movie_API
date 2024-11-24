-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
CREATE TABLE Genre (
    GenreID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Name VARCHAR(50) NOT NULL
);

CREATE TABLE FavoriteMovie (
    FavoriteMovieID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    Title VARCHAR(50) NOT NULL
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

CREATE TABLE Movie (
    MovieID INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    GenreID INT,
    Name VARCHAR(50) NOT NULL,
    Year INT,
    UserID INT,
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

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

