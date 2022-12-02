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

    html2canvas(graph).then(function(canvas){
        graphImage = canvas
    }.then(graphImage.toBlob( function(blob) {
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
                responseText = text
                console.log(responseText)
            }).catch(function(err) {
                if (err) {
                    console.log("Unable to perform the fetch")
                }
            })
            fetch('/postgraph', {
                    method: 'POST',
                    body: JSON.stringify({
                        likeCount: 0,
                        graph: responseText,
                        title: title,
                        userName: "Anonymous",
                        date: finalDate,
                        data: data,
                        colors: colors,
                        line: line,
                        xLabel: xLabel,
                        yLabel: yLabel,
                        labels: labels,
                        xData: dataX
                    }),
                    headers: {"Content-Type": "application/json"}
                }).then(function (res) {
                    if (res.status === 200)
                    {
                        fetch("/view").then(function (res) {
                            if (res.status === 200) 
                            {
                                alert("Succsessful Move")
                            }
                            else 
                            {
                                alert("Was unable to access the viewport")
                            }
                        }).catch(function (err) {
                            alert("Unable to navigate to viewer")
                        })
                    }
                    else
                    {
                        alert("Failure to postGraph 200")
                    }
                }).catch(function(err) {
                    if (err) {
                        alert("Failure to fetch postGraph")
                    }
                })
        })))     
}
