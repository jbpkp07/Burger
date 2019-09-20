"use strict";
/* global require, process, __dirname */

const port = process.env.PORT || 3000;

const configPaths = require('./config/configPaths.js');
const terminal = require('terminal-kit').terminal;
const express = require('express');
const header = require(configPaths.printHeaderFunctionsPath);
const MySQLDatabase = require(configPaths.mySQLDatabasePath);
// const HTMLroutes = require(paths.htmlRoutesPath);
// const APIRoutes = require(paths.apiRoutesPath);

const app = express();

app.use(express.static(configPaths.publicAssetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mysqlDatabase = new MySQLDatabase();

// const htmlRoutes = new HTMLroutes(paths);
// const apiRoutes  = new APIRoutes(paths, friendsDatabase);

// app.use(htmlRoutes.router);
// app.use(apiRoutes.router);

app.listen(port, () => {

    terminal.hideCursor();

    header.printHeader();

    terminal.white("  Webserver listening on port ► ").brightGreen(port + "\n\n");

    mysqlDatabase.connect();
});