//grabbin' our delete button from dom
const deleteBtn = document.querySelectorAll('.del')
//defining our item spans from li
const todoItem = document.querySelectorAll('.todoItem span')
//defining the "complete" items spans in dom
const todoComplete = document.querySelectorAll('.todoItem span.completed')
//makes an array from all delete buttons and adds a listener to each, runs deleteTodo() on click
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
//makes an array from all todoItems and adds a listener to each, runs markComplete() on click
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//makes an array from all complete items and adds a listener to each, runs undo() on click
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

//async function that makes delete request from client to API
async function deleteTodo(){
//grabs text of item you want to delete from the dom
    const todoText = this.parentNode.childNodes[1].innerText
//I don't know what try does...must be part of async syntax
    try{
//"response" will be awaiting fetch--> two perams, request is deleteTodo() and response is an object including body using JSON.stringify()
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
//"data" will await "response" above returning in .json()
        const data = await response.json()
        console.log(data)
        location.reload()
//catch errs
    }catch(err){
        console.log(err)
    }
}
//another async function, this time requests an edit/put
async function markComplete(){
//item to grab from dom and change
    const todoText = this.parentNode.childNodes[1].innerText
    try{
//response awaits fetch-->request uses markComplete(), response is an object
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
//data is waiting for .json response
        const data = await response.json()
//then you can log data
        console.log(data)
        location.reload()
//err catch!
    }catch(err){
//log the errs you catch!
        console.log(err)
    }
}
//do it all again.  This time the async function runs a put request for undo()
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