const deleteBtn = document.querySelectorAll('.del') // all things with the class delete
const todoItem = document.querySelectorAll('.todoItem span') // all spans with the class todoItem 
const todoComplete = document.querySelectorAll('.todoItem span.completed') //all spans with the class completed and to do item

Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo) // adds click event listeners to all delete buttons and links them to the function deleteTodo
})

Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete) // adds event listeners to all to do items (line 2 here) and links them to the function markComplete
})

Array.from(todoComplete).forEach((el) => {
    el.addEventListener('click', undo) // adds event listeners to all completed to do items (line 3) and links them to the function undo
})

async function deleteTodo() { //delete
    const todoText = this.parentNode.childNodes[1].innerText // this is grabbing the text of the todo item so we can send to server.js so it can search the db collection
    try {
        const response = await fetch('deleteTodo', { // talks to our server.js(API) so we can set method and send data
            method: 'delete', // method setting
            headers: {
                'Content-type': 'application/json'
            }, //I Dont Know could be magic
            body: JSON.stringify({
                'rainbowUnicorn': todoText // sets rainbow unicorn value to the innertext as json 
            })
        })
        const data = await response.json() // data is the response as json
        console.log(data) // logging data 
        location.reload() // when this funciton completes it tells our api to reload the page 
    } catch (err) {
        console.log(err) //error stuff
    }
}

async function markComplete() { // pretty much same as delete
    const todoText = this.parentNode.childNodes[1].innerText // grabs the innertext of the item based on the button we press
    try {
        const response = await fetch('markComplete', { // api communication like above tells api this function uses the markComplete put in you(the api)
            method: 'put', // method setting
            headers: {
                'Content-type': 'application/json'
            }, //fuck if i know, magic 
            body: JSON.stringify({
                'rainbowUnicorn': todoText //sets rainbow unicorn value to the innertext as json
            })
        })
        const data = await response.json() // data is the response as json
        console.log(data) // logs data from the line above
        location.reload() //refresh
    } catch (err) {
        console.log(err) // error shit
    }
}

async function undo() { //exactly like the mark complete 
    const todoText = this.parentNode.childNodes[1].innerText // grabs the innertext of the item based on the button we press
    try {
        const response = await fetch('undo', { // api communication like above tells api this function uses the undo put in you(the api)
            method: 'put', // value of method key
            headers: {
                'Content-type': 'application/json'
            }, //i dont know, ok fucking magic i just copy paste this
            body: JSON.stringify({
                'rainbowUnicorn': todoText // sets the body property to have the value of the innertext as json (we use the body property all over the place in the API)
            })
        })
        const data = await response.json() // data is jason
        console.log(data) // log jason
        location.reload() // reload page
    } catch (err) {
        console.log(err) // error 
    }
}