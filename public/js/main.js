const deleteBtn = document.querySelectorAll('.del') // declares a const and assigns a queryselector
const todoItem = document.querySelectorAll('.todoItem span') // declares a const and assigns a queryselector
const todoComplete = document.querySelectorAll('.todoItem span.completed') // declares a const and assigns a queryselector

Array.from(deleteBtn).forEach((el)=>{ //creates an array from deleteBtn and then a function to perform on each item in that array 
    el.addEventListener('click', deleteTodo) //passes click event and deleteTodo func into the eventlistener method for the current array item
}) //closes the foreEach parameters and function block

Array.from(todoItem).forEach((el)=>{ //creates an array from todoItem and then a function to perform on each item in that array 
    el.addEventListener('click', markComplete) //passes click event and markComplete func into the eventlistener method for the current array item
}) //closes the foreEach parameters and function block

Array.from(todoComplete).forEach((el)=>{ //creates an array from todoComplete and then a function to perform on each item in that array 
    el.addEventListener('click', undo) //passes click event and undo func into the eventlistener method for the current array item
}) //closes the foreEach parameters and function block

async function deleteTodo(){ // declares asynchronous deleteTodo function
    const todoText = this.parentNode.childNodes[1].innerText // declares todoText const and assigns it the inner text of the parent node's first child node
    try{ //I don't know were try comes from, I've been inferring its usage from context
        const response = await fetch('deleteTodo', { //declares the response as a fetch method, passing in deleteTdo
            method: 'delete', //assigns delete to the method parameter
            headers: {'Content-type': 'application/json'}, //I don't know. has to do with how things are interpreted or displayed
            body: JSON.stringify({ //assigns JSON to the body and uses the stringify method on it
                'rainbowUnicorn': todoText // assigns todoText to rainbowUnicorn
            }) //closes the stringify parameters and function block
        }) //closes the fetch parameters and function block
        const data = await response.json() //declares data as the response passes through the json method
        console.log(data) // displays data in the console
        location.reload() //reloads the page (we will see the results reflected in it)
    }catch(err){ //if there's an error...
        console.log(err) // display the error in the console
    } //close catch block
} //close deleteTodo block

async function markComplete(){ // declares asynchronous markComplete function
    const todoText = this.parentNode.childNodes[1].innerText // declares todoText const and assigns it the inner text of the parent node's first child node
    try{ //I don't know were try comes from, I've been inferring its usage from context
        const response = await fetch('markComplete', { //declares the response as a fetch method, passing in markComplete
            method: 'put', //assigns put to the method parameter
            headers: {'Content-type': 'application/json'}, //I don't know. has to do with how things are interpreted or displayed
            body: JSON.stringify({ //assigns JSON to the body and uses the stringify method on it
                'rainbowUnicorn': todoText // assigns todoText to rainbowUnicorn
            }) //closes the stringify parameters and function block
        }) //closes the fetch parameters and function block
        const data = await response.json() //declares data as the response passes through the json method
        console.log(data) // displays data in the console
        location.reload() //reloads the page (we will see the results reflected in it)
    }catch(err){ //if there's an error...
        console.log(err) // display the error in the console
    } //close catch block
}

async function undo(){ // declares asynchronous undo function
    const todoText = this.parentNode.childNodes[1].innerText // declares todoText const and assigns it the inner text of the parent node's first child node
    try{ //I don't know were try comes from, I've been inferring its usage from context
        const response = await fetch('undo', { //declares the response as a fetch method, passing in undo
            method: 'put', //assigns put to the method parameter
            headers: {'Content-type': 'application/json'}, //I don't know. has to do with how things are interpreted or displayed
            body: JSON.stringify({ //assigns JSON to the body and uses the stringify method on it
                'rainbowUnicorn': todoText // assigns todoText to rainbowUnicorn
            }) //closes the stringify parameters and function block
        }) //closes the fetch parameters and function block
        const data = await response.json() //declares data as the response passes through the json method
        console.log(data) // displays data in the console
        location.reload() //reloads the page (we will see the results reflected in it)
    }catch(err){ //if there's an error...
        console.log(err) // display the error in the console
    } //close catch block
} //close deleteTodo block