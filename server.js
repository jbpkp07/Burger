"use strict";

const port = process.env.PORT || 3000;

const configPaths = require("./config/configPaths.js");
const terminal = require("terminal-kit").terminal;
const express = require("express");
const expressHandlebars = require("express-handlebars");
const header = require(configPaths.printHeaderFunctionsPath);
const MySQLDatabase = require(configPaths.mySQLDatabasePath);
const BurgersDatabase = require(configPaths.burgersDatabasePath);
const Controller = require(configPaths.controllerPath);

const mysqlDatabase = new MySQLDatabase(true);

const burgersDatabase = new BurgersDatabase(mysqlDatabase);

const controller = new Controller(burgersDatabase);

const app = express();

app.use(express.static(configPaths.publicAssetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(controller.router);
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

header.printHeader();

mysqlDatabase.connect().then(() => {
       
    app.listen(port, () => {

        terminal.white("  Webserver listening on port ► ").brightGreen(port + "\n\n");
    });  
    
});