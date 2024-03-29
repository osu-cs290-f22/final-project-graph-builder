//Code comments for index.js 

// -------------- Add onto Graph Function -----------------
//The graph searches to see if there is data the server wants to give it
setUpDerivative()

function setUpDerivative() {
    fetch("/pastData", {
        method: "GET"
    }).catch(function (err) {
        alert("Unable to access graph data (url broken)")
    }).then(function(res) {
        if (res.status == 200)
        {
            return res.json()                
        }
        else
        {
            alert("Unable to send data")
        }
    }).then(function(json) {
        if (json)
        {
            formGraph(json)          
        }
    })

    //No error catch, as in most cases, this will fail, which it is designed to do, as this only works when loading old graph data in
}

//--------------- Initialization Functions and variables -----------
//This function determines what type of graph is being created based on url: scatter, line, pie, or bar 
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


//Save the type of function, and what type of data finalization happens (see the finalize data section)
var type = getType()[0]
var chartData = getType()[1]


//All colors laid out in the json

var colors = [
    {
        "color" : "red",
        "value" : "255, 0, 0"
    },
    {
        "color" : "orange",
        "value" : "255, 128, 0"
    },
    {
        "color" : "yellow",
        "value" : "255, 255, 0"
    },
    {
        "color" : "green",
        "value" : "0, 204, 0"
    },
    {
        "color" : "blue",
        "value" : "0, 0, 255"
    },
    {
        "color" : "purple",
        "value" : "204, 0, 204"
    },
    {
        "color" : "black",
        "value" : "0, 0, 0"
    },
    {
        "color" : "gray",
        "value" : "128, 128, 128"
    },
    {
        "color" : "grey",
        "value" : "128, 128, 128"
    },
    {
        "color" : "white",
        "value" : "255, 255, 255"
    },
    {
        "color" : "gold",
        "value" : "255, 215, 0"
    },
    {
        "color" : "aqua",
        "value" : "0, 255, 255"
    },
    {
        "color" : "brown",
        "value" : "165, 42, 42"
    },
    {
        "color" : "pink",
        "value" : "255, 192, 203"
    }
]

function createColorInfo (){
    var colorInfo = ""
    colors.forEach(function (colorText) {
        if (colors.indexOf(colorText) != colors.length - 1)
        {
            colorInfo = colorInfo + colorText.color + ", "            
        }
        else
        {
            colorInfo = colorInfo + colorText.color
        }
    })

    return colorInfo
}

function addColorInfo() {
    var informationButton = Handlebars.templates.infoButton
    var information = createColorInfo()

    if (document.getElementById("color"))
    {
        var colorTextBox = document.getElementById("color").parentNode
        var colorButton = informationButton({
            infoText: information
        })
        colorTextBox.insertAdjacentHTML("beforeend", colorButton)
    }
    else if (document.getElementById("section-color"))
    {
        var colorTextBox = document.getElementById("section-color").parentNode
        var colorButton = informationButton({
            infoText: information
        })
        colorTextBox.insertAdjacentHTML("beforeend", colorButton)
    }
}

//If true, animate the graph, if false, do not animate the graph
var animationSwitch = true

//Creates the graph the instant the website is opened, but it is empty
createGraph()
addColorInfo()

//Makes the entire document listen for changes, as there can be an infinite number of coordinates, so this is needed to not overwhelm the site
var changeListener = document.body.addEventListener("change", resetGraph)
var clickListener = document.body.addEventListener("click", decideLayer)

//The button to create a new row of data
var addButton = document.getElementById("submit-button")
addButton.addEventListener("click", chartData)

// ***********************
//------ Functions -------
// ***********************


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

