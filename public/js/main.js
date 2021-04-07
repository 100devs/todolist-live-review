const deleteBtn = document.querySelectorAll('.del')                         // Get the delete button from the each item on the todo list
const todoItem = document.querySelectorAll('.todoItem span')                // Get all of the todo items text
const todoComplete = document.querySelectorAll('.todoItem span.completed')  // Get all of the completed todo items

Array.from(deleteBtn).forEach((el) => {         // Convert the Node List of delete buttons to an array
    el.addEventListener('click', deleteTodo)    // For each element in the newly created array,
})                                              //      add an event listener that responds to a click by calling deleteTodo

Array.from(todoItem).forEach((el) => {          // Convert the Node List of todo items to an array
    el.addEventListener('click', markComplete)  // For each element in the newly crated array,
})                                              //      add an even listener that responds to a click by calling markComplete

Array.from(todoComplete).forEach((el) => {      // Convert the Node List of completed items to an array
    el.addEventListener('click', undo)          // For each element in the newly created array,
})                                              //      add an even listener that responds to a click by calling undo

async function deleteTodo() {                                   //  Declare an asynchronous function called deleteTodo
    const todoText = this.parentNode.childNodes[1].innerText    //  Get the text from the todo item that is being deleted
    try {                                                       //  Try to do something that may throw an exception
        const response = await fetch('deleteTodo', {            //      Make an HTTP DELETE request to the server, wait for a response, and store it
            method: 'delete',                                   //          Indicate that this is a DELETE request
            headers: { 'Content-type': 'application/json' },    //          Add headers to the request that says the body is a JSON string
            body: JSON.stringify({                              //          Convert an object to JSON and store as the body of the request
                'rainbowUnicorn': todoText                      //              This object has a property of rainbowUnicorn and contains the todo text
            })                                                  //          End JSON stringify
        })                                                      //      End API fetch
        const data = await response.json()                      //      Wait for the HTTP response to be converted to json and store it in data
        console.log(data)                                       //      Log the data that was received
        location.reload()                                       //      Reloads the page to show the updates.
    } catch (err) {                                             //  If an exception occurred
        console.log(err)                                        //      Log the error
    }                                                           //  End try/catch
}                                                               //  End of deleteTodo

async function markComplete() {                                 //  Declare asynchronous function called markComplete
    const todoText = this.parentNode.childNodes[1].innerText    //  Get the text from the todo item being marked as completed
    try {                                                       //  Try to do something that may throw an exception
        const response = await fetch('markComplete', {          //      Make an HTTP PUT request to the server, wait for a response, and store it
            method: 'put',                                      //          Indicate that this is a PUT request
            headers: { 'Content-type': 'application/json' },    //          Add headers to the request that says the body is a JSON string
            body: JSON.stringify({                              //          Convert an object to JSON and store as the body of the request
                'rainbowUnicorn': todoText                      //              This object has a property of rainbowUnicorn and contains the todo text
            })                                                  //          End JSON stringify
        })                                                      //      End API fetch
        const data = await response.json()                      //      Wait for the HTTP response to be converted to json and store it in data
        console.log(data)                                       //      Log the data that was received
        location.reload()                                       //      Reload the page to show the updates
    } catch (err) {                                             //  If an exception occurred
        console.log(err)                                        //      Log the error
    }                                                           //  End try/catch
}                                                               //  End of markComplete

async function undo() {                                         //  Declare asynchronous function called undo
    const todoText = this.parentNode.childNodes[1].innerText    //  Get the text from the todo item being marked as not completed
    try {                                                       //  Try to do something that may throw an exception
        const response = await fetch('undo', {                  //      Make an HTTP PUT request to the server, wait for a response, and store it
            method: 'put',                                      //          Indicate that this is a PUT request
            headers: { 'Content-type': 'application/json' },    //          Add headers to the request that says the body is a JSON string
            body: JSON.stringify({                              //          Convert an object to JSON and store as the body of the request
                'rainbowUnicorn': todoText                      //              This object has a property of rainbowUnicorn and contains the todo text
            })                                                  //          End JSON stringify
        })                                                      //      End API fetch
        const data = await response.json()                      //      Wait for the HTTP response to be converted to json and store it in data
        console.log(data)                                       //      Log the data that was received
        location.reload()                                       //      Reload the page to show the updates
    } catch (err) {                                             //  If an exception occurred
        console.log(err)                                        //      Log the error
    }                                                           //  End try/catch
}                                                               //  End of undo