# Burger

This is a webserver application that hosts a client web page that provides a simulated experience for ordering a burger!

### Deployed website:

https://jbpkp07-burger.herokuapp.com


### Run it locally:

You can clone this repository via command line (if you have Git installed) by typing:  

`git clone https://github.com/jbpkp07/Burger`

If you already have Node.js installed, open your terminal, and browse to where you have cloned this Git repository and type:  

`node server.js` or if you have nodemon installed, `nodemon server.js`

If there are Node module dependencies that you are missing, please type `npm install` and it will reference the package.json file in this repository to automatically resolve those missing dependencies.

The main entry point for the server application is `server.js`, and the other auxillary files are used to provide Node modules that the application depends on.

To view the client hosted webpage, browse to http://localhost:3000 for the locally hosted page.


**Technologies used:**  Node.js, Javascript, NPM, npm terminal-kit, npm express, npm express-handlebars, MySQL, HTML, CSS, jQuery

There is also strict validation for newly created burgers (user-supplied), with appropriate error messages if the input is invalid.

I am the sole developer of this application.


### Screenshots:

#### Locally running webserver:

![1](https://github.com/jbpkp07/Burger/blob/master/public/assets/images/server.png)

#### Hosted website:

![2](https://github.com/jbpkp07/Burger/blob/master/public/assets/images/burgers.png)
