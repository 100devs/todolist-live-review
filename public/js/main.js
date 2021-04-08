//dynamically adding eventlisteners to each task as they appear within the EJS li. 

//selects all items in ejs with the specified class
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//creates arrays from items above, then loops through them adding event listeners and pairing a function to each
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el) => {
    el.addEventListener('click', undo)
})

//asynchronous function, that allows deletion of tasks
async function deleteTodo() {

    //todoText refers us to the inner text of the li node with the specified index number of 1 -- its not zero because spaces count
    //I don't know what "this" is pointing to though
    const todoText = this.parentNode.childNodes[1].innerText

    //try this, if not return an error and log it to the console
    try {
        //a fetch is made to our server.js file, for the function with the delete method
        const response = await fetch('deleteTodo', {
            method: 'delete',

            //I DONT KNOW
            headers: { 'Content-type': 'application/json' },

            //I DONT KNOW
            body: JSON.stringify({
                //I DONT KNOW
                'rainbowUnicorn': todoText
            })
        })
        //create a variable named data, that stores the response in json format, then log it to the console and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}


//async function that allows us to use the put method to update our list and mark a task as complete
async function markComplete() {
    //todoText refers us to the inner text of the li node with the specified index number of 1 -- its not zero because spaces count
    //I DONT KNOW what "this" is pointing to 
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        // make a fetch for a put method function in our server.js that corresponds to the make markComplete
        const response = await fetch('markComplete', {
            method: 'put',
            //I DONT KNOW
            headers: { 'Content-type': 'application/json' },
            //I DONT KNOW
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })

        //create a variable named data, that stores the response in json format, then log it to the console and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

// asyn function that allows user to undo what the above function does
async function undo() {

    //todoText refers us to the inner text of the li node with the specified index number of 1 -- its not zero because spaces count
    //I DONT KNOW what "this" is pointing to 
    const todoText = this.parentNode.childNodes[1].innerText
    try {

        // make a fetch for a put method function in our server.js that corresponds to the make markComplete
        const response = await fetch('undo', {
            method: 'put',
            //I DONT KNOW
            headers: { 'Content-type': 'application/json' },
            //I DONT KNOW -- i think we assign the value of the node which we clicked to rainbow unicorn which we can then use in the server js to target in the database
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })

        //create a variable named data, that stores the response in json format, then log it to the console and refresh the page
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}