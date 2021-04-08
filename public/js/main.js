// this is the main client side javascript file that provides the client side behaviour of our to do list application

const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// The three line above traverse through the dom and identify elements  that match the query selection passed through and store them in the respective variables created as node lists
// Line 3 looks for all elements with a class of .del
// Line 4 looks for all spans that are descendants of elements with a class of todoItem
// Line 5 looks for all spans with a class of completed that are descendants of elements with a class of todoItem


Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// Lines 13, 17, and 21 all do something similar. They each create an array from the node lists in lines 3 , 4 & 5. the array is looped through
// and each element is given an eventisltener that tells it which function should be run in the event the element in question has been clicked on.

async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// The function on line 28 is an async function i.e through the use of the async keyword we can make an asynchronous task run synchronously.
// This function is the clients side logic that starts off the deletion of entries in our db. In line 13 we see the eventlistener being added to spans with a .del class,
// when one of these is clicked it triggers off this function which using the fetch method sends a request back to the server with the delete method(line 32), it parses
// as json the inner text of the span containing the todo item and send this back to the server which then instructs the db to find an entry that matches the todo item text 
// and delete this. once this has been done the server responds with a message saying the  message has been deleted. once this message is received (line 38) the function logs
// this to the console and then reloads the page which triggers a get request which will render the html without the todo item that was clicked to set off this function.

async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// The functions on line 46 and 64 are both asynchronous as indicated by the async keyword. They make up the client side logic
// for our PUT requests as can be seen on lines 50 & 68 where the method is set as PUT. These functions let our server know when a task has been marked complete or incomplete
// When spans that are descendants of elements with a class of todoItem are clicked the mark complete function is triggered(line 46) the inner text of the span is stored as todoText
// and then parsed into json which is then sent to the server using the fetch method. the use of the await keyword on line 56(and line 67) tells our fetch function to ewait for the 
//promise to resolve. If the  promise reolves successfully, a message of task marked complete is received from the server and the browser is the refreshed which will then trigger 
// another fetch response and generate an updated html file to reflect the information stored in the database. When this happens the element clicked on to kick off the fetch
// will be rendered with a class of completed and a css rule is applied giving it an effect of being greyed out and crossed through

//The function on line 64 does the same thing but rather than instruct the server to edit the db entry to reflect that the task has been completed, 
//it requests the db entry be updated to reflect that the task is to be marked as incomplete. This will then also cause a reload of the page and the ejs to rerender.
// In this instance the span will not have a completed class attached and as such will render as anormal span with no css rule applied.
