DROP SCHEMA IF EXISTS followers_following_db;

CREATE SCHEMA followers_following_db;
USE followers_following_db;

drop table IF EXISTS follows;
CREATE TABLE follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,
    UNIQUE KEY unique_follow (follower_id, following_id)
);


INSERT INTO follows VALUES (101, 1001, 1005);
INSERT INTO follows VALUES (102, 1005, 1001);
INSERT INTO follows VALUES (103, 1001, 1004);
INSERT INTO follows VALUES (104, 1008, 1001);
INSERT INTO follows VALUES (105, 1007, 1001);
INSERT INTO follows VALUES (106, 1002, 1001);
INSERT INTO follows VALUES (107, 1004, 1002);
INSERT INTO follows VALUES (108, 1005, 1002);
INSERT INTO follows VALUES (109, 1007, 1002);
INSERT INTO follows VALUES (110, 1009, 1002);
INSERT INTO follows VALUES (111, 1010, 1002);

commit;

select*from follows;