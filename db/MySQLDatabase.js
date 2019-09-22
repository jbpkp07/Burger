"use strict";
/* global require, module, process */

const configPaths = require('../config/configPaths.js');
const InquirerPrompts = require(configPaths.inquirerPromptsPath);
const MySQLConnectionDetails = require(configPaths.mySQLConnectionDetailsPath);
const terminal = require("terminal-kit").terminal;
const mysql2 = require('mysql2/promise');
const fs = require('fs');


class MySQLDatabase {

    constructor(forceDBSeedingIfMissing) {

        this.forceDBSeedingIfMissing = forceDBSeedingIfMissing;

        this.connectionDetails = null;
        this.PRIVATE_setConnectionDetails(true); 

        this.database = null;
        this.PRIVATE_setDatabaseName();  //set only one time

        this.isConnected = false;
        this.connectionID = null;
        this.connection = null;

        this.connectLock = false;
        this.disconnectLock = false;
    }

    connect() {

        if (this.connectLock) {

            const comment = `  Locked:  Already connecting to database [${this.database}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (this.isConnected) {

            const comment = `  Already connected to database [${this.database}] using connection id [${this.connectionID}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        this.connectLock = true;

        return new Promise((resolve) => {
           
            const promise = mysql2.createConnection(this.connectionDetails);

            promise.then((newConnection) => {
    
                this.connectionID = newConnection.connection._handshakePacket.connectionId;
                this.connection = newConnection;
                this.isConnected = true;
                this.connectLock = false;
    
                terminal.gray(`  Connected to database [`).white(`${this.connection.config.database}`).gray(`] using connection id [`).white(`${this.connectionID}`).gray(`]\n\n`);
    
                resolve();

            }).catch((error) => {
    
                process.once("seedingComplete", () => {
                   
                    resolve();
                });

                this.PRIVATE_seedDatabaseOrExit(error);
            });

        });
    }

    disconnect() {

        if (this.disconnectLock) {

            const comment = `  Locked:  Already disconnecting from database [${this.database}]\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        if (!this.isConnected) {

            const comment = `  No existing connection to database [${this.database}] to disconnect\n\n`;
            terminal.red(comment);
            return Promise.reject(comment);
        }

        this.disconnectLock = true;

        const promise = this.connection.end();

        promise.then(() => {

            terminal.gray(`  Disconnected from database [`).white(`${this.connection.config.database}`).gray(`] dropping connection id [`).white(`${this.connectionID}`).gray(`]\n\n`);

            this.connectionID = null;
            this.connection = null;
            this.isConnected = false;
            this.disconnectLock = false;
        });

        return promise;
    }

    queryDatabase(query, placeholderArray) {

        const promise = this.connection.query(query, placeholderArray);

        return promise;
    }

    PRIVATE_setConnectionDetails(connectToDB) {  //might be set several times for database seeding

        if (process.env.JAWSDB_URL) {

            this.connectionDetails = process.env.JAWSDB_URL;
        }
        else {

            this.connectionDetails = new MySQLConnectionDetails(connectToDB);
        }
    }

    PRIVATE_setDatabaseName() {  //set only one time

        if (process.env.JAWSDB_URL) {

            this.database = "JAWSDB";
        }
        else {

            this.database = this.connectionDetails.database;
        }
    }

    PRIVATE_seedDatabaseOrExit(error) {

        let isDatabaseMissing;

        if (process.env.JAWSDB_URL) {

            isDatabaseMissing = (error.errno === 1146 && error.sqlState === '42S02');
        }
        else {

            isDatabaseMissing = (error.errno === 1049 && error.sqlState === '42000');
        }

        if (isDatabaseMissing) {

            terminal.red(`  Missing [`).white(`${this.database}`).red(`] database...\n\n`);

            if (this.forceDBSeedingIfMissing) {

                this.PRIVATE_seedDatabase();
            }
            else {

                const promise = this.PRIVATE_promptToSeedDatabase();

                promise.then((answer) => {
    
                    setTimeout(() => {
                        
                        if (answer.seedDB) {
    
                            this.PRIVATE_seedDatabase();
                        }
                        else {
             
                            this.PRIVATE_exit();
                        }
    
                    }, 500);
                });
            }
        }
        else {

            this.PRIVATE_exitAfterFailedConnection(error);
        }
    }

    PRIVATE_promptToSeedDatabase() {

        this.inquirerPrompts = new InquirerPrompts();

        const promptMSG = `Would you like to seed the [${this.database}] database?`;

        const name = "seedDB";

        const defaultChoice = false;

        const promise = this.inquirerPrompts.confirmPrompt(promptMSG, name, defaultChoice);

        return promise;
    }

    PRIVATE_seedDatabase() {

        this.PRIVATE_setConnectionDetails(false);  //no database assigned, just connect to MySQL without specifying a database

        this.connectLock = false;

        this.connect().then(() => {

            const sqlSchemaSeeds = fs.readFileSync(configPaths.sqlSchemaPath).toString() + "\n\n" + fs.readFileSync(configPaths.sqlSeedsPath).toString();

            terminal.gray(`  Seeding [`).white(`${this.database}`).gray(`] database...\n\n\n`);

            terminal.brightCyan(sqlSchemaSeeds + "\n\n\n");

            this.queryDatabase(sqlSchemaSeeds, []).then(() => {
                
                terminal.gray(`  Seeding [`).white(`${this.database}`).gray(`] database finished.\n\n`);

                this.PRIVATE_setConnectionDetails(true);  //Connect to newly created database

                this.disconnect().then(() => {
                   
                    this.connect().then(() => {
                    
                        process.emit("seedingComplete");
    
                    }).catch((error) => {
                        
                        this.PRIVATE_exitAfterFailedConnection(error);
                    });
                });

            }).catch((error) => {
                
                terminal.red(`  Seeding [`).white(`${this.database}`).red(`] ${error}\n\n`);

                this.PRIVATE_exit();
            });

        }).catch((error) => {

            this.PRIVATE_exitAfterFailedConnection(error);
        });
    }

    PRIVATE_exitAfterFailedConnection(error) {

        terminal.red(`  Unable to connect to database [`).white(`${this.database}`).red(`]\n\n`);
        terminal.red(`  ${error}\n\n`);

        this.PRIVATE_exit();
    }

    PRIVATE_exit() {

        terminal.hideCursor("");  //with ("") it shows the cursor
        process.exit(0);
    }
}


module.exports = MySQLDatabase;