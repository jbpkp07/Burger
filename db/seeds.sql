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