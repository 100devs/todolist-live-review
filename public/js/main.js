//This allows us to grab our span with the class of "del". It will let us create an action when it is clicked
const deleteBtn = document.querySelectorAll('.del')

//this will allow us to grab our span in the todoItem li. allows us to get the span if it is not "completed"
const todoItem = document.querySelectorAll('.todoItem span')

//This allows us to grab our span with the class of "del". It will let us create an action when it is clicked
const todoComplete = document.querySelectorAll('.todoItem span.completed')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})
//this async function allows us to connect to the app.delete in server.js . it selects the li wthat matches the "delete" that was clicked on and sends all that info to server.js in order for our Delete (From CRUD) to fire. At the end, it reloads our page, and by doing so, requestes a GET (The C in CRUD)
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