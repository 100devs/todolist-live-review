// assigned constants for deleting, the item span, and the completed item span
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// event listener for deleting the item from the array
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// event listener for marking the item as complete from the array
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// event listener for undoing the item as complete from the array
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// function for sending a delete request to the server
async function deleteTodo(){
    // assigns the span text in the array as the constant todoText
    const todoText = this.parentNode.childNodes[1].innerText
    // fetchs the delete method request formatted as a json file, and then reloads the page as a get
    // otherwise, gives an error message in the console
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

// function for marking an item as complete
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // same as deleteTodo, but uses a 'put' method instead
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
        // same as markComplete
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