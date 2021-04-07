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


// This is the function 
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