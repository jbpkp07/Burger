"use strict";
/* global module, require */

const configPaths = require('../config/configPaths.js');
const ORM = require(configPaths.ormPath);


class BurgersDatabase extends ORM {

    constructor(mysqlDatabase) {

        super(mysqlDatabase);

        this.burgersTableName = "burgers";
        this.ingredientsTableName = "ingredients";
    }

    getAllBurgers() {

        const promise = this.selectAll(this.burgersTableName);

        return promise;
    }

    getAllIngredients() {

        const promise = this.selectAll(this.ingredientsTableName);

        return promise;
    }
}


module.exports = BurgersDatabase;