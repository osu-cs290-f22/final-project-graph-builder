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
    var title = document.getElementById("title-input")

    //this is the most important part
    const tInput = title.value.trim();

    if (tInput === "") {
        alert("Please give your graph a title.");
        return;
    }

    html2canvas(graph).then(function(canvas){
        graphImage = canvas
        document.body.appendChild(graphImage)
        
        graphImage.toBlob(async function(blob) {
                
            //fetch request
            var response = await fetch('/postig', {
                method: 'POST',
                body: blob,
                headers: {"Content-Type": "image/png"}
                
            })

            var rt = await response.text();
            console.log(rt);

            
            fetch('/postgr', {
                method: 'POST',
                body: JSON.stringify({
                    likeCount: 0,
                    graph: rt,
                    title: tInput,
                    personName: "Anonymous",
                    month: 1,
                    day: 1,
                    year: 2000
                }),
                headers: {"Content-Type": "application/json"}
            })
        })

        
    })


    
}

//publish button creates the graph.
var publishButton = document.getElementById("publish-button")
publishButton.addEventListener("click", createImage)