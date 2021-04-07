const deleteBtn = document.querySelectorAll('.del') //selects every element with the del class
const todoItem = document.querySelectorAll('.todoItem span') //selects every span element nested inside the element with the .todoItem class
const todoComplete = document.querySelectorAll('.todoItem span.completed') //selects every span element with the completed class that is nested inside the element with the todoItem class

Array.from(deleteBtn).forEach((el)=>{ //creates an array using the nodes from the deleteBtn variable and for each of those elements
    el.addEventListener('click', deleteTodo) //it adds an event listener that responds to the click event by calling the deleteTodo function
})

Array.from(todoItem).forEach((el)=>{ //creates an array using the nodes from the todoItem variable and for each of those elements
    el.addEventListener('click', markComplete) //it adds an event listener that responds to the click event by calling the markComplete function
})

Array.from(todoComplete).forEach((el)=>{ //creates an array using the nodes from the todoComplete variable and for each of those elements
    el.addEventListener('click', undo) //it adds an event listener that responds to the click event by calling the undo function
})

async function deleteTodo(){ //creates an async function called deleteTodo
    const todoText = this.parentNode.childNodes[1].innerText //sets the todoText variable to text inside the second child of the parent (li that contains span that displays delete) of element that called the function (span that containts delete)
    try{ //sets up catching a promise
        const response = await fetch('deleteTodo', { //send a request to the server (and wait for a response) thru the deleteTodo route
            method: 'delete', //the type of request is delete
            headers: {'Content-type': 'application/json'}, //we will be sending json data
            body: JSON.stringify({ //code the body as json
                'rainbowUnicorn': todoText //send the property rainbowUnicorn with the value set to the data we stored in todoText
            })
        })
        const data = await response.json() //wait for the response and store the interpreted json data
        console.log(data) //log the response
        location.reload() //reload page
    }catch(err){ //catch any errors
        console.log(err) //log any errors
    }
}

async function markComplete(){ //creates an async function called markComplete
    const todoText = this.parentNode.childNodes[1].innerText //sets the todoText variable to text inside the second child of the parent (li that contains the span) of element that called the function (span)
    try{ //sets up catching a promise
        const response = await fetch('markComplete', { //send a request to the server (and wait for a response) thru the markComplete route
            method: 'put', //the type of request is put
            headers: {'Content-type': 'application/json'}, //we will be sending json data
            body: JSON.stringify({ //code the body as json
                'rainbowUnicorn': todoText //send the property rainbowUnicorn with the value set to the data we stored in todoText
            })
        })
        const data = await response.json()  //wait for the response and store the interpreted json data
        console.log(data)  //log the response
        location.reload() //reload page
    }catch(err){ //catch any errors
        console.log(err) //log any errors
    }
}

async function undo(){ //creates an async function called undo
    const todoText = this.parentNode.childNodes[1].innerText //didn't watch the whole video but shouldnt this contain the correct text???
    try{  //sets up catching a promise
        const response = await fetch('undo', { //send a request to the server (and wait for a response) thru the undo route
            method: 'put', //the type of request is put
            headers: {'Content-type': 'application/json'}, //we will be sending json data
            body: JSON.stringify({ //code the body as json
                'rainbowUnicorn': todoText //send the property rainbowUnicorn with the value set to the data we stored in todoText
            })
        })
        const data = await response.json() //wait for the response and store the interpreted json data
        console.log(data) //log the response
        location.reload() //reload page
    }catch(err){ //catch any errors
        console.log(err) //log any errors
    }
}