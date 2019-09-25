"use strict";

const configPaths = require("../config/configPaths.js");
const ORM = require(configPaths.ormPath);


class BurgerIngredient extends ORM {

    constructor(mysqlDatabase) {

        const tableName = "burger_ingredients";
        const idColumnName = "id";
        const dataColumnNames = ["fk_burger_id", "fk_ingredient_id"];

        super(mysqlDatabase, tableName, idColumnName, dataColumnNames);

        this.id = null;
        this.fk_burger_id = null;
        this.fk_ingredient_id = null;

        this.isSaved = false;
    }

    setValues(fkBurgerId, fkIngredientId) {

        this.fk_burger_id = fkBurgerId;
        this.fk_ingredient_id = fkIngredientId;
    }

    save() {

        const promise = this.saveOne();
        
        return promise;
    }

    delete() {

        const promise = this.deleteOne();

        return promise;
    }
}


module.exports = BurgerIngredient;