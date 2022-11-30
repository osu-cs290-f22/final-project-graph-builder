/**
 * 
 * Kieran Here
 * I put the publish button in one folder because let's face it:
 * Every page needs a publish button
 * And I only want to write the same lines of code so many times 
 */

//Creates image to be saved


function createImage(event)
{
    var graphImage
    var graph = document.getElementById("myChart")
    var url;

    html2canvas(graph).then(function(canvas){
        graphImage = canvas
        document.body.appendChild(graphImage)
        url = canvas.toDataUrl();
    })


    //fetch request
    fetch('/postig', {
        method: 'POST',
        body: JSON.stringify({
            likeCount: 0,
            graph: "url",
            title: "Work on this",
            personName: "Look this sounds like a you problem",
            month: 6,
            day: 40,
            year: 6077
        }),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
}

//publish button creates the graph.
var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", createImage)