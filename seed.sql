USE my_database_1;

DROP TABLES IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(50) NOT NULL,
    `school` INT(4) NOT NULL DEFAULT 0,
    `role` INT(4) NOT NULL DEFAULT 0,
    CONSTRAINT user_pk PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users (`name`, `email`, `passwordHash`)
VALUES ('Admin1', 'admin1@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y'),
       ('Admin2', 'admin2@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y');
