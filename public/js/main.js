// store the elements that will have event listeners into variables
// the delete element
const deleteBtn = document.querySelectorAll('.del')
// the spans without completed class
const todoItem = document.querySelectorAll('.todoItem span')
// the spans with the completed class
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//loop trough the arrays and add event listeners to all those elements
Array.from(deleteBtn).forEach((el)=>{
    // delete function for the delete element
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    // mark complete to non completed todos
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    // undo completion of a todo
    el.addEventListener('click', undo)
})

// function that will make the delete request to our server when we click delete
async function deleteTodo(){
    // since we are in a click event, we get access to this. this is the span, we go up into the li, then to the first childNode, get the text inside it, store it in a variable
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // variable that will store the response from a fetch request
        // give fetch whatever name will be part of our API. fetch can also take in an object, where we tell it all the stuff about the fetch we are about to make 
        const response = await fetch('deleteTodo', {
            // method we are gonna use
            method: 'delete',
            // send headers, we tell it how the data is formatted, content-type : application/json
            headers: {'Content-type': 'application/json'},
            // send a request body with our fetch, stringify takes in an object we call it whatever, 'rainbowUnicorn' and store the innerText from earlier into that key 
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // put any response from that fetch into const and console log it
        const data = await response.json()
        console.log(data)
        // refresh the page to make a new get
        location.reload()
    }catch(err){
        console.log(err)
    }
}

// function that will make the put request to our server when we click an uncompleted span
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
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