//Moves a layer up or down in the DOM based on the arrow buttons clicked on it
function moveLayer(event) {
    var layerData = event.target.parentNode.parentNode
    if (event.target.parentNode.classList[0] == "arrow-icon")
    {
        layerData = event.target.parentNode.parentNode.parentNode.parentNode
    }
    var layers = document.getElementsByClassName("input-container")
    var graphDataContainer = document.getElementById("graph-specs")
    var before = ""
    var keepLooping = true

    if (layers.length > 1)
    {
        for (var i = 0; i < layers.length; i++)
        {
            if (layerData.id == layers[i].id && keepLooping)
            {
                var switchDataBox

                if (event.target.classList[0] == "arrow-up" || event.target.parentNode.parentNode.classList[0] == "arrow-up")
                {
                    if (i - 1 > -1)
                    {
                        switchDataBox = layers[i-1] 
                        before = "beforebegin"
                        console.log(i-1)
                    }
                    else
                    {
                        switchDataBox = layers[i -1 + layers.length]
                        before = "afterend"
                        console.log(i-1 + layers.length)
                    }
                }
                else if (event.target.classList[0] = "arrow-down" || event.target.parentNode.parentNode.classList[0] == "arrow-down")
                {
                    if (i + 1 < layers.length)
                    {
                        switchDataBox = layers[i+1] 
                        before = "afterend"
                        console.log(i+1)
                    }   
                    else
                    {
                        switchDataBox = layers[i + 1 - layers.length]
                        before = "beforebegin"
                        console.log(i+1 - layers.length)
                    }
                }

                if (switchDataBox)
                {
                    var permData = layerData
                    console.log(permData)
                    var permSwitch = switchDataBox
                    console.log(permSwitch)
                    graphDataContainer.removeChild(document.getElementById(layerData.id))             
                    permSwitch.insertAdjacentElement(before, permData)                

                    keepLooping = false
                } 
            }
        }
    }

    if (keepLooping == false)
    {
        resetGraph(event)
    }
}

//Deletes a layer of data, which can hold all of the variables assigned to a bar/pie slice/point on the graphs. Done when "x" is clicked
function deleteLayer(event)
{
    
    if (event.target.classList[0] == "delete-button")
    {
        var allGraphData = document.getElementById("graph-specs")
        allGraphData.removeChild(event.target.parentNode)
        resetIDs()
        resetGraph(event)
    }
    else if (event.target.parentNode.classList[0] == "delete-button")
    {
        var allGraphData = document.getElementById("graph-specs")
        allGraphData.removeChild(event.target.parentNode.parentNode)
        resetIDs()
        resetGraph(event)
    }
}

//Needed after deleting an element, as it can lead to two items being out of order and/or having the same id
function resetIDs()
{
    var dataList = document.getElementsByClassName("input-container")

    for (var i = 0; i < dataList.length; i++)
    {
        dataList[i].id = i.toString()
    }

}

//Decides whether the click is for a delete button or an arrow button
function decideLayer(event)
{
    if (event.target.classList[0] == "arrow-up" || event.target.classList[0] == "arrow-down" || event.target.parentNode.classList[0] == "arrow-icon")
    {
        moveLayer(event)
    }
    else
    {
        deleteLayer(event)
    }
}

//Resets the graph (animates it based on the input), by deleting and recreating it
function resetGraph(event)
{
    if (event.currentTarget)
    {
        if (event.currentTarget.id == "submit-button" || event.target.id == "delete-button" || event.target.parentNode.id == "delete-button" || inList("x-value-boxes", event.target.classList) || inList("y-value-boxes", event.target.classList)
        || inList("section-name", event.target.classList) || inList("section-color", event.target.classList) || inList("section-value", event.target.classList)
        || inList("section-opacity", event.target.classList) || inList("arrow-buttons", event.target.parentNode.classList) || inList("arrow-icon", event.target.parentNode.classList))
        {
            animationSwitch = true
        }
        else {
            animationSwitch = false
        }        
    }
    else
    {
        animationSwitch = false
    }
    deleteGraph()
    createGraph()
}



// ------ Finalize Data Functions ------

