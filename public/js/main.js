const deleteBtn = document.querySelectorAll('.del') // selects all delete spans from index.ejs
const todoItem = document.querySelectorAll('.todoItem span') // selects all todoItem spans from index.ejs
const todoComplete = document.querySelectorAll('.todoItem span.completed') // selects all completed spans from index.ejs
// the next three code blocks add event listeners on the elements with the relevent callback functions
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

async function deleteTodo(){ // declares an async callback function 
    const todoText = this.parentNode.childNodes[1].innerText // goes into the parent node of the element ('this') that was clicked on, and takes the text of the first span (see HTML structure in the ejs file)
    try{
        const response = await fetch('deleteTodo', { // sends a fetch request to the server's endpoint 'deleteTodo'
            method: 'delete', // specifies the request method, which needs to match the method of the endpoint (this is specified in the server-side js code routes)
            headers: {'Content-type': 'application/json'}, // specifies the type of data that will be in the body of the request
            body: JSON.stringify({ // a method that creates a JSON string from the object argument
                'rainbowUnicorn': todoText // assigns the value of the 'rainbowUnicorn' property as the text we grabbed from the DOM (line 18)
                // this is the text that the server will do a qeury search with in the database collection. It will refer to the text using the 'rainbowUnicorn' property of the req.body
            })
        })
        const data = await response.json() // await the json response from the server and assign it to the data
        console.log(data) // log the data sent back in the console
        location.reload() // refresh the page to see the change
    }catch(err){ // handles any errors
        console.log(err)
    }
}
// the next two callback function declarations have some lines that are the same as the first callback function. The new/different lines have comments.
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', { // sends a fetch request to the server's endpoint 'markComplete'
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
        const response = await fetch('undo', { // sends a fetch request to the server's endpoint 'undo'
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
