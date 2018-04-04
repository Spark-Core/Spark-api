var request = require("request-promise");
require("request")
var express = require("express");
var app = express(exports);
var time = 0;
app.listen(3040)

app.use((req, res, next) => {
    // To make sure browsers don't block content.
    res.set("Access-Control-Allow-Origin", '*')
    next()
})

// Load stats path
require("./stats.js")(app)

// Load versions path
require("./versions.js")(app)


app.get("*", (req, res) => {
    res.sendStatus(404)
})