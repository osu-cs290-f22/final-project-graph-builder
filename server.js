//stuff we'll need of server stuff
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const fs = require('fs');

const uuid = require("uuid")

//stuff we'll need speficially for this applicaton
const Chart = require('chart');
const html2canvas = require('html2canvas');

var graphs = require("./graphs.json")
console.log(graphs)

//app is how we'll use express
const app = express();


/*******************
 * SETTING UP HANDLEBARS
 **********************/

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.static("images"))
app.use(express.json())

app.use(express.static('public'));

/*******************
 * SETTING UP ARRAYS
 *******************/

const pbSpecs = JSON.parse(fs.readFileSync("pieBarSpecs.json"));
const lineSpecs = JSON.parse(fs.readFileSync("lineSpecs.json"));
const allInputs = JSON.parse(fs.readFileSync("allInputs.json"));

const barInputs = [allInputs[1], allInputs[4]]
const lineInputs = [allInputs[0], allInputs[1], allInputs[2], allInputs[3], allInputs[4]]
const scatterSpecs = [lineSpecs[1], lineSpecs[2]]
const lineChartSpecs = [lineSpecs[0], lineSpecs[2]]

/***************
 * HTTP REQUESTS
 * Some of these are commented out.
 **************/
 
/*app.get('/', function(req, res, next) {res.status(200).sendFile(__dirname + "/public/initialGraph.html")})*/

/*app.get('/', function(req, res, next) {res.status(200).render("index")});*/

function renderMaker(type, inputArr, specArr) {
    function middleware(req, res, next) {
        res.status(200).render("graphMaker", {
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

//get the bar graph
app.get('/bar', renderMaker("Bar Graph", barInputs, pbSpecs));

//get the line graph
app.get('/line', renderMaker("Line Graph", lineInputs, lineChartSpecs));

//get the pie chart
app.get('/pie', renderMaker("pieChart.js", "Line Graph", [], pbSpecs));

//get the scatter plot
app.get('/scatter', renderMaker("Scatter Plot", allInputs, scatterSpecs));

//get the view
//I will absolutely want to replace it with a post function once I get that to work
app.get('/view', function(req, res, next) {res.status(200).render("graphView", {posts: graphs})})




app.post('/postig', function(req, res, next) {
    console.log("got post", req.body.url)
    fs.writeFileSync("graphs.json", req.body)
});


//get the actual post json and put it in the graphs array
app.post('/postgr', function(req, res, next) {
    var graphs = JSON.parse(fs.readFileSync("graphs.json"));
    graphs.push(req.body);
    fs.writeFileSync("graphs.json", JSON.stringify(graphs))
})

//app.get('*', function(req, res, next) {res.status(404).sendFile("public/404.html")});


app.listen(3000, function () {
    console.log("Listening on port 3000")
})