// These activate when the "+" is pressed, and they will add a new, editable data row, based on which kind of chart it is 
function finalizeScatterData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementById("x-value-boxes").value != "" && document.getElementById("y-value-boxes").value != "")
    {
        var valuesContainer = document.getElementById("initial-input-container")
        valuesContainer.insertAdjacentHTML("beforebegin", "<div class = \"input-container\"></div>")
        var newContainers = document.getElementsByClassName("input-container")
        var thisContainer = newContainers[newContainers.length - 1]
        thisContainer.id = (newContainers.length-1).toString()
        var types = ["number", "number"]


        var arrows = Handlebars.templates.arrows()
        thisContainer.insertAdjacentHTML("afterbegin", arrows)

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
        thisContainer.id = (newContainers.length-1).toString()

        var types = ["text", "text", "number", "range"]

        var arrows = Handlebars.templates.arrows()
        thisContainer.insertAdjacentHTML("afterbegin", arrows)

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

function finalizeLineData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementById("section-name").value != "" && document.getElementById("y-value-boxes").value != "")
    {
        var valuesContainer = document.getElementById("initial-input-container")
        valuesContainer.insertAdjacentHTML("beforebegin", "<div class = \"input-container\"></div>")
        var newContainers = document.getElementsByClassName("input-container")
        var thisContainer = newContainers[newContainers.length - 1]
        thisContainer.id = (newContainers.length-1).toString()
        var types = ["text", "text", "number"]

        var arrows = Handlebars.templates.arrows()
        thisContainer.insertAdjacentHTML("afterbegin", arrows)

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


//--------------- Functions for graphing ------------------

//Determines if the graph should draw a line
function determineLine()
{
    var lineCheck = document.getElementById("line-checkbox")
    return lineCheck.checked
}

//Gathers and stores all of a graphs labels
function createLabels () {
    var labelValues = document.getElementsByClassName("section-name")
    var labelArray = []

    for (var i = 0; i < labelValues.length; i++)
    {
        labelArray.push(labelValues[i].value)
    }

    return labelArray
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

//Accesses all of the y-values for the scatter plot, or line graphs
function accessYValues () {
    var dataValues = document.getElementsByClassName("y-value-boxes")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
}

//Places the x and y values into the necessary data structure for the scatter plot
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

//Accesses the generic values for bar charts and pie charts
function accessValues () {
    var dataValues = document.getElementsByClassName("section-value")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
}

//Creates an array of colors based on opacity and color (pie and bar)
function createColors () {
    var colorValuesInitial = document.getElementsByClassName("section-color")
    var opacityValuesInitial = document.getElementsByClassName("section-opacity")
    var colorValues = []
    var opacityValues = []
    
    for (var i = 0; i < colorValuesInitial.length; i++)
    {
        colorValues.push(colorValuesInitial[i].value)
        opacityValues.push(opacityValuesInitial[i].value)
    }

    var colorArray = []
    var borderArray = []
    var colorsArray = []
    var additionalPush = true

    colorValues.forEach( function (inputColor) {
        additionalPush = true
        colors.forEach( function (elemColor) {
            if (elemColor.color == inputColor.toLowerCase())
            {
                colorArray.push("rgba(" + elemColor.value + ", " + parseInt(opacityValues[colorValues.indexOf(elemColor.color)])/100 + ")")
                borderArray.push("rgba(" + elemColor.value + ", 1)")       
                additionalPush = false         
            }
        })
        if (additionalPush)
        {
            console.log("Push")
            colorArray.push("rgba(0, 0, 0," + parseInt(opacityValues[colorValues.indexOf(inputColor)])/100 + ")")
            borderArray.push("rgba(0, 0, 0, 1)")                
        }    
    })

    colorsArray = [colorArray, borderArray]
    return colorsArray
}

//Generates one color based on input to the color field (scatter and line)
function createGraphColor () {
    var colorValue = document.getElementById("color").value
    var opacityValue = document.getElementById("opacity").value
    var color = ""

    colors.forEach( function (elem) {
        if (colorValue.toLowerCase() == elem.color && opacityValue == "")
        {
            color = "rgba(" + elem.value + ", 1)"
        }
        else if (colorValue.toLowerCase() == elem.color && opacityValue != "")
        {
            color = "rgba(" + elem.value + ", " + opacityValue/100 + ")"
        }
    })
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
                    display: true
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
                    display: true
                }
            }
        }
    }
    return options
}

