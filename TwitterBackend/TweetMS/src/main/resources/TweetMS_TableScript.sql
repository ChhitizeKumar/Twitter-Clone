DROP SCHEMA IF EXISTS tweet_db;

CREATE SCHEMA tweet_db;
USE tweet_db;

CREATE TABLE tweets(
    tweet_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    content VARCHAR(300) NOT NULL,   
    likes INT NOT NULL,
   
    CONSTRAINT ps_tweet_id_pk PRIMARY KEY (tweet_id)
);

INSERT INTO tweets VALUES
(1, 1002,'This is my first tweet!', 10),
(2, 1002,'Loving the weather today.', 25),
(3, 1002, 'Check out this video!', 8),
(4, 1002, 'Working on a new project!', 15),
(5, 1002, 'Attending a tech conference!', 30),
(6, 123, 'Having fun with Spring Boot!', 50),
(7, 128, 'Just posted a new blog!', 12);
