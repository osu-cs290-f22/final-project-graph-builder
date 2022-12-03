// ------------------ Initialization

function getType() {
    var url = window.location.pathname
    var urlParts = url.split('/')
    var decider = urlParts[1]
    if (decider == "scatter")
    {
        return [decider, finalizeScatterData]
    }
    else if (decider == "line")
    {
        return [decider, finalizeLineData]
    }
    else if (decider == "pie" || decider == "bar")
    {
        return [decider, finalizeSectionData]
    }
    else 
    {
        console.log("Not a valid type (404 Error)")
    }
}

var type = getType()[0]
var chartData = getType()[1]

var allColors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "gray"]
var colorRGB = ["255,0,0", "255,128,0", "255,255,0", "0,204,0", "0,0,255", "204,0,204", "0,0,0", "128,128,128"] 

//If true, animate the graph, if false, do not animate the graph
var animationSwitch = true

//Creates the graph the instant the website is opened, but it is empty
createGraph()

//Makes the entire document listen for changes, as there can be an infinite number of coordinates, so this is needed to not overwhelm the cite
var changeListener = document.body.addEventListener("change", resetGraph)
var clickListener = document.body.addEventListener("click", deleteLayer)

//The button to create a new row of data
var addButton = document.getElementById("submit-button")
addButton.addEventListener("click", chartData)

// ----------------- Functions

//Determines if an item is in an array (Python if ____ in _____)
function inList(value, array)
{
    for (var i = 0; i < array.length; i++)
    {
        if (value === array[i])
        {
            return true
        }
    }

    return false
}

function deleteLayer(event)
{
    
    if (event.target.id == "delete-button")
    {
        var allGraphData = document.getElementById("graph-specs")
        allGraphData.removeChild(event.target.parentNode)
        resetGraph(event)
    }
    else if (event.target.parentNode.id == "delete-button")
    {
        var allGraphData = document.getElementById("graph-specs")
        allGraphData.removeChild(event.target.parentNode.parentNode)
        resetGraph(event)
    }
}

//Resets the graph (animates it based on the input), by deleting and recreating it
function resetGraph(event)
{
    if (event.currentTarget.id == "submit-button" || event.target.id == "delete-button" || inList("x-value-boxes", event.target.classList) || inList("y-value-boxes", event.target.classList)
    || inList("section-name", event.target.classList) || inList("section-color", event.target.classList) || inList("section-value", event.target.classList)
    || inList("section-opacity", event.target.classList))
    {
        animationSwitch = true
    }
    
    else
    {
        animationSwitch = false
    }
    deleteGraph()
    createGraph()
}

//Determines if the graph should draw a line
function determineLine()
{
    var lineCheck = document.getElementById("line-checkbox")
    return lineCheck.checked
}

function createLabels () {
    var labelValues = document.getElementsByClassName("section-name")
    var labelArray = []

    for (var i = 0; i < labelValues.length; i++)
    {
        labelArray.push(labelValues[i].value)
    }

    return labelArray
}


//Saves all of the data in the row, and creates a new data row to process
function finalizeScatterData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementById("x-value-boxes").value != "" && document.getElementById("y-value-boxes").value != "")
    {
        var valuesContainer = document.getElementById("initial-input-container")
        
        valuesContainer.insertAdjacentHTML("beforebegin", "<div class = \"input-container\"></div>")
        var newContainers = document.getElementsByClassName("input-container")
        var thisContainer = newContainers[newContainers.length - 1]
        var types = ["number", "number"]

        var graphInputData = Handlebars.templates.graphInputs
        
        for (var i = 0; i < document.getElementsByClassName("input-graph-labels").length; i++)
        {
            var completeContainer = graphInputData({
            label: document.getElementsByClassName("input-graph-labels")[i].textContent,
            inputType: types[i],
            valueBoxesTypes: document.getElementsByClassName("graph-input-boxes")[i].id,
            inputValue: document.getElementsByClassName("graph-input-boxes")[i].value
            })
            thisContainer.insertAdjacentHTML("beforeend", completeContainer)
            document.getElementsByClassName("graph-input-boxes")[i].value = ""
        }

        var deleteButtonCreator = Handlebars.templates.deleteButton()
        thisContainer.insertAdjacentHTML("beforeend", deleteButtonCreator)
        
        resetGraph(event)
    }
}

function finalizeSectionData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementById("section-name").value != "" && document.getElementById("section-color").value != "" 
    && document.getElementById("section-value").value != "" && document.getElementById("section-opacity").value != "")
    {
        var valuesContainer = document.getElementById("initial-input-container")
        valuesContainer.insertAdjacentHTML("beforebegin", "<div class = \"input-container\"></div>")
        var newContainers = document.getElementsByClassName("input-container")
        var thisContainer = newContainers[newContainers.length - 1]
        var types = ["text", "text", "number", "range"]

        var graphInputData = Handlebars.templates.graphInputs
        
        for (var i = 0; i < document.getElementsByClassName("input-graph-labels").length; i++)
        {
            var completeContainer = graphInputData({
            label: document.getElementsByClassName("input-graph-labels")[i].textContent,
            inputType: types[i],
            valueBoxesTypes: document.getElementsByClassName("graph-input-boxes")[i].id,
            inputValue: document.getElementsByClassName("graph-input-boxes")[i].value
            })
            thisContainer.insertAdjacentHTML("beforeend", completeContainer)
            document.getElementsByClassName("graph-input-boxes")[i].value = ""
        }

        resetGraph(event)
    }
}

