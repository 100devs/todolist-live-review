// grabbing stuff from the DOM and storing in variables
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// putting all grabbed stuff in arrays, setting up the smurfs to listen and execute functions
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})
//setting up async sintax function to handle the delete request
async function deleteTodo(){
    // grab the text from the DOM and put in variable
    const todoText = this.parentNode.childNodes[1].innerText
    // try this, if doesn't work catch that
    try{
        // setting up fetch promise, delete method, type of content, getting the doc from the DOM in json format
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            // make it a string to compare
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //await to send json response
        const data = await response.json()
        // log the data
        console.log(data)
        // reload page
        location.reload()
        // show us the error
    }catch(err){
        console.log(err)
    }
}
//setting up async sintax function to handle the update request
async function markComplete(){
    // grab the text from the DOM and put in variable
    const todoText = this.parentNode.childNodes[1].innerText
    // try this, if doesn't work catch that
    try{
        // setting up fetch promise, put method, type of content, getting the doc from the DOM in json format
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            // make it a string to compare
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //await to send json response
        const data = await response.json()
        // log the data
        console.log(data)
        // reload page
        location.reload()
        // show us the error
    }catch(err){
        console.log(err)
    }
}
//setting up async sintax function to handle the other update request that undo the previous one
async function undo(){
    // grab the text from the DOM and put in variable
    const todoText = this.parentNode.childNodes[1].innerText
    // try this, if doesn't work catch that
    try{
        // setting up fetch promise, put method, type of content, getting the doc from the DOM in json format
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            // make it a string to compare
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //await to send json response
        const data = await response.json()
        // log the data
        console.log(data)
        // reload page
        location.reload()
        // show us the error
    }catch(err){
        console.log(err)
    }
}