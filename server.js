const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
const app = express();

// Require our routes
const routes = require("./routes");

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// serve static files from the public folder
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// declare routing middleware
app.use(routes);

// If deployed, use the deployed database, or use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Listen on the selected port
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
