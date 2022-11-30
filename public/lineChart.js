//--------------------- Initialization 

//Variables for anything that is not an array, title, y axis label, added symbols
var title = "", xlabel = "", ylabel = "", additionalSymbol = ""

//Tells the graph to animate change or not
var animationSwitch = true

//Creates the graph the instant the website is opened, but it is empty
createGraph()

//Makes the entire document listen for changes, as there can be an infinite number of coordinates, so this is needed to not overwhelm the cite
var listener = document.body.addEventListener("change", resetGraph)

//-------------------- Event Listeners

// ------------------- Functions

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
    if (event.currentTarget.id === "submit-button" || inList("color-value-boxes", event.target.classList)
    || inList("number-value-boxes", event.target.classList) || inList("opacity-value-boxes", event.target.classList))
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


function saveTitle(event) {
    title = event.currentTarget.value
    resetGraph(event)
}

function saveXLabel(event) {
    xlabel = event.currentTarget.value
    resetGraph(event)
}

function saveYLabel(event) {
    ylabel = event.currentTarget.value
    resetGraph(event)
}

function saveAdditionalSymbol(event) {
    additionalSymbol = event.currentTarget.value
    resetGraph(event)
}

var titleBox = document.getElementById("title-input")
titleBox.addEventListener("change", saveTitle)

var xlabelBox = document.getElementById("xlabel")
xlabelBox.addEventListener("change", saveXLabel)

var ylabelBox = document.getElementById("ylabel")
ylabelBox.addEventListener("change", saveYLabel)

var addSymbolBox = document.getElementById("added-symbol")
addSymbolBox.addEventListener("change", saveAdditionalSymbol)



//When forming the graph, gathers all of the colors that have been saved, for the graph border and color
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

//Saves all of the data in the row, and creates a new data row to process
function finalizeData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementsByClassName("input-boxes")[0].value != "" && document.getElementsByClassName("input-boxes")[1].value != 0)
    {
        //Creates the complete container for the entire row
        var completeContainer = document.createElement("div")

        //Adds the name label and value
        completeContainer.classList.add("input-container")
        var nameLabel = document.createElement("label")
        nameLabel.classList.add("graph-labels")
        nameLabel.textContent = "Name:"
        var nameValue = document.createElement("div")
        nameValue.classList.add("input-boxes-container")
        var lineName = document.createElement("input")
        lineName.type = "text"
        lineName.classList.add("bar-value-boxes")
        lineName.value = document.getElementsByClassName("input-boxes")[0].value

        //Adds the value label and the number associated with it
        var valueLabel = document.createElement("label")
        valueLabel.classList.add("graph-labels")
        valueLabel.textContent = "Value:"
        var numberValue = document.createElement("div")
        numberValue.classList.add("input-boxes-container")
        var lineValue = document.createElement("input")
        lineValue.type = "number"
        lineValue.classList.add("number-value-boxes")
        lineValue.value = document.getElementsByClassName("input-boxes")[1].value


        //Appends all the boxes to the overall container 
        nameValue.appendChild(lineName)
        numberValue.appendChild(lineValue)
        completeContainer.appendChild(nameLabel)
        completeContainer.appendChild(nameValue)
        completeContainer.appendChild(valueLabel)
        completeContainer.appendChild(numberValue)

        //Add to the entire container holding all of the graph boxes
        var valuesContainer = document.getElementById("graph-specs")
        valuesContainer.appendChild(completeContainer)

        resetGraph(event)
    }
}

//The button to create a new row of data
var addButton = document.getElementById("submit-button")
addButton.addEventListener("click", finalizeData)



//--------- Gathers All of the Labels Functions ------------

//When forming the graph, gathers all of the labels that are saved
function createLabels () {
    var labelValues = document.getElementsByClassName("bar-value-boxes")
    var labelArray = []

    for (var i = 0; i < labelValues.length; i++)
    {
        labelArray.push(labelValues[i].value)
    }

    return labelArray
}


//--------- Finds all of the line graph data -----------

//Accesses all of the values for the bar graph
function accessValues () {
    var dataValues = document.getElementsByClassName("number-value-boxes")
    var dataArray = []

    for (var i = 0; i < dataValues.length; i++)
    {
        dataArray.push(dataValues[i].value)
    }

    return dataArray     
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
        type: 'line',
        data: {
            labels: createLabels(),
            datasets: [{
                data: accessValues(),
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
                        text: ylabel
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, ticks)
                        {
                            return additionalSymbol+value
                        }
                    }
                }, 
                x: {
                    title: {
                        display: true, 
                        text: xlabel
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