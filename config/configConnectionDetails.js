"use strict";

const configPaths = require("./configPaths.js");

const dotEnvOptionsOBJ = 
{
   path: configPaths.dotEnvPath
};

require("dotenv").config(dotEnvOptionsOBJ);


const configConnectionDetails =
{
   host: "localhost",
   port: 3306,
   user: process.env.BURGERS_DB_USER || "root",
   password: process.env.BURGERS_DB_PASS || "",
   database: "burgers_db",
   multipleStatments: true
};


module.exports = configConnectionDetails;