//creates a variable to store the delete button
const deleteBtn = document.querySelectorAll('.del')
//creates a variable to store the text of a todo item
const todoItem = document.querySelectorAll('.todoItem span')
//creates a variable to store the text of a todo item with class completed
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//create an array that contains each delete button in the DOM
//loop through that array to add an event listener to every one
Array.from(deleteBtn).forEach((el)=>{
    //call the deleteTodo function on click event
    el.addEventListener('click', deleteTodo)
})
//create an array that contains each todo item in the DOM
//loop through that array to add an event listener to every one
Array.from(todoItem).forEach((el)=>{
    //call the markComplete function on click event
    el.addEventListener('click', markComplete)
})
//create an array that contains each todo item with class complete
//loop through that array to add an event listener to each one
Array.from(todoComplete).forEach((el)=>{
    //call the undo function on click event
    el.addEventListener('click', undo)
})
//declare asynchronous function called deleteTodo
async function deleteTodo(){
    //constant variable with some syntax i don't know yet to get the text of the todo item
    const todoText = this.parentNode.childNodes[1].innerText
    //function will try to do this before moving forward
    try{
        //variable response is the eventual return value of a fetch from the database
        const response = await fetch('deleteTodo', {
            //request type
            method: 'delete',
            //header syntax, not sure what this does
            headers: {'Content-type': 'application/json'},
            //not quite sure but has something to do with JSON object notation and making everything strings; accessing the 'rainbowUnicorn' property and its text??
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //variable data contains the json response from the fetch request (?)
        const data = await response.json()
        //console log that json response
        console.log(data)
        //reload the page
        location.reload()
    }catch(err){ // if failed catch the error
        //console log error
        console.log(err)
    }
}
//declare asynchronouse function called markComplete
async function markComplete(){
    //variable with some unfamiliar syntax
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //response variable contains the eventual response from a fetch request
        const response = await fetch('markComplete', {
            //request type
            method: 'put',
            //header syntax mumbo-jumbo
            headers: {'Content-type': 'application/json'},
            //putting the stuff in the right format?
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //data contains the eventual result from fetch request
        const data = await response.json()
        //console log this data
        console.log(data)
        //reload the page
        location.reload()
    }catch(err){ // if the function doesn't work, catch the error
        //console log the error
        console.log(err)
    }
}
//asynchronouse function to undo a completed todo item
async function undo(){
    //variable with unfamiliar syntax
    const todoText = this.parentNode.childNodes[1].innerText
    //function will try this first before logging an error
    try{
        //response variable contains the eventual result of a fetch request
        const response = await fetch('undo', {
            //request type
            method: 'put',
            //header syntax, unfamiliar
            headers: {'Content-type': 'application/json'},
            //some kind of formatting of the body request object
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //data contains the eventual result from fetch request
        const data = await response.json()
        //console log the data
        console.log(data)
        //reload the page
        location.reload()
    }catch(err){//if that previous try didn't work, catch the error
        //console log the error
        console.log(err)
    }
}
