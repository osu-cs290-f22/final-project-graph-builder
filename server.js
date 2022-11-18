const express = require('express')
const path = require('path')
const Chart = require('chart')
const html2canvas = require('html2canvas')

const app = express();

app.get('/', function(req, res, next) {
    res.status(200).sendFile(__dirname + "/public/initialGraph.html")
})

app.get('/initialGraphStyles.css', function(req, res) {
    res.status(200).sendFile(__dirname + "/public/initialGraphStyles.css")
})

app.get('/initialGraph.js', function(req, res) {
    res.status(200).sendFile(__dirname + "/public/initialGraph.js")
})




app.listen(3000, function () {
    console.log("Listening on port 3000")
})
