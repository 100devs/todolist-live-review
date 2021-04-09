// Variable that will select all of our htmk elements with the 'del' class 
const deleteBtn = document.querySelectorAll('.del')
// Variable that will contain all the spans of the todoItem class 
const todoItem = document.querySelectorAll('.todoItem span')
// Variable that contains all the spans of todoItems that also have the 'completed' class
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// Creating an array with all of the html elements that has the '.del' class from above and adding an event listener that will trigger on a click to run a function 'deleteTodo'
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// Creating an array filled with all the html span elements that were selected within .todoItem, creating an event listener, and running it after a click-event with the function 'markComplete'
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// Creating an event listener and placing all of our todos with the class of 'complete' into an array. The event listener will then run the 'undo' function after a click event.
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// function that will run if we click on 'Delete' on our client-side device
async function deleteTodo(){
    // Variable declared to contain the node or our line of text of that relevent todo 
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Making a fetch to our database and containing that information in a variable called 'response'
        const response = await fetch('deleteTodo', {
            // The request method
            method: 'delete',
            // What we're telling the format of the information we're sending back is
            headers: {'Content-type': 'application/json'},
            // Sending a request body back with our fetch
            body: JSON.stringify({
                // Property that has the value of the text next to our delete element
                'rainbowUnicorn': todoText
            })
        })
        // Grabbing any information that might be received from the response and containing it in the variable 'data'
        const data = await response.json()
        // Logging whatever data we get back into the console
        console.log(data)
        // Reloard the page in the browser
        location.reload()
    }catch(err){
        // Logging any errors that might occur into the console
        console.log(err)
    }
}

// The function that will run when we mark our todos as complete
async function markComplete(){
    // Creating a variable called 'todoText' that contains the in-line text of the todo we're targeting during our click event
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Sending a fetch request to our database to look for any matches set to the value of what we declared for 'todoText' so that we can mark it complete
        const response = await fetch('markComplete', {
            // The type of fetch request we're making, in this case 'put'
            method: 'put',
            // The format of information attached to the fetch
            headers: {'Content-type': 'application/json'},
            // Property that has the value of the text next to our delete element
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // Creating a variable called 'data' that will include any data that might be tied to the response
        const data = await response.json()
        // Logging our data variable above
        console.log(data)
        // Reloading the page
        location.reload()
    }catch(err){
        // Log any errors that might occur in the console
        console.log(err)
    }
}

// The function that will run when we want to undo or mark one of our previously completed todos as incomplete. 
async function undo(){
    // Variable that contains and refers to the span element in the todo line we're targeting for any sort of change.
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Changing the fetch name to easily distinguish the different put requests we made in the app
        const response = await fetch('undo', {
            // Method type that we're stating in our fetch
            method: 'put',
            // Specifying what kind of format our data is in
            headers: {'Content-type': 'application/json'},
            // Sending over the matching text in our fetch
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // Creating a variable that contains our await response
        const data = await response.json()
        // Logging that data variable in our console
        console.log(data)
        // Telling the current browser page to re-render or reload
        location.reload()
    }catch(err){
        // Log any errors that might occur in the console
        console.log(err)
    }
}