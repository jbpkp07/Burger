"use strict";

const terminal = require("terminal-kit").terminal;
const express = require("express");


class Controller {

    constructor(burgersDatabase) {

        this.burgersDatabase = burgersDatabase;

        this.router = express.Router();

        this.assignRouteListeners();
    }

    assignRouteListeners() {

        this.getHomePage();

        this.postAPIBurgers();

        this.putAPIBurgers();

        this.deleteAPIBurgers();
    }

    getHomePage() {  //Single page web app, this is the only page needed!

        this.router.get("/", (request, response) => {

            const handleBarsOBJ = {};

            const burgersPromise = this.burgersDatabase.getAllBurgers();

            burgersPromise.then((burgers) => {

                handleBarsOBJ.burgers = burgers;
            });

            const ingredientsPromise = this.burgersDatabase.getAllIngredients();

            ingredientsPromise.then(([rows, fields]) => {

                handleBarsOBJ.ingredients = rows;
            });

            Promise.all([burgersPromise, ingredientsPromise]).then(() => {

                response.render("index", handleBarsOBJ);

            }).catch((error) => {

                response.status(500).send(error);
            });
        });
    }

    postAPIBurgers() {

        this.router.post("/api/burgers", (request, response) => {

            const { name } = request.body;
            let { ingredientIDs } = request.body;

            ingredientIDs = JSON.parse(ingredientIDs);  //JSON.stringify (client) then JSON.parse (server) allows empty arrays to be used for POST 

            if (this.validatePost(name, ingredientIDs)) {

                this.burgersDatabase.addNewBurger(name, ingredientIDs).then((result) => {

                    response.json(result);

                }).catch((error) => {

                    terminal.red(`  Unable to save new burger:\n${error}`);

                    response.status(500).send(error);
                });
            }
            else {

                terminal.red(`  Invalid POST data:\n`);
                console.log(name);
                console.log(ingredientIDs);

                response.status(422).send(`Invalid POST data:\n${name}\n${ingredientIDs}`);  //Unprocessable Entity (bad request data) 
            }
        });
    }

    putAPIBurgers() {

        this.router.put("/api/burgers/:id", (request, response) => {

            const id = request.params.id;
            const name = request.body.name;
            const devoured = request.body.devoured;

            this.burgersDatabase.updateBurger(id, name, devoured).then(() => {

                response.status(200).end();

            }).catch((error) => {

                terminal.red(`  Unable to update burger:\n${error}`);

                response.status(500).send(error);
            });
        });
    }

    deleteAPIBurgers() {

        this.router.delete("/api/burgers/:id", (request, response) => {

            const id = request.params.id;
            // const name = request.body.name;
            // const devoured = request.body.devoured;

            this.burgersDatabase.deleteBurger(id).then(() => {

                response.status(200).end();

            }).catch((error) => {

                terminal.red(`  Unable to delete burger:\n${error}`);

                response.status(500).send(error);
            });
        });
    }

    validatePost(name, ingredientIDs) {

        if (typeof name !== "string" || name.length === 0) {

            return false;
        }

        if (name.length > 30) {

            return false;
        }

        if (!Array.isArray(ingredientIDs)) {

            return false;
        }

        for (const id of ingredientIDs) {

            if (typeof id !== "number" || id <= 0) {

                return false;
            }
        }

        return true;
    }
}


module.exports = Controller;