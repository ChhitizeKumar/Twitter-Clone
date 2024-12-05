CREATE DATABASE IF NOT EXISTS twitter_user_db;

USE twitter_user_db;

DROP TABLE IF EXISTS User;

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    profile_image_media_id VARCHAR(255)
);

INSERT INTO User (email, full_name, password, username, profile_image_media_id)
VALUES
('john.doe@example.com', 'John Doe', 'encrypted_password_123', 'johndoe', 'media_001'),
('jane.smith@example.com', 'Jane Smith', 'encrypted_password_456', 'janesmith', 'media_002'),
('alice.jones@example.com', 'Alice Jones', 'encrypted_password_789', 'alicejones', 'media_003');
