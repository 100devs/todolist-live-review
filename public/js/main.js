const deleteBtn = document.querySelectorAll('.del') //variable set to select all the classes named .del in the document
const todoItem = document.querySelectorAll('.todoItem span') //variable set to select all the spans with .todoItem in the document
const todoComplete = document.querySelectorAll('.todoItem span.completed') //variable set to select all the spans with .todoItem and .completed in the document

//adds event listener to every delete button
Array.from(deleteBtn).forEach((el)=>{//creates an array of all delete buttons and binds event listenter
    el.addEventListener('click', deleteTodo)//click event added to delete buttons
})

//adds event listener to every item that is incomplete
Array.from(todoItem).forEach((el)=>{//creates an array of all incomplete items and binds event listener
    el.addEventListener('click', markComplete)//click event added to incomplete items
})

//adds event listener to every item that is complete
Array.from(todoComplete).forEach((el)=>{//creates an array of all complete items and binds event listener
    el.addEventListener('click', undo)//click event added to complete items
})

//deletes a todo item
async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText//grabs first span from li and takes text from the span
    try{
        const response = await fetch('deleteTodo', {//route that our server is on
            method: 'delete',//sends delete method
            headers: {'Content-type': 'application/json'},//sends the header how data is formated
            body: JSON.stringify({
                'rainbowUnicorn': todoText//sends request body as json 
            })
        })
        const data = await response.json()//grabs response from fetch
        console.log(data)
        location.reload()//reloads page when successful
    }catch(err){
        console.log(err)//throws an error if unsuccessful
    }
}

//marks a todo item as complete
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText//grabs first span from li and takes text from the span
    try{
        const response = await fetch('markComplete', {//route that our server is on
            method: 'put',//sends put method
            headers: {'Content-type': 'application/json'},//sends the header how data is formated
            body: JSON.stringify({
                'rainbowUnicorn': todoText//sends request to body as json
            })
        })
        const data = await response.json()//grabs response from fetch
        console.log(data)
        location.reload()//reloads page when successful
    }catch(err){
        console.log(err)//throws an error if unsuccessful
    }
}

//changes todo item from complete to incomplete
async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText//grabs first span from li and takes text from the span
    try{
        const response = await fetch('undo', {//route that server is on
            method: 'put',//sends put method
            headers: {'Content-type': 'application/json'},//sends the header how data is formated
            body: JSON.stringify({
                'rainbowUnicorn': todoText//sends request to body as json
            })
        })
        const data = await response.json()//grabs response from fetch
        console.log(data)
        location.reload()//reloads page when successful
    }catch(err){
        console.log(err)//throws an error if unsuccessful
    }
}