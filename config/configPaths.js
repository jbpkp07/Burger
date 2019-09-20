"use strict";
/* global require, __dirname, module */

const path = require('path');


function getFullPath(relativePath) {

    return path.join(__dirname, relativePath);
}

const configPaths =
{
    dotEnvPath:                  getFullPath('../config/.env'),
    configConnectionDetailsPath: getFullPath('../config/configConnectionDetails.js'),
    mySQLConnectionDetailsPath:  getFullPath('../db/MySQLConnectionDetails.js'),
    mySQLDatabasePath:           getFullPath('../db/MySQLDatabase.js'),
    sqlSchemaPath:               getFullPath('../db/schema.sql'),
    sqlSeedsPath:                getFullPath('../db/seeds.sql'),
    publicAssetsPath:            getFullPath('../public/assets'),
    inquirerPromptsPath:         getFullPath('../utility/InquirerPrompts.js'),
    printHeaderFunctionsPath:    getFullPath('../utility/printHeaderFunctions.js')
};


module.exports = configPaths;