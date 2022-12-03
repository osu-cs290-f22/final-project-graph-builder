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




app.post('/post', function (req, res, next) {

    var graphData = {
        likes: req.body.likes,  
        graph: req.body.graph,
        title: req.body.title,
        userName: req.body.userName,
        date: req.body.date,
        data: req.body.data,
        colors: req.body.colors,
        line: req.body.line,
        xLabel: req.body.xLabel,
        yLabel: req.body.yLabel,
        labels: req.body.labels,
        xData: req.body.xData
    }
  
    graphs.push(graphData)
    fs.writeFile(
        "./graphs.json", 
        JSON.stringify(graphs, null, 2), 
        function (err) {
        if (err) {
            res.status(500).send("Error writing data")
        }
        else {
            res.status(200).send("Graph Data Written")
        }
        })
})

//get the post image
app.post('/postimg', express.raw({type:"*/*"}), function(req, res, next) {
    
    //create a unique image name
    var imageName = uuid.v4()
    var imgAddress = imageName + ".png"
    var imgPath = "images/" + imgAddress
    fs.writeFileSync(imgPath, req.body)

    //send back the image address so I can access the image
    res.send(imgAddress);
});


app.listen(3000, function () {
    console.log("Listening on port 3000")
})