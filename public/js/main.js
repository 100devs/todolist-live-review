const deleteBtn = document.querySelectorAll('.del') //assigns classes to variables for use with eventlisteners
const todoItem = document.querySelectorAll('.todoItem span')//assigns classes to variables for use with eventlisteners
const todoComplete = document.querySelectorAll('.todoItem span.completed')//assigns classes to variables for use with eventlisteners

Array.from(deleteBtn).forEach((el)=>{ //eventlisteners to allow Dom interaction
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{//eventlisteners to allow Dom interaction
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{ //eventlisteners to allow Dom interaction
    el.addEventListener('click', undo)
})

async function deleteTodo(){ //deletes a toDo
    const todoText = this.parentNode.childNodes[1].innerText //assigns the string located in the first childNode of the li to "todoText"
    try{
        const response = await fetch('deleteTodo', {  //unknown ... a promise I think sending a object back to the server telling it what to delete
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText // assigns toDoText to 'rainbowUnicorn' and sends it back as Json to /deleteToDo
            })
        })
        const data = await response.json() //no idea
        console.log(data)
        location.reload() //reloads the root
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText //assigns the string located in the first childNode of the li to "todoText"
    try{
        const response = await fetch('markComplete', { //returns put response to /markcomplete?
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText // assigns toDoText to 'rainbowUnicorn' and sends it back as Json to /markcomplete
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
        const response = await fetch('undo', { //confused about these fetch functions.
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