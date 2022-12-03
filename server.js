//stuff we'll need of server stuff
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const fs = require('fs');

const uuid = require("uuid")

//stuff we'll need specifically for this applicaton
const Chart = require('chart');
const html2canvas = require('html2canvas');

var graphs = require("./graphs.json")

//app is how we'll use express
const app = express();


var tempData
var sendTempData = false

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

var graphs = JSON.parse(fs.readFileSync("graphs.json"));

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
        })
    }
    return middleware;
}

//Renders the posts page
function renderView(req, res, next) {
    var graphs = JSON.parse(fs.readFileSync("graphs.json"))
    res.status(200).render("graphView", {
        posts: graphs
    })
}

//get the home page

app.get('/', function(req, res, next) {res.status(200).sendFile("/public/index.html")});

//get the bar graph
app.get('/bar', renderMaker("Bar Graph", barInputs, pbSpecs));

//get the line graph
app.get('/line', renderMaker("Line Graph", lineInputs, lineChartSpecs));

//get the pie chart
app.get('/pie', renderMaker("Pie Chart", [], pbSpecs));

//get the scatter plot
app.get('/scatter', renderMaker("Scatter Plot", allInputs, scatterSpecs));

//get the view
//I will absolutely want to replace it with a post function once I get that to work
app.get('/view', renderView)

app.get("/graphs/:number", function (req, res, next) {
    if (req.params.number < graphs.length && req.params.number > -1)
    {
        tempData = graphs[req.params.number]
        sendTempData = true
        res.status(200).send(tempData)
    }
    else
    {
        next()
    }    
})

app.get("/pastData", function (req, res, next) {
    if (sendTempData)
    {
        sendTempData = false
        res.status(200).send(tempData)      
    }    
})

app.post('/post', function (req, res, next) {

    var graphData = {
        likes: req.body.likes,  
        graph: req.body.graph,
        title: req.body.title,
        userName: req.body.userName,
        date: req.body.date,
        data: req.body.data,
        colors: req.body.colors,
        opacities: req.body.opacities,
        addedSymbol: req.body.addedSymbol,
        line: req.body.line,
        xLabel: req.body.xLabel,
        yLabel: req.body.yLabel,
        labels: req.body.labels,
        xData: req.body.xData,
        url: req.body.url
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


app.post("/addLike/:position", function (req, res, next) {
    graphs[req.params.position].likes = graphs[req.params.position].likes + req.body.likeIncrease
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

//app.get('*', function(req, res, next) {res.status(404).sendFile("public/404.html")});


app.listen(3000, function () {
    console.log("Listening on port 3000")
})
