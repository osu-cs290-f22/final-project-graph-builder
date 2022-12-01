//--------------------- Initialization 

//Variables for anything that is not an array, title, y axis label, added symbols
var title = "", ylabel = "", additionalSymbol = ""

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

var ylabelBox = document.getElementById("ylabel")
ylabelBox.addEventListener("change", saveYLabel)

var addSymbolBox = document.getElementById("added-symbol")
addSymbolBox.addEventListener("change", saveAdditionalSymbol)


//Saves all of the data in the row, and creates a new data row to process
function finalizeData(event) {
    //If the rows are not empty, a new row can actually be created
    if (document.getElementsByClassName("input-boxes")[0].value != "" && document.getElementsByClassName("input-boxes")[1].value != ""
    && document.getElementsByClassName("input-boxes")[2].value != "" && document.getElementsByClassName("input-boxes")[3].value != 0)
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
        var barName = document.createElement("input")
        barName.type = "text"
        barName.classList.add("bar-value-boxes")
        barName.value = document.getElementsByClassName("input-boxes")[0].value

        //Adds the color label and value
        var colorLabel = document.createElement("label")
        colorLabel.classList.add("graph-labels")
        colorLabel.textContent = "Color:"
        var colorValue = document.createElement("div")
        colorValue.classList.add("input-boxes-container")
        var barColor = document.createElement("input")
        barColor.type = "text"
        barColor.classList.add("color-value-boxes")
        barColor.value = document.getElementsByClassName("input-boxes")[1].value

        //Adds the value label and the number associated with it
        var valueLabel = document.createElement("label")
        valueLabel.classList.add("graph-labels")
        valueLabel.textContent = "Value:"
        var numberValue = document.createElement("div")
        numberValue.classList.add("input-boxes-container")
        var barValue = document.createElement("input")
        barValue.type = "number"
        barValue.classList.add("number-value-boxes")
        barValue.value = document.getElementsByClassName("input-boxes")[2].value

        //Adds the opacity label and value
        var opacityLabel = document.createElement("label")
        opacityLabel.classList.add("graph-labels")
        opacityLabel.textContent = "Opacity:"
        var opacityValue = document.createElement("div")
        opacityValue.classList.add("input-boxes-container")
        var barOpacity = document.createElement("input")
        barOpacity.type = "range"
        barOpacity.min="1" 
        barOpacity.max="100"
        barOpacity.classList.add("opacity-value-boxes")
        barOpacity.value = document.getElementsByClassName("input-boxes")[3].value

        //Appends all the boxes to the overall container 
        colorValue.appendChild(barColor)
        nameValue.appendChild(barName)
        numberValue.appendChild(barValue)
        opacityValue.appendChild(barOpacity)
        completeContainer.appendChild(nameLabel)
        completeContainer.appendChild(nameValue)
        completeContainer.appendChild(colorLabel)
        completeContainer.appendChild(colorValue)
        completeContainer.appendChild(valueLabel)
        completeContainer.appendChild(numberValue)
        completeContainer.appendChild(opacityLabel)
        completeContainer.appendChild(opacityValue)

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



//---------- Gathers the Inputted Colors ------------

//Every color that can inputted, and it's associated value
var allColors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "gray"]
var colorRGB = ["255,0,0", "255,128,0", "255,255,0", "0,204,0", "0,0,255", "204,0,204", "0,0,0", "128,128,128"] 

//When forming the graph, gathers all of the colors that have been saved, for the graph border and color
function createColors () {
    var colorValues = document.getElementsByClassName("color-value-boxes")
    var opacityValues = document.getElementsByClassName("opacity-value-boxes")
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


//--------- Finds all of the bar graph data -----------

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

    var colorsArray = createColors()
    var graphColors = colorsArray[0]
    var borderColors = colorsArray[1]

    const ctx = document.getElementById('myChart');
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

