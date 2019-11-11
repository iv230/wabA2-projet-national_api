USE my_database_1;

DROP TABLE IF EXISTS schools;
CREATE TABLE IF NOT EXISTS schools (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    CONSTRAINT school_pk PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS roles;
CREATE TABLE IF NOT EXISTS roles (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    CONSTRAINT school_pk PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(64) NOT NULL,
    `school` INT(4) NOT NULL DEFAULT 0,
    `role` INT(4) NOT NULL DEFAULT 0,
    CONSTRAINT user_pk PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE users
    ADD CONSTRAINT `FK_user_shcool` FOREIGN KEY (`school`) REFERENCES `schools` (`id`),
    ADD CONSTRAINT `FK_user_role` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);

INSERT INTO schools (`name`)
VALUES ('Lile'),
       ('Arras'),
       ('Brest'),
       ('Caen'),
       ('Rouen'),
       ('Reims'),
       ('Nanterre'),
       ('Nancy'),
       ('Strasbourg'),
       ('Saint-Nazaire'),
       ('Nantes'),
       ('Dijon'),
       ('La-Rochelle'),
       ('Angoulème'),
       ('Lyon'),
       ('Grenoble'),
       ('Bordeaux'),
       ('Pau'),
       ('Toulouse'),
       ('Montpellier'),
       ('Aix-en-Provence'),
       ('Nice');

INSERT INTO roles (`name`)
VALUES ('Student'),
       ('BDE-Staff'),
       ('CESI-Staff'),
       ('Admin');

INSERT INTO users (`name`, `email`, `passwordHash`, `school`, `role`)
VALUES ('Admin1', 'admin1@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y', 22, 4),
       ('Admin2', 'admin2@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y', 22, 4),
       ('Student1', 'student1@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y', 22, 1),
       ('BDE1', 'bde1@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y', 22, 2),
       ('CESI1', 'cesi1@exemple.com', '$2y$10$yRryXxcXaRJ4Azw76wzNt.po12nAXqPF3oPJqyyBfxktz3QoenM6y', 22, 3);