//Gets all of the colors (similar to create colors), but stores it in a string array to push to the .json
function getAllColors() {
    colorsList = document.getElementsByClassName("section-color")
    allColorString = []
    for (var i = 0; i < colorsList.length; i++)
    {
        allColorString.push(colorsList[i].value)
    }

    return allColorString
}

//Gets all of the opacities, but stores them in a string array to push to the .json
function getAllOpacities() {
    opacitiesList = document.getElementsByClassName("section-opacity")
    allOpacityString = []
    for (var i = 0; i < colorsList.length; i++)
    {
        allOpacityString.push(opacitiesList[i].value)
    }

    return allOpacityString
}

//Creates special labels for the Pie Chart to give more info
function createPieLabels() {
    var labelsText = createLabels()
    var values = accessValues()
    var pieLabelsArray = []
    var sum = 0
    values.forEach( function (elem) {
        sum = sum + parseInt(elem)
    })

    for(var i = 0; i < labelsText.length; i++)
    {
        var percentage = Math.round((values[i]/sum) * 100)
        pieLabelsArray.push(labelsText[i] + ": " + percentage.toString() +"%")    
    }

    return pieLabelsArray
}


//--------- Graph Reset Functions ----------

//Deletes the graph, by removing it as a child
function deleteGraph () {
    document.getElementById("chart-container").removeChild(document.getElementById("myChart"))
}

//Determines which type of graph to create based on type
function createGraph() {
    //Find the container of the chart, create the canvas element, and take the context of the canvas
    var chartContainer = document.getElementById("chart-container")
    var chart = document.createElement("canvas")
    chart.id = "myChart"
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

//Makes the scatter plot
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

//Makes the bar graph
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
                    text: document.getElementById("title").value
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

//Makes the line graph
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

//Makes the pieChart
function createPieChart (ctx) {

    var colorsArray = createColors()
    var graphColors = colorsArray[0]
    var borderColors = colorsArray[1]

    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: createPieLabels(),
            datasets: [{
                data: accessValues(),
                backgroundColor: graphColors,
                borderColors: borderColors,
                hoverOffset: 20
            }]
        },
        options: pieOptions()
    });
}

//When the publish button is hit, pushData is executed based on what type of graph it is 
function publish (event) {
    if (type == "scatter")
    {
        pushData(document.getElementById("title").value, document.getElementById("username").value, accessYValues(), document.getElementById("color").value, document.getElementById("opacity").value, "", document.getElementById("xlabel").value, 
        document.getElementById("ylabel").value, document.getElementById("added-symbol").value, determineLine(), accessXValues(), "/scatter")        
    }
    else if (type == "bar")
    {
        pushData(document.getElementById("title").value, document.getElementById("username").value, accessValues(), getAllColors(), getAllOpacities(), createLabels(), "", 
        document.getElementById("ylabel").value, document.getElementById("added-symbol").value, "", "", "/bar")  
    }
    else if (type == "pie")
    {
        pushData(document.getElementById("title").value, document.getElementById("username").value, accessValues(), getAllColors(), getAllOpacities(), createLabels(), "", "", "", "", "", "/pie")  
    }
    else if (type == "line")
    {
        pushData(document.getElementById("title").value, document.getElementById("username").value, accessYValues(), document.getElementById("color").value, document.getElementById("opacity").value, createLabels(), document.getElementById("xlabel").value, 
        document.getElementById("ylabel").value, document.getElementById("added-symbol").value, "", "", "/line")  
    }
    else
    {
        alert("Not a valid graph type!")
    }
}

