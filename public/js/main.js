const deleteBtn = document.querySelectorAll('.del') // create an object from all our delete buttons
const todoItem = document.querySelectorAll('.todoItem span') // the same but uncompleted items
const todoComplete = document.querySelectorAll('.todoItem span.completed') // the same but completed items

Array.from(deleteBtn).forEach((el)=>{ // turn the object into an array and ...
    el.addEventListener('click', deleteTodo) // add an event listener
}) // close bracket

Array.from(todoItem).forEach((el)=>{ // see above
    el.addEventListener('click', markComplete) // see above
}) // close bracket

Array.from(todoComplete).forEach((el)=>{ // see above
    el.addEventListener('click', undo) // see above
}) // close bracket

async function deleteTodo(){ // function to send delete request to server
    const todoText = this.parentNode.childNodes[1].innerText // grab info from form. im very, very bad at DOM node stuff
    try{ // i've not written many try-catches but i think it's just how you write error handling in an async function
        const response = await fetch('deleteTodo', { // declare path on server (which route  you are sending fetch to)
            method: 'delete', // delete method
            headers: {'Content-type': 'application/json'}, // we will be sending data in json format let the server know
            body: JSON.stringify({ // convert data to json
                'rainbowUnicorn': todoText // send todoText... as rainbowUnicorn for some reason
            }) //close bracket
        }) // close bracket
        const data = await response.json() // store response from server as object 'data'
        console.log(data) // log it
        location.reload() // reload the page
    }catch(err){ // error handling
        console.log(err) // print error
    } // close bracket
} // close bracket

async function markComplete(){ // this is all identical to the delete function other than the method and my hand is starting to hurt so im not commenting it
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

async function undo(){ // same as the last two
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