function finalizeLineData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementById("section-name").value != "" && document.getElementById("y-value-boxes").value != "")
    {
        var valuesContainer = document.getElementById("initial-input-container")
        valuesContainer.insertAdjacentHTML("beforebegin", "<div class = \"input-container\"></div>")
        var newContainers = document.getElementsByClassName("input-container")
        var thisContainer = newContainers[newContainers.length - 1]
        var types = ["text", "text", "number"]

        var graphInputData = Handlebars.templates.graphInputs
        
        for (var i = 0; i < document.getElementsByClassName("input-graph-labels").length; i++)
        {
            var completeContainer = graphInputData({
            label: document.getElementsByClassName("input-graph-labels")[i].textContent,
            inputType: types[i],
            valueBoxesTypes: document.getElementsByClassName("graph-input-boxes")[i].id,
            inputValue: document.getElementsByClassName("graph-input-boxes")[i].value
            })
            thisContainer.insertAdjacentHTML("beforeend", completeContainer)
            document.getElementsByClassName("graph-input-boxes")[i].value = ""
        }

        resetGraph(event)
    }
}

//Accesses all of the x-values for the scatter plot
function accessXValues () {
    var dataValues = document.getElementsByClassName("x-value-boxes")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
}

//Accesses all of the y-values for the scatter plot
function accessYValues () {
    var dataValues = document.getElementsByClassName("y-value-boxes")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
}

function createData() {
    var yValues = accessYValues()
    var xValues = accessXValues()

    var data = []

    for (var i = 0; i < xValues.length; i++)
    {
        dataPiece = {
            x: xValues[i], 
            y: yValues[i]
        }

        data.push(dataPiece)
    }

    return data
}

function accessValues () {
    var dataValues = document.getElementsByClassName("section-value")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
}


function createColors () {
    var colorValues = document.getElementsByClassName("section-color")
    var opacityValues = document.getElementsByClassName("section-opacity")
    var colorArray = []
    var borderArray = []
    var colorsArray = []

    for (var i = 0; i < colorValues.length; i++)
    {
        var counter = 0
        for (var j = 0; j < allColors.length; j++)
        {
            if (colorValues[i].value.toLowerCase() == allColors[j])
            {
                colorArray.push("rgba(" + colorRGB[j] + ", " + parseInt(opacityValues[i].value)/100 + ")")
                borderArray.push("rgba(" + colorRGB[j] + ", 1)")
                var counter = 1                 
            }
           
        }
        if (counter != 1)
        {
            colorArray.push("rgba(0, 0, 0," + parseInt(opacityValues[i].value)/100 + ")")
            borderArray.push("rgba(0, 0, 0, 1)")            
        }
    }

    colorsArray = [colorArray, borderArray]
    return colorsArray
}

function createGraphColor () {
    var colorValue = document.getElementById("color").value
    var opacityValue = document.getElementById("opacity").value
    var color = ""

    for (var i = 0; i < allColors.length; i++)
    {
        if (colorValue.toLowerCase() == allColors[i] && opacityValue == "")
        {
            color = "rgba(" + colorRGB[i] + ", 1)"
        }
        else if (colorValue.toLowerCase() == allColors[i] && opacityValue != "")
        {
            color = "rgba(" + colorRGB[i] + ", " + opacityValue/100 + ")"
        }
    }
    if (color == "")
    {
        if (opacityValue != "")
        {
            color = "rgba(0, 0, 0," + opacityValue/100 + ")"
        }
        else
        {
            color = "rgba(0, 0, 0, 1)"
        }        
    }

    return color
}


//Only needed because the pieChart's animation option is broken as a result of Chart.js, so this is my best workaround
function pieOptions() {
    if (animationSwitch)
    {
        options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins:
            {
                title: {
                    display: true, 
                    text: document.getElementById("title").value
                },
                legend: {
                    display: false
                }
            }
        }
    }
    else
    {
        options = {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins:
            {
                title: {
                    display: true, 
                    text: document.getElementById("title").value
                },
                legend: {
                    display: false
                }
            }
        }
    }
    return options
}

//Deletes the graph, by removing it as a child
function deleteGraph () {
    document.getElementById("chart-container").removeChild(document.getElementById("myChart"))
}

