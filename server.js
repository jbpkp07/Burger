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






const mysqlDatabase = new MySQLDatabase(true);


const ORM = require(configPaths.ormPath);
const orm = new ORM(mysqlDatabase, "burgers");


const Burger = require(configPaths.burgerModelPath);
const burger = new Burger(mysqlDatabase);

// const htmlRoutes = new HTMLroutes(paths);
// const apiRoutes  = new APIRoutes(paths, friendsDatabase);

// app.use(htmlRoutes.router);
// app.use(apiRoutes.router);







header.printHeader();

mysqlDatabase.connect().then(() => {
       
    burger.setValues("blah12345", false);

    burger.save().then((result) => {
        
        console.log(result);

        burger.setValues("coolio", true);

        burger.save().then((result) => {
        
            console.log(result);
    
        }).catch((err) => {
    
            console.log(err);
        });


    }).catch((err) => {

        console.log(err);
    });





    // burger.setValues("Jeremy 123", false);

    // burger.save().then((result) => {


    //     setTimeout(() => {
            
    //         burger.setValues("Jeremy 456", true);

    //         burger.save().then((result) => {
 


    //         }).catch((err) => {

                
    //             console.log("  --------------failed");
    //         });

    //     }, 10000);

    // }).catch((err) => {
    //     console.log("  --------------failed");
    // });

    app.listen(port, () => {

        terminal.white("  Webserver listening on port ► ").brightGreen(port + "\n\n");
    });  
    
});