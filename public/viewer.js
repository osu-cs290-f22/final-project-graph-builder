document.body.addEventListener("click", createNewGraph)

var newGraphData

function createNewGraph(event)
{
    var urlValue
    
    if (event.target.classList[0] == "add-graph-button")
    {
        var titleText = event.target.parentNode.parentNode.parentNode.getElementsByClassName("title")[0].textContent
        var allTitleTexts = document.getElementsByClassName("title")

        for (var i = 0; i < allTitleTexts.length; i++)
        {
            if (allTitleTexts[i].textContent == titleText)
            {
                urlValue = i
            }
        }

        var requestUrl = "/graphs/" + urlValue.toString()

        fetch(requestUrl, {
            method: "GET"
        }).then( function (res) {
            if (res.status == 200) {
                return res.json()
            }
            else 
            {
                alert("Was Unable to satisfy GET")
            }
        }).then( function (json) {
            console.log(json.url)
            window.location.pathname = json.url
        }).catch(function (err) {
            if (err) {
                alert("Error!")
            }
        }) 
    }
}
