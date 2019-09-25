"use strict";

const configConnectionDetails = require("../config/configConnectionDetails.js");


class MySQLConnectionDetails {

    constructor(connectToDB) {

        this.host = configConnectionDetails.host;
        this.port = configConnectionDetails.port;
        this.user = configConnectionDetails.user;
        this.password = configConnectionDetails.password;
        this.multipleStatements = configConnectionDetails.multipleStatments;

        if (typeof connectToDB === "boolean" && connectToDB === true) {

            this.database = configConnectionDetails.database; 
        }
        else {

            //if (connectToDB === false), it just connects to MySQL without specifying the database to connect to
            //this allows the ability to create and seed the database
            return;
        }
    }
}


module.exports = MySQLConnectionDetails;