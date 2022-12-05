
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
        var postId = event.target.parentNode.parentNode.parentNode.id
        urlValue = postId

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

        var identity = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (likeButtonsSwitches[identity] == false)
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
            likeButtonsSwitches[identity] = true
            sendLikeToServer(identity, -1)
        }
        else if (likeButtonsSwitches[identity] == true)
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
            likeButtonsSwitches[identity] = false 
            sendLikeToServer(identity, 1)          
        }
    }
}

function sendLikeToServer(position, increase) {
    var reqUrl = "/addLike/" + position.toString()
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


var filterButton = document.getElementById("filter-button")
filterButton.addEventListener("click", performFilter)

var postsContainer = document.getElementById("all-posts")

var allPosts = document.getElementsByClassName("graph-box")


var oldestPostsList = []
var newestPostsList = []

var popularityPostsList = []

for (var i = 0; i < allPosts.length; i++)
{
    newestPostsList.push(allPosts[i])
    oldestPostsList.unshift(allPosts[i])
}


function determinePopularity(value)
{
    if(value === 0)
    {
        return 0
    }

    var greatest 
    var number
    for (var i = 0; i < popularityHelper.length; i++)
    {
        if (i == 0)
        {
            number = 0
            greatest = popularityHelper[0]
        } 
        else
        {
            var currentPostLikeNumber = parseInt(popularityHelper[i].getElementsByClassName("like-counter")[0].textContent)
            var greatestPostLikeNumber = parseInt(greatest.getElementsByClassName("like-counter")[0].textContent)
            
            if ( currentPostLikeNumber > greatestPostLikeNumber)
            {
                number = i
                greatest = popularityHelper[i]
            }
        }
    }

    popularityHelper.splice(number, 1)   
    popularityPostsList.push(greatest)

    return determinePopularity(popularityHelper.length)

}

function performFilter()
{
    popularityHelper = Array.from(oldestPostsList)
    determinePopularity(popularityHelper.length)
    
    var titleFilter = document.getElementById("filter-title").value
    var nameFilter = document.getElementById("filter-author").value
    var allDates = document.getElementsByClassName("date-boxes-container")
    var date1 = []
    date1.push(allDates[0].childNodes[1].value) 
    date1.push(allDates[0].childNodes[3].value) 
    date1.push(allDates[0].childNodes[5].value)
    var date2 = []
    date2.push(allDates[1].childNodes[1].value) 
    date2.push(allDates[1].childNodes[3].value) 
    date2.push(allDates[1].childNodes[5].value)

    var sortBy = document.getElementById("sort-by").value.toLowerCase()
    var allPostsPerm

    if (sortBy == "oldest")
    {
        allPostsPerm = oldestPostsList
    }
    else if (sortBy == "newest")
    {
        allPostsPerm = newestPostsList
    }
    else if (sortBy == "most liked")
    {
        allPostsPerm = popularityPostsList
    }
    

    for (var i = allPosts.length; i > 0; i--)
    {
        postsContainer.removeChild(allPosts[0])
    }

    for (var i = 0; i < allPostsPerm.length; i++)
    {

        if ((!titleFilter || allPostsPerm[i].getElementsByClassName("title")[0].textContent.toLowerCase().includes(titleFilter))
        && (!nameFilter || allPostsPerm[i].getElementsByClassName("author")[0].textContent.toLowerCase().includes(nameFilter)) 
        && (dateCompare(date1, allPostsPerm[i].getElementsByClassName("date")[0].textContent.toLowerCase(), "above") == 1) && (dateCompare(date2, allPostsPerm[i].getElementsByClassName("date")[0].textContent.toLowerCase(), "below") == 0))
        { 
            postsContainer.appendChild(allPostsPerm[i])
        } 
    }


}



//Date comparison functions; determine if one date happens before the other
function dateCompare (inputDate, compareDate, desired)
{
    //Return 1 if the input date is more recent than the compare data, return 0 if in the past of the compare date
    var inputMonth = inputDate[0] 
    var inputDay = inputDate[1]
    var inputYear = inputDate[2]
    var compareMonth = compareDate.split(' ')[0]
    var compareDay = compareDate.split(' ')[1]
    var compareYear = compareDate.split(' ')[2]

    if (inputYear != "")
    {
        if (parseInt(inputYear) > parseInt(compareYear))
        {
            return 0
        }
        else if (parseInt(inputYear) < parseInt(compareYear))
        {
            return 1
        }
    }
    return monthCompare(inputMonth, inputDay, compareMonth, compareDay, desired)
}

function monthCompare(inputMonth, inputDay, compareMonth, compareDay, desired) {
    var months = ["january", "february", "march", "april", "may", "june", "july", "august", "october", "november", "december"]

    var inputMonthValue
    var compareMonthValue

    if (inputMonth != "")
    {
        if (!parseInt(inputMonth))
        {
            var keepLooping = true
            for (var i = 0; i < months.length; i++)
            {
                if (months[i].includes(inputMonth) && keepLooping)
                {
                    inputMonthValue = i
                    keepLooping = false
                }
            }
        }
        else
        {
            inputMonthValue = parseInt(inputMonth) - 1
        }

        //Determine the number associated with the month string
        for (var i = 0; i < months.length; i++)
        {
            if (months[i].includes(compareMonth))
            {
                compareMonthValue = i
            }
        }

        if (inputMonthValue > compareMonthValue)
        {
            return 0
        }
        else if (inputMonthValue < compareMonthValue)
        {
            return 1
        }
    }
    
    return dayCompare(inputDay, compareDay, desired)
}

function dayCompare(inputDay, compareDay, desired) {
    if (inputDay != "")
    {
        if (parseInt(inputDay) > parseInt(compareDay))
        {
            return 0
        }
        else if (parseInt(inputDay) < parseInt(compareDay))
        {
            return 1
        }
    }

    if (desired == "above")
    {
        return 1
    }
    else if (desired == "below") 
    {
        return 0
    }
}