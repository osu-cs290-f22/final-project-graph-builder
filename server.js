//stuff we'll need of server stuff
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const fs = require('fs');
const { json } = require('express');

//stuff we'll need speficially for this applicaton
const Chart = require('chart');
const html2canvas = require('html2canvas');


//app is how we'll use express
const app = express();


/*******************
 * SETTING UP HANDLEBARS
 **********************/

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

/*******************
 * SETTING UP ARRAYS
 *******************/

var allSpecs = JSON.parse(fs.readFileSync("availableSpecs.json"));
var allInputs = JSON.parse(fs.readFileSync("allInputs.json"));

/***************
 * HTTP REQUESTS
 * Some of these are commented out.
 **************/
 
/*app.get('/', function(req, res, next) {res.status(200).sendFile(__dirname + "/public/initialGraph.html")})*/

/*app.get('/', function(req, res, next) {res.status(200).render("index")});*/



//get the home page

app.get('/', function(req, res, next) {res.status(200).sendFile("/public/index.html")});

//test function, delete later
app.get('/line', function(req, res, next) {
    res.status(200).render("lineGr", {script: "lineChart.js", 
                                        type: "Line Graph",
                                        inputs: allInputs})
});


app.post('/', function(req, res, next) {
    //we will be using JSON
});




app.listen(3000, function () {
    console.log("Listening on port 3000")
})
