"use strict";

const path = require("path");


function getFullPath(relativePath) {

    return path.join(__dirname, relativePath);
}

const configPaths =
{
    dotEnvPath:                  getFullPath("../config/.env"),
    configConnectionDetailsPath: getFullPath("../config/configConnectionDetails.js"),
    controllerPath:              getFullPath("../controllers/Controller.js"),
    burgersDatabasePath:         getFullPath("../db/BurgersDatabase.js"),
    mySQLConnectionDetailsPath:  getFullPath("../db/MySQLConnectionDetails.js"),
    mySQLDatabasePath:           getFullPath("../db/MySQLDatabase.js"),
    ormPath:                     getFullPath("../db/ORM.js"),
    sqlSchemaPath:               getFullPath("../db/schema.sql"),
    sqlSeedsPath:                getFullPath("../db/seeds.sql"),
    burgerModelPath:             getFullPath("../models/Burger.js"),
    burgerIngredientModelPath:   getFullPath("../models/BurgerIngredient.js"),
    publicAssetsPath:            getFullPath("../public/assets"),
    inquirerPromptsPath:         getFullPath("../utility/InquirerPrompts.js"),
    printHeaderFunctionsPath:    getFullPath("../utility/printHeaderFunctions.js")
};


module.exports = configPaths;