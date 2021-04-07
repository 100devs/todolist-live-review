const deleteBtn = document.querySelectorAll('.del') //select all items with del class
const todoItem = document.querySelectorAll('.todoItem span') //select all items with todoitem class and that are spans
const todoComplete = document.querySelectorAll('.todoItem span.completed') //select all items with del class

Array.from(deleteBtn).forEach((el)=>{ //get the array from deleteBTn and cycle through them
    el.addEventListener('click', deleteTodo) //add event listener to each of the items and set a function on click
})

Array.from(todoItem).forEach((el)=>{ //get the array from todoItem and cycle through them
    el.addEventListener('click', markComplete) //add event listener to each of the items and set a function on click
})

Array.from(todoComplete).forEach((el)=>{ //get the array from todoComplete and cycle through them
    el.addEventListener('click', undo) //add event listener to each of the items and set a function on click
})

async function deleteTodo(){ // start a aync function to delete todo
    const todoText = this.parentNode.childNodes[1].innerText // get the text of the sibling of the element that was clicked
    try{ //try block in case we get an error
        const response = await fetch('deleteTodo', { //sending a post to a function on the server to delete todo
            method: 'delete', //telling what we want to do
            headers: {'Content-type': 'application/json'}, // identifying the type of file
            body: JSON.stringify({ //taking the body and changing it to a json string?
                'rainbowUnicorn': todoText //sending the innner text that the server will use to find the todo to delete
            })
        })
        const data = await response.json() // awaiting for the response and changing it to a json object
        console.log(data) //logging the response
        location.reload() //reloading the page
    }catch(err){ //catch an error
        console.log(err) //log an error
    }
}

async function markComplete(){ //async function to mark items complete
    const todoText = this.parentNode.childNodes[1].innerText // get the 2nd element's innertext 
    try{ //try in case we get an error
        const response = await fetch('markComplete', { //sending a post to update a todo
            method: 'put', //telling what we want to do
            headers: {'Content-type': 'application/json'}, // identifying the file type
            body: JSON.stringify({ //changing to a json string
                'rainbowUnicorn': todoText // passing the identifier
            })
        })
        const data = await response.json() //wating for response
        console.log(data) //logging it
        location.reload() // reloading the page
    }catch(err){ //catch if there is an error
        console.log(err) //logging an error
    }
}

async function undo(){ //async function to change completed back to false
    const todoText = this.parentNode.childNodes[1].innerText //get's the inner text of the 2nd child of the parent of the clicked element
    try{ //just in case of errors
        const response = await fetch('undo', { // posting to update a value
            method: 'put', //telling what we want to do
            headers: {'Content-type': 'application/json'}, // telling what file type it is
            body: JSON.stringify({ // turning it into a json string
                'rainbowUnicorn': todoText // pass the value that will be the identifier
            })
        })
        const data = await response.json() //waiting for the response
        console.log(data) //logging the response
        location.reload() //reloading the page
    }catch(err){ // catch in case of error
        console.log(err) //logging error
    }
}