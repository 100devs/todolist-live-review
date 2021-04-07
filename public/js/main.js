// The variable deleteBtn is to grab the items with the class .del
const deleteBtn = document.querySelectorAll('.del')
// This variable grabs items with the classes .todoItem AND span
const todoItem = document.querySelectorAll('.todoItem span')
// This variable looks for items with the classes .todoItem AND span.completed
const todoComplete = document.querySelectorAll('.todoItem span.completed')


// After grabbing all items with the class .del, the code below pushes them into an array. 
// It runs a forEach method, and for each item, it adds the eventListener click and initiates 
// the deleteTodo function
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// Like above, but it creates array for the todoItem items and initiates the markComplete function
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// Creates array for todoComplete items and initiates the undo function
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})


// This is the function used to delete items from the body.
async function deleteTodo(){
// Below is a variable created to grab the item chosen. I STILL DONT UNDERSTAND THIS
    const todoText = this.parentNode.childNodes[1].innerText
// Because it's an async function, we run the try and catch
    try{
// here we create the fetch with await because it's in an async function. We use the directory
// deleteTodo. It is then called on in the app.delete so the name is important. We create an object
// as well.
        const response = await fetch('deleteTodo', {
// This is the type of method it is. Since it's to delete an item, we use delete
            method: 'delete',
// This I DONT UNDERSTAND
            headers: {'Content-type': 'application/json'},
// This I DONT UNDERSTAND, but i think it's just turning the json into a string??? I do know that
// the object created inside has the property rainbowUnicorn, which is called on the app.delete
// with deleteOne({ todo: request.body.rainbowUnicorn })
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
// Below is the data brought by the response.json object. 
        const data = await response.json()
        console.log(data)
// This refreshes the page. Don't fully understand the code, but i know what it does.
        location.reload()
    }catch(err){
        console.log(err)
    }
}

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