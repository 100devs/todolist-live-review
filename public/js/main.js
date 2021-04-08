const deleteBtn = document.querySelectorAll('.del')//assigning the deleteBtn value to be equivalent to the del class in the ejs.
const todoItem = document.querySelectorAll('.todoItem span')//assigning the todoItem value to be equivalent to the .todoItem and span classes in the ejs.
const todoComplete = document.querySelectorAll('.todoItem span.completed')//assigning the todoComplete value to be equivalent to the todoItem and span.completed classes in the ejs.

Array.from(deleteBtn).forEach((el)=>{//Making an array out of each of the items in the deleteBtn variable with an 'el' parameter. Not sure what 'el' stands for. 
    el.addEventListener('click', deleteTodo)//Adding a click smurf to the 'el' value and setting up the deleteTodo function.
})

Array.from(todoItem).forEach((el)=>{//Making an array out of each of the items in the todoItem variable with an 'el' parameter. 
    el.addEventListener('click', markComplete)//Adding a click smurf to the 'el' value and setting up the markComplete function.
})

Array.from(todoComplete).forEach((el)=>{//Making an array out of each of the items in the todoComplete variable with an 'el' parameter.
    el.addEventListener('click', undo)//Adding a click smurf to the 'el' value and setting up the undo function.
})

async function deleteTodo(){//Starting the async function called deleteTodo()
    const todoText = this.parentNode.childNodes[1].innerText//declaring the todoText variable. Not sure what any of it breaks down to be except for the 'innerText' bit.
    try{//beginning of the try/catch function. Will happen first before the catch bit.
        const response = await fetch('deleteTodo', {//Creating the response variable to be equal to waiting for the data in deleteTodo to be fetched.
            method: 'delete',//declaring that the method is delete as opposed to the other methods in CRUD.
            headers: {'Content-type': 'application/json'},//Declaring the headers to be JSON. Not sure what 'content-type' is and what could be put in its place.
            body: JSON.stringify({//Putting the JSON into a string?
                'rainbowUnicorn': todoText// making 'rainbowUnicorn' equal to todoText.
            })
        })
        const data = await response.json()//Declaring data to wait for the JSON response.
        console.log(data)//Console logging the data variable.
        location.reload()//Reloading the page? Not sure what location is.
    }catch(err){//second part of the try/catch function. Runs if there is an error.
        console.log(err)//Console logging the error if there is one.
    }
}

async function markComplete(){//Beginning the async function called markComplete().
    const todoText = this.parentNode.childNodes[1].innerText//declaring the todoText variable. Not sure what any of it breaks down to be except for the 'innerText' bit.
    try{//beginning of the try/catch function. Will happen first before the catch bit.
        const response = await fetch('markComplete', {//Creating the response variable to be equal to waiting for the data in markComplete to be fetched.
            method: 'put',//declaring that the method is put as opposed to the other methods in CRUD.
            headers: {'Content-type': 'application/json'},//Declaring the headers to be JSON. Not sure what 'content-type' is and what could be put in its place.
            body: JSON.stringify({//Putting the JSON into a string?
                'rainbowUnicorn': todoText//making 'rainbowUnicorn' equal to todoText.
            })
        })
        const data = await response.json()//Declaring data to wait for the JSON response.
        console.log(data)//Console logging the data variable.
        location.reload()//Reloading the page? Not sure what location is.
    }catch(err){//second part of the try/catch function. Runs if there is an error.
        console.log(err)//Console logging the error if there is one.
    }
}

async function undo(){//Beginning the async function called undo().
    const todoText = this.parentNode.childNodes[1].innerText//declaring the todoText variable. Not sure what any of it breaks down to be except for the 'innerText' bit.
    try{//beginning of the try/catch function. Will happen first before the catch bit.
        const response = await fetch('undo', {//Creating the response variable to be equal to waiting for the data in undo to be fetched.
            method: 'put',//declaring that the method is put as opposed to the other methods in CRUD.
            headers: {'Content-type': 'application/json'},//Declaring the headers to be JSON. Not sure what 'content-type' is and what could be put in its place.
            body: JSON.stringify({//Putting the JSON into a string?
                'rainbowUnicorn': todoText//making 'rainbowUnicorn' equal to todoText.
            })
        })
        const data = await response.json()//Declaring data to wait for the JSON response.
        console.log(data)//Console logging the data variable.
        location.reload()//Reloading the page? Not sure what location is.
    }catch(err){//second part of the try/catch function. Runs if there is an error.
        console.log(err)//Console logging the error if there is one.
    }
}