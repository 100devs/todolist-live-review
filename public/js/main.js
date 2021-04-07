const deleteBtn = document.querySelectorAll('.del') // get a reference to all DOM elements with a class of del and put them into a node list assigned to the deleteBtn variable
const todoItem = document.querySelectorAll('.todoItem span') // get a reference to all span elements with an ancestor with the class of todoItem and put them into a node list assigned to the todoItem variable
const todoComplete = document.querySelectorAll('.todoItem span.completed') // get a reference to all span elements with a class of completed with an ancestor with the class of todoItem and put them into a node list assigned to the todoComplete variable

Array.from(deleteBtn).forEach((el)=>{ // change the deleteBtn node list into an array and loop over each element
    el.addEventListener('click', deleteTodo) // listen for a click on the currently element in the iteration and call the deleteTodo function if it's clicked
})

Array.from(todoItem).forEach((el)=>{ // change the todoItem node list into an array and loop over each element
    el.addEventListener('click', markComplete) // listen for a click on the currently element in the iteration and call the markComplete function if it's clicked
})

Array.from(todoComplete).forEach((el)=>{ // change the todoComplete node list into an array and loop over each element
    el.addEventListener('click', undo) // listen for a click on the currently element in the iteration and call the undo function if it's clicked
})

async function deleteTodo(){ // create a deleteTodo function and mark it as async so we can use await inside of it
    const todoText = this.parentNode.childNodes[1].innerText // get the text from the clicked element's parent element's second node. i.e. the text
    try{ // run this code
        const response = await fetch('deleteTodo', { // send a request to /deleteTodo and wait for the response
            method: 'delete', // send the request with a header telling the server it's a delete request
            headers: {'Content-type': 'application/json'}, // send the request with a header telling the server it's a JSON object
            body: JSON.stringify({ // turn the following into JSON and send it as the request's body
                'rainbowUnicorn': todoText // get todoText's value and convert it all into JSON
            })
        })
        const data = await response.json() // wait for the request on line 20's body property to be converted into JSON
        console.log(data) // show the result of line 27 in the brower's console
        location.reload() // reload the page
    }catch(err){ // if any code in the try block on lines 19-29 fails
        console.log(err) // show the error in the brower's console
    }
}

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