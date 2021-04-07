// variables for elements in our ejs
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// uses variables from above and puts them in an array to use the forEach method and add eventlisteners to all elements with those classes
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// function used whenever a deleteBtn is clicked
async function deleteTodo(){
    // not really sure how this works but it grabes the item from whichever deleteBtn was clicked
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // variable with the fetch method looking for deleteTodo from server.js
        const response = await fetch('deleteTodo', {
            // lets our server.js know the method is delete?
            method: 'delete',
            // not entirely sure about this line
            headers: {'Content-type': 'application/json'},
            // turns json into a string?
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // variable that holds the response as json
        const data = await response.json()
        // console.logs the response json
        console.log(data)
        // reloads the page
        location.reload()
    // catches any errors that may occur and console.logs them
    }catch(err){
        console.log(err)
    }
}

// function used whenever todoItem span is clicked 
async function markComplete(){
    // not really sure how this works but it grabes the item from whichever todoItem span was clicked
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // variable with fetch method looking for markComplete from server.js
        const response = await fetch('markComplete', {
            // lets our server.js know the method is put?
            method: 'put',
            // not entirely sure about this line
            headers: {'Content-type': 'application/json'},
            // turns json into a string?
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // variable that holds the response as json
        const data = await response.json()
        // console.logs the response json
        console.log(data)
        // reloads the page
        location.reload()
    // catches any errors that may occur and console.logs them
    }catch(err){
        console.log(err)
    }
}

// function used whenever todoComplete is clicked
async function undo(){
    // not really sure how this works but it grabes the item from whichever todoItem span.completed was clicked
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // variable with fetch method looking for undo from server.js
        const response = await fetch('undo', {
            // lets our server.js know the method is put?
            method: 'put',
            // not entirely sure about this line
            headers: {'Content-type': 'application/json'},
            // turns json into a string?
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // variable that holds the response as json
        const data = await response.json()
        // console.logs the response json
        console.log(data)
        // reloads the page
        location.reload()
    // catches any errors that may occur and console.logs them
    }catch(err){
        console.log(err)
    }
}