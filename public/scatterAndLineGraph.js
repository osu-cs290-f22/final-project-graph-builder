// ------------------ Initialization

//Creates the title, label, and symbol variables
var title = "", ylabel = "", xlabel = "", additionalSymbol = ""

//If true, animate the graph, if false, do not animate the graph
var animationSwitch = true

//Creates the graph the instant the website is opened, but it is empty
createGraph()

//Makes the entire document listen for changes, as there can be an infinite number of coordinates, so this is needed to not overwhelm the cite
var listener = document.body.addEventListener("change", resetGraph)

// ------------------- Event Listeners

//Title Input Box
var titleBox = document.getElementById("title-input")
titleBox.addEventListener("change", saveTitle)

//XLabel Input Box
var xlabelBox = document.getElementById("xlabel")
xlabelBox.addEventListener("change", saveXLabel)

//YLabel Input Box
var ylabelBox = document.getElementById("ylabel")
ylabelBox.addEventListener("change", saveYLabel)

//Symbol Input Box
var addSymbolBox = document.getElementById("added-symbol")
addSymbolBox.addEventListener("change", saveAdditionalSymbol)

//The button to create a new row of data
var addButton = document.getElementById("submit-button")
addButton.addEventListener("click", finalizeData)

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

//Resets the graph (animates it based on the input), by deleting and recreating it
function resetGraph(event)
{
    if (event.currentTarget.id == "submit-button" || inList("x-value-boxes", event.target.classList) || inList("y-value-boxes", event.target.classList))
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

//All save the variable and reset
function saveTitle(event) {
    title = event.currentTarget.value
    resetGraph(event)
}

function saveYLabel(event) {
    ylabel = event.currentTarget.value
    resetGraph(event)
}

function saveXLabel(event) {
    xlabel = event.currentTarget.value
    resetGraph(event)
}

function saveAdditionalSymbol(event) {
    additionalSymbol = event.currentTarget.value
    resetGraph(event)
}





//Saves all of the data in the row, and creates a new data row to process
function finalizeData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementsByClassName("input-boxes")[0].value != 0 && document.getElementsByClassName("input-boxes")[1].value != 0)
    {
        //Creates the complete container for the entire row
        var completeContainer = document.createElement("div")

        //Adds the xVariable label and value
        completeContainer.classList.add("input-container")
        var xValueLabel = document.createElement("label")
        xValueLabel.classList.add("graph-labels")
        xValueLabel.textContent = "X-Value:"
        var xValueContainer = document.createElement("div")
        xValueContainer.classList.add("input-boxes-container")
        var xValue = document.createElement("input")
        xValue.type = "number"
        xValue.classList.add("x-value-boxes")
        xValue.value = document.getElementsByClassName("input-boxes")[0].value

        //Adds the yVariable label and value
        var yValueLabel = document.createElement("label")
        yValueLabel.classList.add("graph-labels")
        yValueLabel.textContent = "Y-Value:"
        var yValueContainer = document.createElement("div")
        yValueContainer.classList.add("input-boxes-container")
        var yValue = document.createElement("input")
        yValue.type = "number"
        yValue.classList.add("y-value-boxes")
        yValue.value = document.getElementsByClassName("input-boxes")[1].value


        //Appends all the boxes to the overall container 
        xValueContainer.appendChild(xValue)
        yValueContainer.appendChild(yValue)
        completeContainer.appendChild(xValueLabel)
        completeContainer.appendChild(xValue)
        completeContainer.appendChild(yValueLabel)
        completeContainer.appendChild(yValue)

        //Add to the entire container holding all of the graph boxes
        var valuesContainer = document.getElementById("graph-specs")
        valuesContainer.appendChild(completeContainer)

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



function createGraphColor () {
    var allColors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "gray"]
    var colorRGB = ["255,0,0", "255,128,0", "255,255,0", "0,204,0", "0,0,255", "204,0,204", "0,0,0", "128,128,128"] 
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


//Deletes the graph, by removing it as a child
function deleteGraph () {
    document.getElementById("chart-container").removeChild(document.getElementById("myChart"))
}

//Recreates the graph using Chart.js framework
function createGraph () {
    var chartContainer = document.getElementById("chart-container")
    var chart = document.createElement("canvas")
    chart.id = "myChart"
    chart.classList.add("chart")
    chartContainer.appendChild(chart)



    const ctx = document.getElementById('myChart');
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
                        text: xlabel
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: ylabel
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, ticks)
                        {
                            return additionalSymbol+value
                        }
                    }
                }
            },
            plugins:
            {
                title: {
                    display: true, 
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

//Creates image to be saved
function createImage(event)
{
    var graphImage
    var graph = document.getElementById("myChart")

    html2canvas(graph).then(function(canvas){
        graphImage = canvas
        document.body.appendChild(graphImage)
    })
}

var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", createImage)