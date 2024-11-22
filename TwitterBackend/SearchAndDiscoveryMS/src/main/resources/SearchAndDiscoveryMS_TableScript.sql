DROP SCHEMA IF EXISTS user_db;

CREATE SCHEMA user_db;
USE user_db;

CREATE TABLE search(
    search_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(300) NOT NULL,   
    username VARCHAR(300) NOT NULL,

   
    CONSTRAINT ps_search_id_pk PRIMARY KEY (search_id)
);

INSERT INTO search VALUES
(1, 123,'Harry','Harry@7Hocruxes'),
(2, 124,'Jon','Jon@WhiteWolf'),
(3, 125, 'Robb','Robb@YoungWolf'),
(4, 126, 'Ned','Ned@WardenOfNorth'),
(5, 127, 'Jonn','jonn@Eyrie');
