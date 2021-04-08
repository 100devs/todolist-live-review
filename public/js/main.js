const deleteBtn = document.querySelectorAll('.del') //Grab all delete class.
const todoItem = document.querySelectorAll('.todoItem span') //Grab span inside class.
const todoComplete = document.querySelectorAll('.todoItem span.completed') //Grab span with completed class.

Array.from(deleteBtn).forEach((el)=>{ //Grab all delete in array. addEventListener to all.
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{ //Click on span, mark complete
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{ //Give all an EventListener
    el.addEventListener('click', undo)
})

async function deleteTodo(){ //Delete
    const todoText = this.parentNode.childNodes[1].innerText //Grab the text that's being deleted
    try{
        const response = await fetch('deleteTodo', { //send fecth
            method: 'delete', //method we are using
            headers: {'Content-type': 'application/json'}, //what info is being sent
            body: JSON.stringify({
                'rainbowUnicorn': todoText //object with body
            })
        })
        const data = await response.json() //Grab response
        console.log(data)
        location.reload()//if it works, reload page
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){ //Mark Complete
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { //send fetch
            method: 'put', //method we are using
            headers: {'Content-type': 'application/json'}, //what info is being sent
            body: JSON.stringify({
                'rainbowUnicorn': todoText //object with body
            })
        })
        const data = await response.json() //Grab repsonse
        console.log(data)
        location.reload()//if it works, reload page
    }catch(err){
        console.log(err)
    }
}

async function undo(){ //Undo complete
    const todoText = this.parentNode.childNodes[1].innerText //Undo
    try{
        const response = await fetch('undo', { //send fetch
            method: 'put', //method we are using
            headers: {'Content-type': 'application/json'}, //what info is being sent
            body: JSON.stringify({
                'rainbowUnicorn': todoText //object with body
            })
        })
        const data = await response.json() //Grab response
        console.log(data)
        location.reload() //if it works, reload page
    }catch(err){
        console.log(err)
    }
}
