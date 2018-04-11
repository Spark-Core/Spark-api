var request = require("request-promise");
require("request")
var express = require("express");
var app = express(exports);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var time = 0;
app.listen(3040)

app.use((req, res, next) => {
    // To make sure browsers don't block content.
    res.set("Access-Control-Allow-Origin", '*')
    res.set("content-type", "application/json")
    next()
})

// Load stats path
require("./stats.js")(app)

// Load versions path
require("./versions.js")(app)

// Set travis webhooks up.
app.post("/travis", (require("./travis.js")))


app.get("*", (req, res) => {
    res.sendStatus(404)
})