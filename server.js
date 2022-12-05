//External libraries for serverside
const express = require('express');
const path = require('path');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const fs = require('fs');
const uuid = require("uuid")


//External client side libraries (not needed, but have)
const Chart = require('chart');
const html2canvas = require('html2canvas');

//Json graph array
var graphs = require("./graphs.json")

//Choices for different data
var graphChoices = JSON.parse(fs.readFileSync("graphChoices.json"));

//Set up express
const app = express();

//Define the "tempData" and if to send it (this is for making additional graphs based off of old ones)
var tempData
var sendTempData = false

/*******************
 * Setting up Handlebars Engine, and using express to display the files and images 
 **********************/

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.static("images"))
app.use(express.json())


/*******************
 * Set up the json files, and the arrays for the required specifications and inputs for certain types of graphs
 *******************/

//const pbSpecs = JSON.parse(fs.readFileSync("pieBarSpecs.json"));
//const lineSpecs = JSON.parse(fs.readFileSync("lineSpecs.json"));
//Specification Data
const allSpecs = JSON.parse(fs.readFileSync("specs.json"))
const allInputs = JSON.parse(fs.readFileSync("inputs.json"));

const barInputs = [allInputs[1], allInputs[4]]
const pieBarSpecs = [allSpecs[0], allSpecs[3], allSpecs[4], allSpecs[5]]

const lineInputs = [allInputs[0], allInputs[1], allInputs[2], allInputs[3], allInputs[4]]
const scatterSpecs = [allSpecs[1], allSpecs[2]]
const lineChartSpecs = [allSpecs[0], allSpecs[2]]


/***************
 * HTTP Browser Requests
 **************/
 

//Renders each page for the graphing app
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
        titleText: "View Other User's Graphs",
        posts: graphs
    })
}


//Home Page
app.get('/', function(req, res, next) {
    res.status(200).render("initial", {graphChoices})
})

//Bar Graph
app.get('/bar', renderMaker("Bar Graph Creator", barInputs, pieBarSpecs));

//Line Graph
app.get('/line', renderMaker("Line Chart Creator", lineInputs, lineChartSpecs));

//Pie Chart
app.get('/pie', renderMaker("Pie Chart Creator", [], pieBarSpecs));

//Scatter Plot
app.get('/scatter', renderMaker("Scatter Plot Creator", allInputs, scatterSpecs));

//The viewport function
app.get('/view', renderView)


//WILL PROBABLY DELETE
const colors = JSON.parse(fs.readFileSync("colors.json"))
app.get("/colors", function (req, res, next) {
    res.status(200).render("colorPage", colors)
})



/****************
 * Not HTTP Requests (get data and post requests)
 * **************/

//Stores the data associated with a certain post number to a temporary variable
app.get("/graphs/:number", function (req, res, next) {
    if (req.params.number < graphs.length && req.params.number > -1)
    {
        tempData = graphs[graphs.length - 1 - req.params.number]
        sendTempData = true
        res.status(200).send(tempData)
    }
    else
    {
        next()
    }    
})

//Sends the temporary variable to a client side page, in order to allow it to be edited
app.get("/pastData", function (req, res, next) {
    if (sendTempData)
    {
        sendTempData = false
        res.status(200).send(tempData)      
    }
    else
    {
        res.status(200).send(JSON.stringify({}))
    }
})

//Adds a post to the graphs.json file, with all the associated graph Data
app.post('/post', function (req, res, next) {

    var send = true

    for (var i = 0; i < graphs.length; i++)
    {
        if (graphs[i].title == req.body.title)
        {
            res.status(200).send("Invalid Title: This is the same title as another posts")
            send = false
        }
    }
    
    if (send) {
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
            url: req.body.url,
            id: graphs.length
        }
    
        graphs.unshift(graphData)
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
    }
})

//Creates and stores the image of the graph in the images folder 
app.post('/postImage', express.raw({type:"*/*"}), function(req, res, next) {
    
    //create a unique image name
    var imageName = uuid.v4()
    var imgAddress = imageName + ".png"
    var imgPath = "images/" + imgAddress
    fs.writeFileSync(imgPath, req.body)

    //send back the image address so I can access the image
    res.send(imgAddress);
});

//Adds a like to a certain post based on the URL
app.post("/addLike/:position", function (req, res, next) {
    graphs[graphs.length - 1 -req.params.position].likes = graphs[graphs.length - 1 - req.params.position].likes + req.body.likeIncrease
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

//404 browser get request, for the page not found error
app.get('*', function(req, res, next) {
    res.status(404).render("404", {titleText: "404 Error"})
});


app.listen(3000, function () {
    console.log("Listening on port 3000")
})
