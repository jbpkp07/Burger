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

    save(fkBurgerId, fkIngredientId) {

        this.setValues(fkBurgerId, fkIngredientId);

        const promise = this.saveOne();
        
        return promise;
    }

    delete(id) {

        this.id = id;

        const promise = this.deleteOne();

        return promise;
    }

    deleteByFKBurgerId(fkBurgerId) {

        const query = `DELETE FROM ?? WHERE ?? = ?`;

        const promise = this.queryDatabase(query, [this.tableName, "fk_burger_id", fkBurgerId]);

        return promise;
    }

    setValues(fkBurgerId, fkIngredientId) {

        this.fk_burger_id = fkBurgerId;
        this.fk_ingredient_id = fkIngredientId;
    }
}


module.exports = BurgerIngredient;