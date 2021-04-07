// DOM variables
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// Event listeners for each delete button
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// Event listeners for each todo item to mark complete
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// Event listeners for each todo item to mark uncomplete
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// Function to remove todo item from list
async function deleteTodo(){
    // Variable for the todo item text in the DOM
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch for when user clicks the delete button
        const response = await fetch('deleteTodo', {
            // Tells our server to make a delete request
            method: 'delete',
            // Honestly not sure, tells the server to look for JSON?
            headers: {'Content-type': 'application/json'},
            // Puts our todo text into a string so that our server can read it
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // Waits for JSON from server
        const data = await response.json()
        console.log(data)
        // Refresh page
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// Function to mark through our todo item
async function markComplete(){
    // Variable for the item text in the DOM
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch that handles when the user clicks the todo item
        const response = await fetch('markComplete', {
            // Tells the server to make a PUT request
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

// Same as above, but acts on items already marked through
async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // Fetch that handles when user clicks on a marked-through todo item
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