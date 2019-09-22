        DROP TABLE IF EXISTS burger_ingredients;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS burgers;

        CREATE TABLE burgers (
            id         INT NOT NULL AUTO_INCREMENT,
            name       VARCHAR(100) NOT NULL,
            devoured   BOOLEAN NOT NULL DEFAULT FALSE,
            createdAt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );

        CREATE TABLE ingredients (
            id         INT NOT NULL AUTO_INCREMENT,
            name       VARCHAR(100) NOT NULL,
            createdAt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY(id)
        );

        CREATE TABLE burger_ingredients (
            id               INT NOT NULL AUTO_INCREMENT,
            fk_burger_id     INT NOT NULL,
            fk_ingredient_id INT NOT NULL,
            createdAt        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            CONSTRAINT fk_burger_id     FOREIGN KEY (fk_burger_id)     REFERENCES burgers(id),
            CONSTRAINT fk_ingredient_id FOREIGN KEY (fk_ingredient_id) REFERENCES ingredients(id)
        );

        INSERT INTO burgers (name)
        VALUES  ("Cheese Burger"),
                ("Bacon Cheese Burger"),
                ("Bacon Avocado Burger");

        INSERT INTO ingredients (name)
        VALUES  ("Cheese"),
                ("Bacon"),
                ("Avocado"),
                ("Lettuce"),
                ("Tomato"),
                ("Onion"),
                ("Mayo"),
                ("Ketchup"),
                ("Mustard");
                
        INSERT INTO burger_ingredients (fk_burger_id, fk_ingredient_id)
        VALUES  (1, 1),
                (2, 1),
                (2, 2),
                (3, 2),
                (3, 3);