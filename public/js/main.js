//These add selectors for the delete buttons, todo items themselves, and the button to mark things complete
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')



//These three scripts add event listeners to each of the rendered items on the page, looping through an array of all current elements that are displayed on the DOM - - - - - - - - - - - - - - - - -
Array.from(deleteBtn).forEach((el)=>{
    //Takes the element, and adds a click event listener to run the deleteTodo (DELETE) function
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    //Takes the element, and adds a click event listener to run the markComplete (PUT) function
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    //Takes the element, and adds a click event listener to run the undo (PUT) function
    el.addEventListener('click', undo)
})
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


//Async function making a server request when delete buttons are pressed in the DOM
async function deleteTodo(){
    //Gets the data to send to the server from the list item span for this button's parent element
    const todoText = this.parentNode.childNodes[1].innerText
    //Runs first, and if completed skips the catch script below
    try{
        //Makes the feth response to the server on the deleteTodo route
        const response = await fetch('deleteTodo', {
            //Specifies the method of the request (delete in this case as opposed to get (which is the default))
            method: 'delete',
            //Specifies to the server what kind of data it is being sent
            headers: {'Content-type': 'application/json'},
            //Creates the body of our request object from our information in JSON format
            body: JSON.stringify({
                //Random crazy parameter name, but is used by the server to get the correct document from the database
                'rainbowUnicorn': todoText
            })
        })
        //Awaits the resolution of the fetch request and parses it into a json
        const data = await response.json()
        //Logs the data and then makes a new get request for the user
        console.log(data)
        location.reload()
    //Runs if the try is not successful, throwing an error to the browser's console
    }catch(err){
        console.log(err)
    }
}

//Async function which updates specific documents when items are pressed in the DOM (PUT request)
async function markComplete(){
    //Pulls the information for the request from the DOM by accessing the li element's data
    const todoText = this.parentNode.childNodes[1].innerText
    //Runs first
    try{
        //Makes a request to the server
        const response = await fetch('markComplete', {
            //Specifies a PUT request instead of GET, which is default
            method: 'put',
            //Tells server to expect JSON data
            headers: {'Content-type': 'application/json'},
            //Sets body of request using the data from the DOM
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //Awaits the resolution of the fetch request and parses it into a json
        const data = await response.json()
        //Logs the data and then makes a new get request for the user
        console.log(data)
        location.reload()
    //Runs if the try is not successful, throwing an error to the browser's console
    }catch(err){
        console.log(err)
    }
}

//Async function which does the same as markComplete, but with a different route when it hits the server
async function undo(){
    //Grabs name of todo item from the DOM based on which button is pressed
    const todoText = this.parentNode.childNodes[1].innerText
    //Runs first as a promise
    try{
        //Make PUT request to server to update a document in the database collection
        const response = await fetch('undo', {
            //Specifies this request is a PUT request
            method: 'put',
            //Specifies for the server to anticipate JSON data
            headers: {'Content-type': 'application/json'},
            //Builds the body of the request using the data this function grabbed from the DOM
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //Awaits the resolution of the fetch request and parses it into a json
        const data = await response.json()
        //Logs the data and then makes a new get request for the user
        console.log(data)
        location.reload()
    //Runs if the try is not successful, throwing an error to the browser's console
    }catch(err){
        console.log(err)
    }
}