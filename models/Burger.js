"use strict";

const configPaths = require("../config/configPaths.js");
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

        this.isSaved = false;
    }

    save(name, devoured) {

        this.setValues(name, devoured);

        const promise = this.saveOne();
        
        return promise;
    }

    saveUpdate(id, name, devoured) {

        this.id = id;

        this.isSaved = true;

        const promise = this.save(name, devoured);

        return promise;
    }

    delete(id) {

        this.id = id;

        const promise = this.deleteOne();

        return promise;
    }

    setValues(name, devoured) {

        this.name = name;
        this.devoured = devoured;
    }
}


module.exports = Burger;