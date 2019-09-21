"use strict";
/* global module, require */

const terminal = require("terminal-kit").terminal;


class ORM {

    constructor(mysqlDatabase, tableName, idColumnName, dataColumnNames) {

        this.mysqlDatabase = mysqlDatabase;
        this.tableName = tableName;
        this.idColumnName = idColumnName;
        this.dataColumnNames = dataColumnNames;

        this.isSaved = false;
    }

    getObject() {

        const object = {};

        if (this[this.idColumnName] !== null) {

            object[this.idColumnName] = this[this.idColumnName];
        }

        for (const dataColumnName of this.dataColumnNames) {

            if (dataColumnName !== this.idColumnName) {

                object[dataColumnName] = this[dataColumnName];
            }
        }
        console.log(object);
        return object;
    }

    //Generic Query------------------------------------------------------------
    queryDatabase(query, placeholderArray) {

        const promise = this.mysqlDatabase.queryDatabase(query, placeholderArray);

        return promise;
    }

    //Create Query-------------------------------------------------------------
    insertOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;

            if (!idColumnName) {

                return Promise.reject("idColumnName not specified.");
            }
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        delete object[idColumnName];  //if it has the PK id specified, remove it to preserve AUTO_INCREMENT integrity

        const query = `INSERT INTO ?? SET ? ;`;

        const promise = this.queryDatabase(query, [tableName, object]);

        return promise;
    }

    //Read Queries-------------------------------------------------------------
    selectOneById(id, idColumnName, tableName) {

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        const query = `SELECT * FROM ?? WHERE ?? = ? ;`;

        const promise = this.queryDatabase(query, [tableName, idColumnName, id]);

        return promise;
    }

    selectAll(tableName) {

        if (!tableName) {

            tableName = this.tableName;
        }

        const query = `SELECT * FROM ?? ;`;

        const promise = this.queryDatabase(query, [tableName]);

        return promise;
    }

    //Update Query-------------------------------------------------------------
    updateOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        const id = object[idColumnName];

        const query = `UPDATE ?? SET ? WHERE ?? = ?`;

        const promise = this.queryDatabase(query, [tableName, object, idColumnName, id]);

        return promise;
    }

    //Delete Query-------------------------------------------------------------
    deleteOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        const id = object[idColumnName];

        const query = `DELETE FROM ?? WHERE ?? = ?`;

        const promise = this.queryDatabase(query, [tableName, idColumnName, id]);

        return promise;
    }

    //High-level Methods-------------------------------------------------------
    saveOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        return new Promise((resolve, reject) => {
            
            let promise;

            if (!this.isSaved) {
    
                promise = this.insertOne(object, idColumnName, tableName);  //Not yet saved, so insert record
            }
            else {

                promise = this.updateOne(object, idColumnName, tableName);  //Already saved, so update record
            }

            promise.then(([results]) => {
                
                if (!this.isSaved) {
     
                    if (results.affectedRows === 1) {
     
                        this.isSaved = true;

                        this[this.idColumnName] = results.insertId;

                        resolve(results); 
                        return;
                    }
                }
                else {

                    if (results.changedRows === 1) {

                        resolve(results);
                        return;
                    }
                }

                reject("  Error:  ORM.saveOne() No changes made in database. Already up-to-date.");

            }).catch((error) => {
                
                terminal.red(`  ORM.save() error:\n\n`).white(`${error}\n\n`);

                reject();
            });
        });
    }
}


module.exports = ORM;