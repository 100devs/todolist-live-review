//assign a nodeList for delete buttons
const deleteBtn = document.querySelectorAll('.del')
//assign a nodeList for uncompleted todos
const todoItem = document.querySelectorAll('.todoItem span')
//assign a nodeList for completed todos
const todoComplete = document.querySelectorAll('.todoItem span.completed')
//add event listeners to all deleteBtns
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
//add event listeners to all uncompleted todos
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//add event listeners to all completed todos
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})



//define an async function to delete todos
async function deleteTodo(){
  //grab the inner text from the first child (span) of the container (li) 
    const todoText = this.parentNode.childNodes[1].innerText
    try{
      //try a fetch (it's never gonna happennnnnn!)
      //send a DELETE request to the server
        const response = await fetch('deleteTodo', {
          //specify the method
            method: 'delete',
            //specify the header (json)
            headers: {'Content-type': 'application/json'},
            //specify the body - set it to the innerText grabbed from the span
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //receive and log the response
        const data = await response.json()
        console.log(data)
        //reload the page
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
  //grab the inner text from the first child (span) of the container (li) 
    const todoText = this.parentNode.childNodes[1].innerText
    try{
      //send a PUT request to the server
        const response = await fetch('markComplete', {
          //specify the method
            method: 'put',
            //headers
            headers: {'Content-type': 'application/json'},
            //and the body - setting it to the text grabbed before
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //recieve and log the response data
        const data = await response.json()
        console.log(data)
        //reload the page
        location.reload()
    }catch(err){
        console.log(err)
    }
}
//same as ^^^ but reversed - this will only run onClick of todos that are marked as completed
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