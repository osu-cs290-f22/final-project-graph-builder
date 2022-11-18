//Add graph that graphs the number of bar charts, pie charts, etc. posted to the site
//Could also do a graph of when graphs have been posted (date/time)


createGraph()

function getSelectedColors()
{
    var colors = []
    var colorsData = document.querySelectorAll("input")

    for (var i = 0; i < colorsData.length; i++)
    {
        colors.push(colorsData[i].value)
    }

    return colors
}

function addValueBox (event) {
    if (event.currentTarget.checked == true)
    {
        var valueDiv = document.createElement("div")
        var newClassString = event.currentTarget.value + "-box-input"
        valueDiv.id = newClassString
        var boxLabel = document.createElement("label")
        boxLabel.textContent = event.currentTarget.value
        var box = document.createElement("input")
        box.type = "number"
        
        boxLabel.appendChild(box)
        valueDiv.appendChild(boxLabel)
    
        var fieldset = document.getElementById("value-boxes")
        fieldset.appendChild(valueDiv)
    }
    else
    {
        var classString = event.currentTarget.value + "-box-input"
        var valueDiv = document.getElementById(classString)
        console.log(valueDiv)
        var fieldset = document.getElementById("value-boxes")
        fieldset.removeChild(valueDiv)
    }
}



function finalizeData(event) {
    if (document.getElementsByClassName("input-boxes")[0].value != "" && document.getElementsByClassName("input-boxes")[1].value != "")
    {
        
    
        var completeContainer = document.createElement("div")
        completeContainer.classList.add("input-container")
        var nameLabel = document.createElement("label")
        nameLabel.classList.add("graph-labels")
        nameLabel.textContent = "Name:"
        var nameValue = document.createElement("div")
        nameValue.classList.add("input-boxes-container")
        var barName = document.createElement("p")
        barName.classList.add("bar-value-boxes")
        barName.textContent = document.getElementsByClassName("input-boxes")[0].value

        var colorLabel = document.createElement("label")
        colorLabel.classList.add("graph-labels")
        colorLabel.textContent = "Color:"
        var colorValue = document.createElement("div")
        colorValue.classList.add("input-boxes-container")
        var barColor = document.createElement("p")
        barColor.classList.add("color-value-boxes")
        barColor.textContent = document.getElementsByClassName("input-boxes")[1].value

        colorValue.appendChild(barColor)
        nameValue.appendChild(barName)
        completeContainer.appendChild(nameLabel)
        completeContainer.appendChild(nameValue)
        completeContainer.appendChild(colorLabel)
        completeContainer.appendChild(colorValue)

        var valuesContainer = document.getElementById("graph-specs")
        valuesContainer.appendChild(completeContainer)

        deleteGraph()
        createGraph()
    }
}

var addButton = document.getElementById("submit-button")
addButton.addEventListener("click", finalizeData)


function createLabels () {
    var labelValues = document.getElementsByClassName("bar-value-boxes")
    var labelArray = []

    for (var i = 0; i < labelValues.length; i++)
    {
        labelArray.push(labelValues[i].textContent)
    }

    return labelArray
}

function deleteGraph () {
    document.getElementById("chart-container").removeChild(document.getElementById("myChart"))
}

function createGraph () {
    var chartContainer = document.getElementById("chart-container")
    var chart = document.createElement("canvas")
    chart.id = "myChart"
    chart.classList.add("chart")
    chartContainer.appendChild(chart)

    const ctx = document.getElementById('myChart');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: createLabels(),
            datasets: [{
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins:
            {
                title: {
                    display: true, 
                    text: 'Title Text'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function createImage(event)
{
    var graphImage = document.createElement("canvas")

    var graph = document.getElementById("myChart")


}

var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", createImage)