function createGraph() {
    //Find the container of the chart, create the canvas element, and take the context of the canvas
    var chartContainer = document.getElementById("chart-container")
    var chart = document.createElement("canvas")
    chart.id = "myChart"
    chart.classList.add("chart")
    chartContainer.appendChild(chart)
    const ctx = document.getElementById('myChart');

    if (type == "scatter")
    {
        createScatterPlot(ctx)
    }
    else if (type === "line")
    {
        createLineGraph(ctx)
    }
    else if (type === "pie")
    {
        createPieChart(ctx)
    }
    else if (type === "bar")
    {
        createBarGraph(ctx)
    }
    else
    {
        alert("Invalid graph type!")
    }
}

function createScatterPlot (ctx) {

    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                data: createData(),
                backgroundColor: createGraphColor(),
                borderColor: createGraphColor(),
                fill: false, 
                tension: 0.1,
                showLine: determineLine()
            }]
        }, 
        options: {
            animation: animationSwitch,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: document.getElementById("xlabel").value
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: document.getElementById("ylabel").value
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, ticks)
                        {
                            return document.getElementById("added-symbol").value + value
                        }
                    }
                }
            },
            plugins:
            {
                title: {
                    display: true, 
                    text: document.getElementById("title").value
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function createBarGraph (ctx) {

    var colorsArray = createColors()
    var graphColors = colorsArray[0]
    var borderColors = colorsArray[1]

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: createLabels(),
            datasets: [{
                data: accessValues(),
                backgroundColor: graphColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            animation: animationSwitch,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: document.getElementById("ylabel").value
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, ticks)
                        {
                            return document.getElementById("added-symbol").value + value
                        }
                    }
                }
            },
            plugins:
            {
                title: {
                    display: true, 
                    text: document.getElementById("ylabel").value
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function createLineGraph (ctx) {
    
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: createLabels(),
            datasets: [{
                data: accessYValues(),
                backgroundColor: createGraphColor(),
                borderColor: createGraphColor()
            }]
        },
        options: {
            animation: animationSwitch,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: document.getElementById("ylabel").value
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, ticks)
                        {
                            return document.getElementById("added-symbol").value + value
                        }
                    }
                }, 
                x: {
                    title: {
                        display: true, 
                        text: document.getElementById("xlabel").value
                    }
                }
            },
            plugins:
            {
                title: {
                    display: true, 
                    text: document.getElementById("title").value
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function createPieChart (ctx) {

    var colorsArray = createColors()
    var graphColors = colorsArray[0]
    var borderColors = colorsArray[1]
    console.log(animationSwitch)

    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: createLabels(),
            datasets: [{
                data: accessValues(),
                backgroundColor: graphColors,
                borderColors: borderColors
            }]
        },
        options: pieOptions()
    });
}


function publish (event) {
    if (type == "scatter")
    {
        pushData(document.getElementById("title").value, accessYValues(), createGraphColor(), "", document.getElementById("xlabel").value, 
        document.getElementById("ylabel"), determineLine(), accessXValues())        
    }
    else if (type == "bar")
    {
        pushData(document.getElementById("title").value, accessValues(), createColors(), createLabels(), "", 
        document.getElementById("ylabel"), "", "")  
    }
    else if (type == "pie")
    {
        pushData(document.getElementById("title").value, accessValues(), createColors(), createLabels(), "", "", "", "")  
    }
    else if (type == "line")
    {
        pushData(document.getElementById("title").value, accessValues(), createGraphColor(), createLabels(), document.getElementById("xlabel").value, 
        document.getElementById("ylabel"), "", "")  
    }
    else
    {
        alert("Not a valid graph type!")
    }
}

var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", publish)

function pushData(title, data, colors, labels, xLabel, yLabel, line, dataX)
{
    var graphImage
    var graph = document.getElementById("myChart")
    var responseText
    var date = new Date
    var dateArray = date.toDateString().split(' ')
    var finalDate = dateArray[1] + " " + dateArray[2] + " " + dateArray[3]

    //This is the most important part
    var postTitle = title.trim();

    if (postTitle == "") {
        alert("Please give your graph a title.")
    }
    else
    {
        html2canvas(graph).then(function(canvas){
            graphImage = canvas
        
       
            graphImage.toBlob(function(blob) {
                    fetch('/postimg', {
                        method: 'POST',
                        body: blob,
                        headers: {"Content-Type": "image/png"}
                        
                    }).then( function (res) {
                        if (res.status === 200)
                        {
                            return res.text()
                        }
                        else
                        {
                            console.log("Failure to push to execute postImage")
                        }
                    }).then(function (text) {
                        fetch('/post', {
                            method: 'POST',
                            body: JSON.stringify({
                                likes: 0,
                                graph: text,
                                title: title,
                                userName: "Anonymous",
                                date: finalDate
                            }),
                            headers: {"Content-Type":"application/json"}
                        }).then(function(res) {
                            if (res.status === 200) {
                                alert("Got a 200 response code!")
                            }
                            else {
                                alert("Failed to get a 200 response code")
                            }
                        }).catch(function(err) {
                            alert("Error" + err)
                        })                         
                    })
                })
            })
    }
}