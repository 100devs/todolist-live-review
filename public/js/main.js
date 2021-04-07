const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')
    //creates a new shallow-copied array instance
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el) => {
        el.addEventListener('click', undo)
    })
    // async enables asyncronous promise based behavior 
    // as if it was synchronous but without blocking the main thread.
    //this makes it more readable.this always returns a promise-resolved or rejected
async function deleteTodo() {
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        //when you await a promise ,the function is paused in a nonblocking way
        // so that the promise settles. await is used to wait for a promise to resolve 
        //or reject which can only be inside of an async function
        const response = await fetch('deleteTodo', {
                method: 'delete',
                //allos to perfom various actions on repsonse and request headers
                // to retrive, set , add to and removing headers
                headers: { 'Content-type': 'application/json' },
                //converts a JS object into a JSON string
                body: JSON.stringify({
                    'rainbowUnicorn': todoText
                })
            })
            //result of taking JSON as input and parsing it to produce a JS object 
        const data = await response.json()
        console.log(data)
            //reloads the current document
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

async function markComplete() {
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}

async function undo() {
    const todoText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('undo', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch (err) {
        console.log(err)
    }
}