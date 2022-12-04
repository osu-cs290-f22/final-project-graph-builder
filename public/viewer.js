
document.body.addEventListener("click", createNewGraphOrLike)

var newGraphData
var likeButtonsSwitches = createButtonLikes()

function createButtonLikes () {
    var switchesArray = []
    var likeButtons = document.getElementsByClassName("like-button")
    for (var i = 0; i < likeButtons.length; i++)
    {
        switchesArray.push(true)
    }
    return switchesArray
} 

function createNewGraphOrLike(event)
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
            window.location.pathname = json.url
        }).catch(function (err) {
            if (err) {
                alert("Error!")
            }
        }) 
    }


    if (event.target.parentNode.classList[0] == "like-button")
    {

        var titlesList = document.getElementsByClassName("title")

        for (var i = 0; i < titlesList.length; i++)
        {
            if (titlesList[i].textContent == event.target.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("title")[0].textContent)
            {
                if (likeButtonsSwitches[i] == false)
                {
                    var postLikeCounter = event.target.parentNode.parentNode.parentNode.getElementsByClassName("like-counter")[0]
                    postLikeCounter.textContent = parseInt(postLikeCounter.textContent) - 1
                    event.target.style.backgroundColor = "blue"
                    event.target.style.color = "black"
                    event.target.parentNode.style.backgroundColor = "blue"
                    event.target.parentNode.style.color = "black"
                    event.target.parentNode.style.borderWidth = "2px"
                    event.target.parentNode.style.borderStyle = "solid"
                    event.target.parentNode.style.borderColor = "black"
                    likeButtonsSwitches[i] = true
                    sendLikeToServer(i, -1)
                }
                else if (likeButtonsSwitches[i] == true)
                {
                    var postLikeCounter = event.target.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("like-counter")[0]
                    postLikeCounter.textContent = parseInt(postLikeCounter.textContent) + 1
                    event.target.style.backgroundColor = "aqua"
                    event.target.style.color = "white"
                    event.target.parentNode.style.backgroundColor = "aqua"
                    event.target.parentNode.style.color = "white"
                    event.target.parentNode.style.borderWidth = "2px"
                    event.target.parentNode.style.borderStyle = "solid"
                    event.target.parentNode.style.borderColor = "darkblue" 
                    likeButtonsSwitches[i] = false 
                    sendLikeToServer(i, 1)          
                }
            }
        }
    }
}

function sendLikeToServer(position, increase) {
    var reqUrl = "/addLike/" + position.toString()
    console.log(reqUrl)
    fetch(reqUrl, {
        method: "POST",
        body: JSON.stringify({
            likeIncrease: increase
        }),
        headers: {"Content-Type": "application/json"}
    }).then(function (res) {
        if (res.status != 200)
        {
            alert("Failed to push like")
        }
    }).catch(function (err) {
        alert("Failure to access the server")
    })
}