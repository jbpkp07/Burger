"use strict";
/* global require, __dirname, module */

const terminal = require('terminal-kit').terminal;
const express = require('express');


class Controller {

    constructor(burgersDatabase) {

        this.burgersDatabase = burgersDatabase;

        this.router = express.Router();

        this.assignRouteListeners();
    }

    assignRouteListeners() {

        this.getHomePage();

        this.getAPIFriends();

        this.postAPIFriends();
    }

    getHomePage() {  //Single page web app, this is the only page needed!

        this.router.get("/", (request, response) => {

            this.burgersDatabase.getAllBurgers().then(([rows, fields]) => {
                
                response.json(rows);

            }).catch((error) => {
                
                response.status(500).send(error);
            });
        });
    }






    
    getAPIFriends() {

        this.router.get("/api/friends", (request, response) => {

            this.friendsDatabase.getAllFriendsJSON().then((jsonData) => {
               
                response.json(jsonData); 
            });
        });
    }

    postAPIFriends() {

        this.router.post("/api/friends", (request, response) => {

            const { name }   = request.body;
            const { photo }  = request.body;
            const { scores } = request.body;

            this.validatePhotoURL(photo).then(() => {
                
                this.friendsDatabase.addFriend(name, photo, scores).then((newFriend) => {
               
                    this.friendsDatabase.getFriendMatch(newFriend).then((bestFriendMatch) => {
                        
                        response.json(bestFriendMatch);
    
                    });
                }).catch((error) => {
                   
                    terminal.red(`  ${error.message}`).gray(`${error.reason}\n\n`);
     
                    response.status(422).send(error);  //Unprocessable Entity (bad request data)                      
                });

            }).catch((error) => {
                
                terminal.red(`  ${error.message}`).gray(`${error.reason}\n\n`);

                response.status(422).send(error);  //Unprocessable Entity (bad request data) 
            });
        });
    }
}


module.exports = Controller;