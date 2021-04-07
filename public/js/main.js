const deleteBtn = document.querySelectorAll('.del') //sets variable for all elements with del class
const todoItem = document.querySelectorAll('.todoItem span') //sets variable for all the span elements under .todoItem class
const todoComplete = document.querySelectorAll('.todoItem span.completed') //sets variable for all the span elements with the completed class

//makes an eventlistner for all the delete buttons
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
//makes an eventlistner for all the items in todoItem
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//makes an eventlistner for all items in todoComplete
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

//function declaration
async function deleteTodo(){
    //declares variable to the text in this node
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //api call to deleteToDo
        const response = await fetch('deleteTodo', {
            //which method to perform
            method: 'delete',
            //how the data passed should be parsed
            headers: {'Content-type': 'application/json'},
            //the data to pass along
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //response from fetch
        const data = await response.json()
        //logging the data sent back
        console.log(data)
        //reloading current url
        location.reload()
        //catches error if any
    }catch(err){
        console.log(err)
    }
}

//function declaration
async function markComplete(){
    //declares variable to the text in this node
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //api call
        const response = await fetch('markComplete', {
            //which method to use
            method: 'put',
            //how the data passed should be parsed
            headers: {'Content-type': 'application/json'},
            //the data to pass along
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //response from fetch
        const data = await response.json()
        //logging data send back
        console.log(data)
        //reloading current url
        location.reload()
        //catching error if any
    }catch(err){
        console.log(err)
    }
}
// function declaration
async function undo(){
     //declares variable to the text in this node
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        //api call
        const response = await fetch('undo', {
            //which method to use
            method: 'put',
            //how data should be parsed
            headers: {'Content-type': 'application/json'},
            //data to be sent
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //response from fetch
        const data = await response.json()
        //logging of data sent back
        console.log(data)
        //reloading current url
        location.reload()
        //catch error if any
    }catch(err){
        console.log(err)
    }
}