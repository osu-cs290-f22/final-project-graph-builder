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

const allSpecs = JSON.parse(fs.readFileSync("availableSpecs.json"));
const allInputs = JSON.parse(fs.readFileSync("allInputs.json"));

/***************
 * HTTP REQUESTS
 * Some of these are commented out.
 **************/
 
/*app.get('/', function(req, res, next) {res.status(200).sendFile(__dirname + "/public/initialGraph.html")})*/

/*app.get('/', function(req, res, next) {res.status(200).render("index")});*/

function renderMaker(script, type, inputArr, specArr) {
    function middleware(req, res, next) {
        res.status(200).render("graphMaker", {
            script: script,
            type: type,
            inputs: inputArr,
            specs: specArr
        }
        )
    }
    return middleware;
}

//get the home page

app.get('/', function(req, res, next) {res.status(200).sendFile("/public/index.html")});

//test function, edit later
app.get('/line', renderMaker("lineChart.js", "Line Graph", allInputs, allSpecs));


app.post('/', function(req, res, next) {
    //we will be using JSON
});




app.listen(3000, function () {
    console.log("Listening on port 3000")
})
