//event listener for delete button
const deleteBtn = document.querySelectorAll('.del')
//event listener for todo  list
const todoItem = document.querySelectorAll('.todoItem span')
//event listener to check completed items
const todoComplete = document.querySelectorAll('.todoItem span.completed')
//creating loop to check each item to be able to delete
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
//loop being able to check if we can mark item complete
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//loop event to be able to undo completed status 
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})
//new function
async function deleteTodo(){
    //create variable for text in ejs
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //think i might know, trouble putting into words
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //need some help with this one
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}
//function to mark complete on list
async function markComplete(){
    //same us before. maybe make a global varibale to make this DRY
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //wait response to see if list is marked complete
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //not sure same as before
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function undo(){
    //need to make this DRY
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //check to see if we can undo line through text for completed task
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //ill try it, maybe waiting on data to be sent back to see what was done with it. whether completed, deleted or undo
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}