//Publish button 
var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", publish)


//Creates the graph based on .json data, and the associated url
function formGraph (json)
{
    if (JSON.stringify(json) != "{}" && json[0] != "" && json[1] != "")
    {
        document.getElementById("title").value = json.title
        document.getElementById("username").value = json.userName

        if (json.url == "/scatter")
        {
            document.getElementById("color").value = json.colors
            document.getElementById("opacity").value = parseInt(json.opacities)
            document.getElementById("xlabel").value = json.xLabel
            document.getElementById("ylabel").value = json.yLabel
            document.getElementById("added-symbol").value = json.addedSymbol
            document.getElementById("line-checkbox").checked = json.line
            
            for (var i = 0; i < json.data.length; i++)
            {
                document.getElementById("x-value-boxes").value = parseInt(json.xData[i])
                document.getElementById("y-value-boxes").value = parseInt(json.data[i])
                finalizeScatterData("")
            }
        } 

        if (json.url == "/line")
        {
            document.getElementById("color").value = json.colors
            document.getElementById("opacity").value = parseInt(json.opacities)
            document.getElementById("xlabel").value = json.xLabel
            document.getElementById("ylabel").value = json.yLabel
            document.getElementById("added-symbol").value = json.addedSymbol
            
            for (var i = 0; i < json.data.length; i++)
            {
                document.getElementById("section-name").value = json.labels[i]
                document.getElementById("y-value-boxes").value = parseInt(json.data[i])
                finalizeLineData("")
            }
        }

        if (json.url == "/pie")
        {            
            for (var i = 0; i < json.data.length; i++)
            {
                document.getElementById("section-name").value = json.labels[i]
                document.getElementById("section-color").value = json.colors[i]
                document.getElementById("section-opacity").value = json.opacities[i]
                document.getElementById("section-value").value = parseInt(json.data[i])
                finalizeSectionData("")
            }
        }        

        if (json.url == "/bar")
        {
            document.getElementById("ylabel").value = json.yLabel
            document.getElementById("added-symbol").value = json.addedSymbol
            
            for (var i = 0; i < json.data.length; i++)
            {
                document.getElementById("section-name").value = json.labels[i]
                document.getElementById("section-color").value = json.colors[i]
                document.getElementById("section-opacity").value = json.opacities[i]
                document.getElementById("section-value").value = parseInt(json.data[i])
                finalizeSectionData("")
            }
        }

    }

}

//Data is pushed to the server, and saved to the .json, before being redirected to viewport
function pushData(title, userName, data, colors, opacities, labels, xLabel, yLabel, addedSymbol, line, xData, url)
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
    else if (userName == "") {
        alert("Please input your name")
    }
    else
    {
        html2canvas(graph).then(function(canvas){
            graphImage = canvas
        
       
            graphImage.toBlob(function(blob) {
                    fetch('/postImage', {
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
                                userName: userName,
                                date: finalDate,
                                data: data,
                                colors: colors,
                                opacities: opacities,
                                labels: labels,
                                xLabel: xLabel,
                                yLabel: yLabel,
                                addedSymbol: addedSymbol,
                                line: line,
                                xData: xData,
                                url: url
                            }),
                            headers: {"Content-Type":"application/json"}
                        }).then(function(res) {
                            if (res.status === 200) {
                                return res.text()
                            }
                            else
                            {
                                alert("Failed to get a 200 response code")
                            }
                        }).then(function (text) {
                            if (text != "Graph Data Written"){
                                alert(text)
                                return false                                
                            }
                            return true
                        }).then(function (sendPath) {
                            if (sendPath)
                            {
                                window.location.pathname = "/view"
                            }
                        }).catch(function(err) {
                            alert("Error" + err)
                        })                            
                    })
                })
            })
    }
}