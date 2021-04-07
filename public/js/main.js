//assigning data for our delete button
const deleteBtn = document.querySelectorAll('.del')
//assigning data for our unfinished todo items
const todoItem = document.querySelectorAll('.todoItem span')
//assigning data for our completed todo items
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//event listener for delete button
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

//event listener for incomplete to complete tasks
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

//event listener for complete to incomplete tasks
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

//aync/await function for deleting tasks
async function deleteTodo(){
    //grabbing text from the child of our list
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //sends a delete request to the server
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //receives the json response and reloads our page
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

//async/await function for marking a task complete
async function markComplete(){
    //grabs text from the child of our list
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //put request sent to server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //recieves our json data and reloads our page
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

//async/await function for marking complete tasks to incomplete
async function undo(){
    //grabs text from the child of our list
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //put request sent to server
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //receives json response and reloads our page
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}
