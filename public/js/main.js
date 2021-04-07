//This is the user side js file. The one the user can see

//Catches that delete button
const deleteBtn = document.querySelectorAll('.del')
//Saves the task inside a variable
const todoItem = document.querySelectorAll('.todoItem span')
//Saves the completed tasks inside another variable
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//We set the listeners (smurfs) fot the delete buttons
Array.from(deleteBtn).forEach((el)=>{
    //If you click a delete button, it'll trigger the deleteTodo function
    el.addEventListener('click', deleteTodo)
})

//It set's the listeners to each task
Array.from(todoItem).forEach((el)=>{
  //If you click a task, it'll trigger the markComplete function
    el.addEventListener('click', markComplete)
})

//Sets the listeners to each complete task
Array.from(todoComplete).forEach((el)=>{
    //If you click a complete task, it'll trigger the undo function
    el.addEventListener('click', undo)
})

// This function deletes a task
async function deleteTodo(){
    //Retrieves the name of the task? (Don't know how or where from)
    const todoText = this.parentNode.childNodes[1].innerText
    // if it works (?)
    try{
        // I dont really know what is going on in this function
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

// THis function marks a task as complete
async function markComplete(){
    //Again fetches the text of the task (i think from the html)
    const todoText = this.parentNode.childNodes[1].innerText
    //No idea my dude. It just works.
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

// This function undoes the completion of a task (or restores a deleted task?)
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