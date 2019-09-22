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

    //Simple/Pruned object for database transactions
    getSimpleObject(complexObject, idColumnName, dataColumnNames) {

        if (!complexObject) {

            complexObject = this;
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!dataColumnNames) {

            dataColumnNames = this.dataColumnNames;
        }

        if (!complexObject || !idColumnName || !dataColumnNames) {

            throw new Error("ORM.getSimpleObject() mssing parameters.");
        }

        const object = {};

        if (complexObject[idColumnName] !== null) {

            object[idColumnName] = complexObject[idColumnName];
        }

        for (const dataColumnName of dataColumnNames) {

            if (dataColumnName !== idColumnName) {

                object[dataColumnName] = complexObject[dataColumnName];
            }
        }

        return object;
    }

    //Generic Query------------------------------------------------------------
    queryDatabase(query, placeholderArray) {

        if (!query || !placeholderArray) {

            return Promise.reject("ORM.queryDatabase() missing parameters.");
        }

        const promise = this.mysqlDatabase.queryDatabase(query, placeholderArray);

        return promise;
    }

    //Create Query-------------------------------------------------------------
    insertOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getSimpleObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        if (!object || !idColumnName || !tableName) {

            return Promise.reject("ORM.insertOne() missing parameters.");
        }

        if (object[idColumnName]) {

            return Promise.reject("ORM.insertOne() id column provided, rejected to protect database AUTO_INCREMENT integrity.");
        }

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

        if (!id || !idColumnName || !tableName) {

            return Promise.reject("ORM.selectOneById() missing parameters.");
        }

        const query = `SELECT * FROM ?? WHERE ?? = ? ;`;

        const promise = this.queryDatabase(query, [tableName, idColumnName, id]);

        return promise;
    }

    selectAll(tableName) {

        if (!tableName) {

            tableName = this.tableName;
        }

        if (!tableName) {

            return Promise.reject("ORM.selectAll() missing parameters.");
        }

        const query = `SELECT * FROM ?? ;`;

        const promise = this.queryDatabase(query, [tableName]);

        return promise;
    }

    //Update Query-------------------------------------------------------------
    updateOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getSimpleObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        const id = object[idColumnName];

        if (!object || !idColumnName || !tableName || !id) {

            return Promise.reject("ORM.updateOne() missing parameters.");
        }

        const query = `UPDATE ?? SET ? WHERE ?? = ?`;

        const promise = this.queryDatabase(query, [tableName, object, idColumnName, id]);

        return promise;
    }

    //Delete Query-------------------------------------------------------------
    deleteOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getSimpleObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        const id = object[idColumnName];

        if (!object || !idColumnName || !tableName || !id) {

            return Promise.reject("ORM.deleteOne() missing parameters.");
        }

        const query = `DELETE FROM ?? WHERE ?? = ?`;

        const promise = this.queryDatabase(query, [tableName, idColumnName, id]);

        return promise;
    }

    //High-level Methods-------------------------------------------------------
    saveOne(object, idColumnName, tableName) {

        if (!object) {

            object = this.getSimpleObject();
        }

        if (!idColumnName) {

            idColumnName = this.idColumnName;
        }

        if (!tableName) {

            tableName = this.tableName;
        }

        if (!object || !idColumnName || !tableName) {

            return Promise.reject("ORM.saveOne() missing parameters.");
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