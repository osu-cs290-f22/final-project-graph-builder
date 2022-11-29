//stuff we'll need of server stuff
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const fs = require('fs');

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

/***************
 * HTTP REQUESTS
 * Some of these are commented out.
 **************/
 
/*app.get('/', function(req, res, next) {res.status(200).sendFile(__dirname + "/public/initialGraph.html")})*/

/*app.get('/', function(req, res, next) {res.status(200).render("index")});*/



//get the home page

app.get('/', function(req, res, next) {res.status(200).sendFile("/public/index.html")});


app.post('/', function(req, res, next) {
    //we will be using JSON
});




app.listen(3000, function () {
    console.log("Listening on port 3000")
})
