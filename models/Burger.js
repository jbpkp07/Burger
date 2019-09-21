"use strict";
/* global module, require */

const configPaths = require('../config/configPaths.js');
const ORM = require(configPaths.ormPath);


class Burger extends ORM {

    constructor(mysqlDatabase) {

        const tableName = "burgers";
        const idColumnName = "id";
        const dataColumnNames = ["name", "devoured"];

        super(mysqlDatabase, tableName, idColumnName, dataColumnNames);

        this.id = null;
        this.name = null;
        this.devoured = false;
    }

    setValues(name, devoured) {

        this.name = name;
        this.devoured = devoured;
    }

    save() {

        const promise = this.saveOne();

        return promise;
    }

    // getSimpleObject() {

    //     const simpleOBJ =
    //     {
    //         name: this.name,
    //         devoured: this.devoured
    //     };

    //     if (this.id !== null) {

    //         simpleOBJ.id = this.id;
    //     }

    //     return simpleOBJ;
    // }
}


module.exports = Burger;