-- Tabelle Genre
CREATE TABLE genre (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Einfügen von Daten in Genre
INSERT INTO genre (name) VALUES 
('drama'), ('comedy'), ('scifi'), ('fantasy'), ('action'), ('thriller');

-- Tabelle FavoriteMovie
CREATE TABLE favoriteMovie (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Tabelle Costumer
CREATE TABLE costumer (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    birthyear INT,
    favoriteMovie_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (favoriteMovie_id) REFERENCES favoriteMovie(id)
);

-- Einfügen von Daten in Costumer
INSERT INTO costumer (name, password, birthyear) VALUES
('Reima Riihimäki', 'qwerty123', 1986),
('Lisa Simpson', 'abcdef', 1991),
('Ben Bossy', 'salasana', 1981);

-- Tabelle Movie
CREATE TABLE movie (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    genre_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    costumer_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (genre_id) REFERENCES genre(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);

-- Einfügen von Daten in Movie
INSERT INTO movie (name, year, genre_id) VALUES 
('Inception', 2010, 5),
('The Terminator', 1984, 5),
('Tropic Thunder', 2008, 2),
('Borat', 2006, 2),
('Interstellar', 2014, 1),
('Joker', 2019, 1);

-- Tabelle Review
CREATE TABLE review (
    id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    movie_id INT NOT NULL,
    costumer_id INT NOT NULL,
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText VARCHAR(5000),
    PRIMARY KEY (id),
    FOREIGN KEY (movie_id) REFERENCES movie(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);

-- Tabelle Connection (Verknüpfungstabelle zwischen FavoriteMovie und Costumer)
CREATE TABLE connection (
    favoriteMovie_id INT NOT NULL,
    costumer_id INT NOT NULL,
    PRIMARY KEY (favoriteMovie_id, costumer_id),
    FOREIGN KEY (favoriteMovie_id) REFERENCES favoriteMovie(id),
    FOREIGN KEY (costumer_id) REFERENCES costumer(id)
);
