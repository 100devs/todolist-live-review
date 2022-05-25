const deleteBtn = document.querySelectorAll('.del')//grab all delete buttons in todolist
const todoItem = document.querySelectorAll('.todoItem span')//grab all incomplete todo items in todolist
const todoComplete = document.querySelectorAll('.todoItem span.completed')//grab all completed items in todolist

Array.from(deleteBtn).forEach((el)=>{//cycle through nodeList of all todolist delete buttons
    el.addEventListener('click', deleteTodo)//on click of delete button, call function deleteTodo
})

Array.from(todoItem).forEach((el)=>{//cycle through all incomplete todolist items
    el.addEventListener('click', markComplete)//on click of item, call function markComplete
})

Array.from(todoComplete).forEach((el)=>{//cycle through completed todolist items
    el.addEventListener('click', undo)//on click of item, call undo function
})

async function deleteTodo(){//function linked with delete button, deletes todolist item
    const todoText = this.parentNode.childNodes[1].innerText//gets text from todolist item
    try{
        const response = await fetch('deleteTodo', {//send delete request to server
            method: 'delete',//sets method for request
            headers: {'Content-type': 'application/json'},//sets headers for request
            body: JSON.stringify({//creates and sends body to server with the request
                'rainbowUnicorn': todoText //poorly named variable, used to store todolist item's text content
            })
        })
        const data = await response.json()//waits for response from server and parses res into object
        console.log(data)//logs data received from server
        location.reload()//refreshes the webpage to display up to date todolist
    }catch(err){//if an error in the try block, log the error
        console.log(err)
    }
}

async function markComplete(){//function linked with incomplete todolist items
    const todoText = this.parentNode.childNodes[1].innerText//finds text content of clicked item
    try{//attempt this code block
        const response = await fetch('markComplete', {//sends put request to server
            method: 'put',//method of request
            headers: {'Content-type': 'application/json'},//sets headers of request
            body: JSON.stringify({//sends text content of item to find relevant document in database
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()//server should respond with a json object on success, convert json to object
        console.log(data)//logs data from server on successful request
        location.reload()//refreshes webpage to show updated todolist
    }catch(err){//if error in try block, log error to console
        console.log(err)
    }
}

async function undo(){//function linked with completed todolist items
    const todoText = this.parentNode.childNodes[1].innerText//finds text content of clicked item
    try{
        const response = await fetch('undo', {//submits a put request to server
            method: 'put',//method of request
            headers: {'Content-type': 'application/json'},//headers of request, lets server know type of content sent in request
            body: JSON.stringify({//data sent in request to server, json data sent to server
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()//waits for response from server, parses and stores response into variable
        console.log(data)//logs response from server
        location.reload()//refreshes page to show changes in todolist
    }catch(err){
        console.log(err)//logs error if there was an error in the try block
    }
}