// CREATE VARIABLES TO ACCESS HTML ELEMENTS
// deleteBtn connects to the html element that has the "del" class
const deleteBtn = document.querySelectorAll('.del')
// todoItem connects to the html element with the class "todoItem" that is in a span
const todoItem = document.querySelectorAll('.todoItem span')
// todoComplete connects to the html element with the class "todoItem" that is also in a span with the class "completed"
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// CREATE SMURFS AKA EVENT LISTENERS FOR EACH CLICKABLE
// listens for the html element connected to deleteBtn to be clicked
Array.from(deleteBtn).forEach((el)=>{
    // when deleteBtn element is clicked, run function deleteTodo
    el.addEventListener('click', deleteTodo)
})
// listens for the html element connected to todoItem to be clicked
Array.from(todoItem).forEach((el)=>{
    // when todoItem element is clicked, run function markComplete
    el.addEventListener('click', markComplete)
})
// listens for the html element connected to todoComplete to be clicked
Array.from(todoComplete).forEach((el)=>{
    // when todoComplete element is clicked, run function undo
    el.addEventListener('click', undo)
})

// FUNCTIONS REFERENCED BY SMURFS ABOVE
// create function called deleteTodo
async function deleteTodo(){
    // create variable that finds and stores the inner text of the second child of the parent
    // of the element being acted upon with the deleteTodo function, as catalyzed by the smurf above
    // AKA the html rendering of the todo item for which "Delete" was clicked
    const todoText = this.parentNode.childNodes[1].innerText
    // commence an attempt to...
    try{
        // wait for the response from a fetch request to the server
        const response = await fetch('deleteTodo', {
            // tell the server to talk to the database, making a delete request
            method: 'delete',
            // tell the server we're looking for some json
            headers: {'Content-type': 'application/json'},
            // chew on that json response, store the "todoText" variable in another one called "rainbowUnicorn" that the server will refer to
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // when the server responds, turn the response into json and put it in a variable called data
        const data = await response.json()
        // print the contents of "data" variable to the console
        console.log(data)
        // refresh the page so we can see that the item was deleted
        location.reload()
    // what to do if the try fails
    }catch(err){
        // print to the console whatever we can get about what went wrong
        console.log(err)
    }
}

async function markComplete(){
    // create variable that finds and stores the inner text of the second child of the parent
    // of the element being acted upon with the markComplete function, as catalyzed by the smurf above
    // AKA the html rendering of the todo item which was clicked 
    const todoText = this.parentNode.childNodes[1].innerText
    // commence an attempt to...
    try{
        // wait for the response from a fetch request to the server
        const response = await fetch('markComplete', {
            // tell the server to talk to the database, making a put (modify) request
            method: 'put',
            // tell the server we're looking for some json
            headers: {'Content-type': 'application/json'},
            // chew on that json response, store the "todoText" variable in another one called "rainbowUnicorn" that the server will refer to
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // when the server responds, turn the response into json and put it in a variable called data
        const data = await response.json()
        // print the contents of "data" variable to the console
        console.log(data)
        // refresh the page so we can see that the item was updated
        location.reload()
    // what to do if the try fails
    }catch(err){
        // print to the console whatever we can get about what went wrong
        console.log(err)
    }
}

async function undo(){
    // create variable that finds and stores the inner text of the second child of the parent
    // of the element being acted upon with the markComplete function, as catalyzed by the smurf above
    // AKA the html rendering of the todo item which was clicked 
    const todoText = this.parentNode.childNodes[1].innerText
        // commence an attempt to...
        try{
            // wait for the response from a fetch request to the server
        const response = await fetch('undo', {
            // tell the server to talk to the database, making a put (modify) request
            method: 'put',
            // tell the server we're looking for some json
            headers: {'Content-type': 'application/json'},
            // chew on that json response, store the "todoText" variable in another one called "rainbowUnicorn" that the server will refer to
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // when the server responds, turn the response into json and put it in a variable called data
        const data = await response.json()
        // print the contents of "data" variable to the console
        console.log(data)
        // refresh the page so we can see that the item was updated
        location.reload()
    // what to do if the try fails
    }catch(err){
        // print to the console whatever we can get about what went wrong
        console.log(err)
    }
}