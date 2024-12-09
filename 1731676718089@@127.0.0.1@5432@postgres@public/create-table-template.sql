-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
-- Active: 1731676718089@@127.0.0.1@5432@postgres@public
CREATE TABLE genre (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE favoriteMovie (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE costumer(
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    PRIMARY KEY (id),
    name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    birthyear INT,
    favoriteMovie_id INT,
    FOREIGN KEY (favoriteMovie_id) REFERENCES favoriteMovie(id)
);

CREATE TABLE movie (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    genre_id INT,
    name VARCHAR(50) NOT NULL,
    year INT,
    costumer_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (genre_id) REFERENCES genre(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);

CREATE TABLE review (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    movie_id INT,
    costumer_id INT,
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText VARCHAR(5000),
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id) REFERENCES movie(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);

CREATE TABLE connection (
    favoriteMovie_id INT NOT NULL,
    costumer_id INT NOT NULL,
    PRIMARY KEY (favoriteMovie_id, costumer_id),
    FOREIGN KEY (favoriteMovie_id) REFERENCES favoriteMovie(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);


