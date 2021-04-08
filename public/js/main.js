const deleteBtn = document.querySelectorAll('.del') //constant variable for delete function. I don't understand the All part of the querySelector
const todoItem = document.querySelectorAll('.todoItem span') //constant variable for edit function (to mark complete I think). I don't understand the All part of the querySelector
const todoComplete = document.querySelectorAll('.todoItem span.completed') //constant variable for edit function (to undo a complete I think). I don't understand the All part of the querySelector

Array.from(deleteBtn).forEach((el)=>{ //Array generated from all deletes, then iterates through each element to add an event listener for the delete function
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{ //Array generated from all items, then iterates through each element to add an event listener for the complete function
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{ //Array generated from all completed items, then iterates through each element to add an event listener for the undo function
    el.addEventListener('click', undo)
})

async function deleteTodo(){ //asynchronous function to delete a todo item
    const todoText = this.parentNode.childNodes[1].innerText //I know this gives us the todo item text, but I don't understand how
    try{ //I think this is the "if" part of the async, if it fails it goes to the catch section
        const response = await fetch('deleteTodo', { //constant variable, I don't know what the rest is
            method: 'delete', //I don't know what this is
            headers: {'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //I don't know what this is
                'rainbowUnicorn': todoText //I don't know what this is
            })
        })
        const data = await response.json() //I don't know what this is
        console.log(data) //print the value of the data variable to the console
        location.reload() //I don't know what this is
    }catch(err){ //I think this is the "else" part of the async function, but don't understand it
        console.log(err) //print error to the console
    }
}

async function markComplete(){ //asynchronous function to mark a todo item complete
    const todoText = this.parentNode.childNodes[1].innerText //I know this gives us the todo item text, but I don't understand how
    try{ //I think this is the "if" part of the async, if it fails it goes to the catch section
        const response = await fetch('markComplete', { //constant variable, I don't know what the rest is
            method: 'put', //I don't know what this is
            headers: {'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //I don't know what this is
                'rainbowUnicorn': todoText //I don't know what this is
            })
        })
        const data = await response.json() //I don't know what this is
        console.log(data) //print the value of the data variable to the console
        location.reload() //I don't know what this is
    }catch(err){ //I think this is the "else" part of the async function, but don't understand it
        console.log(err) //print error to the console
    }
}

async function undo(){ //asynchronous function to unmark a completed todo item
    const todoText = this.parentNode.childNodes[1].innerText //I know this gives us the todo item text, but I don't understand how
    try{ //I think this is the "if" part of the async, if it fails it goes to the catch section
        const response = await fetch('undo', { //constant variable, I don't know what the rest is
            method: 'put', //I don't know what this is
            headers: {'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //I don't know what this is
                'rainbowUnicorn': todoText //I don't know what this is
            })
        })
        const data = await response.json() //I don't know what this is
        console.log(data) //print the value of the data variable to the console
        location.reload() //I don't know what this is
    }catch(err){ //I think this is the "else" part of the async function, but don't understand it
        console.log(err) //print error to the console
    }
}
