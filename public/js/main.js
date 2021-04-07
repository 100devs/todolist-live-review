// set constant for all elements with class = "del", for what we'll use to delete items with
const deleteBtn = document.querySelectorAll('.del')
// set constant for all span elements under an element with class "todoItem", for the text within 
const todoItem = document.querySelectorAll('.todoItem span')
// set constant for all spans with class "completed" that are within an element with class "todoItem"
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// set up event listeners
// for deleting
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// for marking an item complete
Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

// for marking an item incomplete
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// asynchronous function to delete a todo
async function deleteTodo() {
// get the text of the the todo-- set to the innerText of the second child node within the parent of the delete button that triggered it
    const todoText = this.parentNode.childNodes[1].innerText
    try{
// use fetch to call the deleteTodo
    const response = await fetch('deleteTodo', {
// method is delete
            method: 'delete',
// send the content as JSON
            headers: { 'Content-type': 'application/json' },
// get the todoText from above, assign it to the name 'rainbowUnicorn', then put in JSON format, and send it as the body
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
// use a promise to set data as the JSON response
        const data = await response.json()
// log data to the console
        console.log(data)
// refresh the page so we see the change
        location.reload()
    }catch(err){
// log an error if any
        console.log(err)
    }
}

// asynchronous function to mark a todo complete
async function markComplete() {
// same as above
    const todoText = this.parentNode.childNodes[1].innerText
    try{
// use fetch to call the markComplete
        const response = await fetch('markComplete', {
// this time using the "put" method to make an update
            method: 'put',
// send the content as JSON
            headers: { 'Content-type': 'application/json' },
// get the todoText from above, assign it to the name 'rainbowUnicorn', then put in JSON format, and send it as the body
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
// use a promise to set data as the JSON response
        const data = await response.json()
// log data to the console
        console.log(data)
// refresh the page so we see the change
        location.reload()
    }catch(err){
// log an error if any
        console.log(err)
    }
}

// asynchronous function to mark a todo INcomplete
async function undo(){
// same as above
    const todoText = this.parentNode.childNodes[1].innerText
    try{
// use fetch to call the undo
        const response = await fetch('undo', {
// this time using the "put" method to make an update
            method: 'put',
// send the content as JSON
            headers: {'Content-type': 'application/json'},
// get the todoText from above, assign it to the name 'rainbowUnicorn', then put in JSON format, and send it as the body
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
// use a promise to set data as the JSON response
        const data = await response.json()
// log data to the console
        console.log(data)
// refresh the page so we see the change
        location.reload()
    }catch(err){
// log an error if any
        console.log(err)
    }
}