"use strict";

const configPaths = require("../config/configPaths.js");
const ORM = require(configPaths.ormPath);
const Burger = require(configPaths.burgerModelPath);
const BurgerIngredient = require(configPaths.burgerIngredientModelPath);


class BurgersDatabase extends ORM {

    constructor(mysqlDatabase) {

        super(mysqlDatabase);

        this.burgersTableName = "burgers";
        this.ingredientsTableName = "ingredients";
    }

    getAllBurgers() {

        return new Promise((resolve, reject) => {

            const query = `SELECT 	burgers.id AS id,
                                    burgers.name AS name, 
                                    burgers.devoured,
                                    ingredients.name AS ingredient
                            FROM burger_ingredients
                            INNER JOIN burgers ON burgers.id = burger_ingredients.fk_burger_id
                            INNER JOIN ingredients ON ingredients.id = burger_ingredients.fk_ingredient_id;`;

            const promise = this.queryDatabase(query, []);  //custom query

            promise.then(([rows, fields]) => {
     
                const burgers = [];

                let burger = {};

                for (const burgerIngredient of rows) {

                    if (!burger.id || burger.id !== burgerIngredient.id) {

                        if (burger.id) {

                            burgers.push(burger);
                        }

                        burger = {};
                        burger.id = burgerIngredient.id;
                        burger.name = burgerIngredient.name;
                        burger.devoured = Boolean(burgerIngredient.devoured);
                        burger.ingredients = [];
                    }

                    burger.ingredients.push(burgerIngredient.ingredient);
                }

                burgers.push(burger);

                resolve(burgers);

            }).catch((error) => {

                reject(error);
            });
        });
    }

    getAllIngredients() {

        const promise = this.selectAll(this.ingredientsTableName);

        return promise;
    }

    addNewBurger(name, ingredientIDs) {

        return new Promise((resolve, reject) => {

            const newBurger = new Burger(this.mysqlDatabase);

            newBurger.setValues(name, false);

            newBurger.save().then(() => {

                if (newBurger.id === null) {

                    reject("New burger was not saved correctly, id is missing.");
                    return;
                }

                const promises = [];

                for (const ingredientId of ingredientIDs) {

                    const newBurgerIngredient = new BurgerIngredient(this.mysqlDatabase);

                    newBurgerIngredient.setValues(newBurger.id, ingredientId);

                    const promise = newBurgerIngredient.save();

                    promises.push(promise);
                }

                Promise.all(promises).then(() => {

                    resolve("Burger added successfully.");

                }).catch((error) => {

                    reject(error);
                });

            }).catch((error) => {

                reject(error);
            });
        });
    }
}


module.exports = BurgersDatabase;