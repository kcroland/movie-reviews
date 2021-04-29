/*
	setup.sql is the sql file for "Movie Reviews".
	It assumes there is a reviews database,
	then creates a reviews table of columns id, author, title.
	releas_year, score, and comments. Adds three premade
	movie reviews to the table to begin with.
*/

DROP TABLE IF EXISTS Reviews;

-- create a reviews table in the reviews database
CREATE TABLE Reviews(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	author VARCHAR(255),
	title VARCHAR(255),
	release_year INT,
	score INT,
	comments VARCHAR(255)
);

-- Insert three values into the reviews database
INSERT INTO Reviews (id, author, title, release_year, score, comments)
  VALUES (1, "Kyle", "Scott Pilgrim vs. the World", 2010, 90, 
  	"'Bread makes you fat?' Awesome Movie.");

INSERT INTO Reviews (id, author, title, release_year, score, comments)
  VALUES (2, "Thanos", "Avengers: Infinity War", 2018, 100, 
  	"'You should have gone for the head.'");

INSERT INTO Reviews (id, author, title, release_year, score, comments)
  VALUES (3, "Tony Stark", "Iron Man", 2008, 100, 
  	"The spark that started a universe and decade long story.");