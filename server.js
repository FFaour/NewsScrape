const express = require('express');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const PORT = process.env.PORT || 3000;

// instantiate express
var app = express();

// setup the express router
var router = express.Router();

// Require the routes file and pass the Router object
require("/config/routes")(router);

// point to the public dir for static files served
app.use(express.static(__dirname + 'public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect Handlebars to our Express app
app.engine("handlebars", expressHandlebars({
  defualtlayout: "main"
}));
app.set("view engine", "handlebars");

// use the router as middleware
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// connect to the database using mongoose and log any connection error
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(error) {
  if (error) {
    console.log("Mongoose connection error!");
  } else {
    console.log("Mongoose connected to " + MONGODB_URI + "!");
  }
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

