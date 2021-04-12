// set up the delete, todo, and todo completed buttons
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// create a new array from the deleteTodo elements
Array.from(deleteBtn).forEach((el) => {
    // call deleteTodo on delete class elelemts
    el.addEventListener('click', deleteTodo)
})
// create a new array from the markComplete elements
Array.from(todoItem).forEach((el) => {
    // call markComplete on todoItem class and span sibling element
    el.addEventListener('click', markComplete)
})
// create a new array from the undo elements
Array.from(todoComplete).forEach((el) => {
    // call undo on .todoItem span.completed siblings elemetns
    el.addEventListener('click', undo)
})
// function to delete todo items
async function deleteTodo() {
    // assign the inner text of the second child node to todoText
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        // wait for the response from deleteTodo
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // store the response json data
        const data = await response.json()
        console.log(data)
        // reload the current page
        location.reload()
    } catch (err) {
        // log any error caught in this block 
        console.log(err)
    }
}
// function to mark items as complete
async function markComplete() {
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        // wait for the response from markCmplete 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            // convert server json data to string 
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // store the response json data
        const data = await response.json()
        console.log(data)
        // reload the current page
        location.reload()
    } catch (err) {
        // log any error cauught in this block
        console.log(err)
    }
}
// function to undo an action on the client side
async function undo() {
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        // wait for the response from undo
        const response = await fetch('undo', {
            // carry out a put request
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            // convert server data to string
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        // log json data to the console
        console.log(data)
        // reload the current page
        location.reload()
    } catch (err) {
        // log any caught error within this block
        console.log(err)
    }
}