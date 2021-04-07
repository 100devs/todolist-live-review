const deleteBtn = document.querySelectorAll('.del') // storing all tags with 'del' as a class in deleteBtn
const todoItem = document.querySelectorAll('.todoItem span') // storing all span tags that are nested inside 'todoItem' class in todoItem
const todoComplete = document.querySelectorAll('.todoItem span.completed') // storing all span tags with a class of 'completed' that are nested inside 'todoItem' class in todoComplete

Array.from(deleteBtn).forEach((el)=>{ // creating an array containing all the deleteBtn (see line 1) variables and doing something to all of them.
    el.addEventListener('click', deleteTodo) // adding an event listener to all of our deleteBtn variables. first arg is the event, and the second arg is the function.
})

Array.from(todoItem).forEach((el)=>{ // creating an array containing all the todoItems (see line 2) variables and doing something to all of them.
    el.addEventListener('click', markComplete) // adding an event listener to all of our todoItems variables. first are is the event, and the second arg is the function.
})

Array.from(todoComplete).forEach((el)=>{ // creating an array containing all the todoComplete (see line 3) variables and doing something to all of them.
    el.addEventListener('click', undo) // adding an event listerner to all of our todoComplete variables. first are is the event, and the second arg is the function.
})

async function deleteTodo(){ // using a promise(async await) when defining our function deleteTodo
    const todoText = this.parentNode.childNodes[1].innerText // storing this button's (line 20 in index.ejs) parent's (line 14 in index.ejs) child's (line 16/18 in index.ejs) innerText and storing it in a variable named todoText. ** we are targeting childNodes[1] because of spaces **
    try{ // try block. 'do this' if successful
        const response = await fetch('deleteTodo', { // 'deleteTodo' is the endpoint and this is how express knows what to fire (line 63 in server.js)
            method: 'delete', // delete is the method
            headers: {'Content-type': 'application/json'}, // ** not sure what this does 'Content-type' is used as info for app, browser doesn't care what this is. 'application/json' is used so our app can detect what data is returned **
            body: JSON.stringify({ // converts data from javascript to json string
                'rainbowUnicorn': todoText // storing data from line 16/18 into key 'rainbowUnicorn' (used in line 64 in server.js)
            })
        })
        const data = await response.json() // ** store data (line 20) that will be returned using the .json() method 
        console.log(data) // console log the data that's being returned
        location.reload() // refreshes the browser
    }catch(err){ // catch block, console log the error
        console.log(err)
    }
}

async function markComplete(){ // using a promise(async await) when defining our function markComplete
    const todoText = this.parentNode.childNodes[1].innerText // storing this function's (line 18 in index.ejs) parent's (line 14 in index.ejs) child's (also line 18 in index.ejs) innerText and storing it in a variable named markComplete.
    try{ //try block. 'do this' if successful
        const response = await fetch('markComplete', { // 'markComplete' is th endpoint and this is how express knows what to fire (line  29 in server.js)
            method: 'put', // put (change something) is the method
            headers: {'Content-type': 'application/json'}, // ** 'Content-type' is used as info for app, browser doesn't care what this is. 'application/json' is used so our app can detect what data is returned. **
            body: JSON.stringify({ // converts data ffrom javascript to json string
                'rainbowUnicorn': todoText // storing data from line 18 into key 'ranbowUnicorn' (used in line 40 in server.js)
            })
        })
        const data = await response.json() // ** store data (line 38) that will be returned using the .json() method
        console.log(data) // console log the data that's being returned
        location.reload() // refreshes the browser
    }catch(err){ // catch block, console log the error
        console.log(err)
    }
}

async function undo(){ // using a promise (async await) when defining our function undo
    const todoText = this.parentNode.childNodes[1].innerText // storing this function's (line 16 in index.ejs) parent's (line 14 in index.ejs) child's (also line 16 in index.ejs) innerText and storing it in a variable named undo
    try{ // try block, 'do this' if successfull
        const response = await fetch('undo', { // 'undo' is the endpoint and this is how express knows what to fire (line 51 in server.js)
            method: 'put', // put (change something) is the method
            headers: {'Content-type': 'application/json'}, // ** 'Content-type' is used as info for app, browser doesn't care what this is. 'application/json' is used so our app can detect what data is returned. **
            body: JSON.stringify({ // converts data from javascript to json string
                'rainbowUnicorn': todoText // storing data from line 18 into key 'rainbowUnicorn (used in line 52 in server.js)
            })
        })
        const data = await response.json() // ** store data (line 38) that will be returned using the .json() method
        console.log(data) // console log the data that's being returned
        location.reload() // refreshes the browser
    }catch(err){ //catch block, console log the error
        console.log(err)
    }
}