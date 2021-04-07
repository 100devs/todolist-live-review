const deleteBtn = document.querySelectorAll('.del') // assigns variable 'deleteBtn' to anything with the 'del' class
const todoItem = document.querySelectorAll('.todoItem span') // assigns variable 'todoItem' to anything with the 'todoItem' class that is a span?
const todoComplete = document.querySelectorAll('.todoItem span.completed') // assigns variable 'todoComplete' to anything with the 'todoItem' class and is a span with the 'completed' class??

Array.from(deleteBtn).forEach((el)=>{ // creates an array of elements that were assigned to 'deleteBtn' above, and starts the .forEach method, which will apply the following code to each object ('el') in the array:
    el.addEventListener('click', deleteTodo) // adds an event listener to each element 'el' in the array, which on a click, will run the deleteTodo function
})

Array.from(todoItem).forEach((el)=>{ // creates an array of elements that were assigned to 'deleteBtn' above
    el.addEventListener('click', markComplete) // adds an event listener to each element 'el' in the array, which on a click, will run the markComplete function
})

Array.from(todoComplete).forEach((el)=>{ // creates an array of elements that were assigned to 'deleteBtn' above
    el.addEventListener('click', undo) // adds an event listener to each element 'el' in the array, which on a click, will run the undo function
})

async function deleteTodo(){ // the start of an async function that will delete an item, but i don't know how the deletion actually happens........
    const todoText = this.parentNode.childNodes[1].innerText // delcares a variable 'todoText' that is assigned to the innerText of 'el' i think ? where the eventlistener was added ?
    try{ // idk what this means exactly
        const response = await fetch('deleteTodo', { // creates a variable 'response' that is assigned an await function, fetch, which takes in the parameter of this function
            method: 'delete', // the fetch is assigned the delete request
            headers: {'Content-type': 'application/json'}, // idk what this means but it has to do with json
            body: JSON.stringify({ // makes the response a string
                'rainbowUnicorn': todoText // the string is the property 'rainbowUnicorn' assigned to 'todoText' which is the const above ^^^ aka the innertext/item name
                // need to figure out how rainbowUnicorn connects to the other parts of this app
            })
        })
        const data = await response.json() // declared a variable 'data' that is assigned a response ??
        console.log(data) // lets us know the data/response ??
        location.reload() // reloads the page, aka triggers a get request to show the deletion
    }catch(err){
        console.log(err) // a function that lets us know if there was an error in this process
    }
}

async function markComplete(){ // the start of an async function that will mark an item complete
    const todoText = this.parentNode.childNodes[1].innerText // delcares a variable 'todoText' that is assigned to the innerText of 'el' i think ? where the eventlistener was added ?
    try{ // idk what this means exactly
        const response = await fetch('markComplete', { // creates a variable 'response' that is assigned an await function, fetch, which takes in the parameter of this function
            method: 'put', // the fetch is assigned the put/update request
            headers: {'Content-type': 'application/json'}, // idk what this means but it has to do with json
            body: JSON.stringify({ // makes the response a string
                'rainbowUnicorn': todoText // the string is the property 'rainbowUnicorn' assigned to 'todoText' which is the const above ^^^ aka the innertext/item name
                // need to figure out how rainbowUnicorn connects to the other parts of this app
            })
        })
        const data = await response.json() // declared a variable 'data' that is assigned a response ??
        console.log(data)  // lets us know the data/response ??
        location.reload() // reloads the page, aka triggers a get request to show the deletion
    }catch(err){
        console.log(err) // a function that lets us know if there was an error in this process
    }
}

async function undo(){ // the start of an async function that will undo marking an item complete
    const todoText = this.parentNode.childNodes[1].innerText  // delcares a variable 'todoText' that is assigned to the innerText of 'el' i think ? where the eventlistener was added ?
    try{ // idk what this means exactly
        const response = await fetch('undo', { // creates a variable 'response' that is assigned an await function, fetch, which takes in the parameter of this function
            method: 'put', // the fetch is assigned the put/update request
            headers: {'Content-type': 'application/json'}, // idk what this means but it has to do with json
            body: JSON.stringify({ // makes the response a string
                'rainbowUnicorn': todoText // the string is the property 'rainbowUnicorn' assigned to 'todoText' which is the const above ^^^ aka the innertext/item name
                // need to figure out how rainbowUnicorn connects to the other parts of this app
            })
        })
        const data = await response.json() // declared a variable 'data' that is assigned a response ??
        console.log(data)  // lets us know the data/response ??
        location.reload() // reloads the page, aka triggers a get request to show the deletion
    }catch(err){
        console.log(err) // a function that lets us know if there was an error in this process
    }
}
