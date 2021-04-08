// need an event listener on delete
const deleteBtn = document.querySelectorAll('.del')
// need an event listener on list item - targets span inside class todoItem
const todoItem = document.querySelectorAll('.todoItem span')
// need another event listener on list item that targets span with a class of completed inside class todoItem
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// find everything that has a delete class and turn that into an array. add an event listener to each index in the array
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// find everything that is a span inside class todoItem and turn that into an array. add an event listener to each index in the array
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// find everything that is a span with a class of completed INSIDE class todoItem and turn that into an array. add an event listener to each index in the array
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// need to use fetch and async/await. we're trying to delete an li
async function deleteTodo(){
    // click on delete > go up to li > go into first span
    // why childNodes[1]? because [0] is the space that we don't see so the first span is [1]
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // the name in our API and fetch can take in an object. this tells the fetch what we're about to make
        // the fetch is going to have a route called 'deleteToDo'
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            // we can send a request body within our fetch similar to our POST request
            // stringify can take in an object and call it whatever you want
            body: JSON.stringify({
                // to do refers to the text that's next to delete
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

// need to use fetch and async/await. we're trying to update an li
async function markComplete(){
    // click on list item > go up to li > go into first span
    // why childNodes[1]? because [0] is the space that we don't see so the first span is [1]
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            // we can send a request body within our fetch similar to our POST request
            // stringify can take in an object and call it whatever you want
            body: JSON.stringify({
                // to do refers to the text that's next to delete
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

// need to use fetch and async/await. we're trying to update an li
async function undo(){
    // click on list item > go up to li > go into first span
    // why childNodes[1]? because [0] is the space that we don't see so the first span is [1]
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            // we can send a request body within our fetch similar to our POST request
            // stringify can take in an object and call it whatever you want
            body: JSON.stringify({
                // to do refers to the text that's next to delete
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