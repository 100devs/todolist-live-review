const deleteBtn = document.querySelectorAll('.del') //selects all things with class of 'del' and set that as deleteBtn
const todoItem = document.querySelectorAll('.todoItem span') // same as above but looks for all things with class of 'todoItem' AND is a span
const todoComplete = document.querySelectorAll('.todoItem span.completed') // looks for completed todos and put into variable todoComplete


// this takes everything line 1 found, puts it into an array, and adds an event listener to each one.
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo) // listening for a click and when it receives one fire deleteTodo function
})

// for each element that we have stored in todoItem, add a click event that will fire markComplete function.
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// here is our delete function. basically what it is doing is it will take all the text, from the line the user clicked, and delete it. then it reloads the page to update our list. 
async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteTodo', {
            method: 'delete',
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
// this will allow us to grab whatever was clicked, and fetch our markComplete function from server.js which updates an item in our database, in this case it will set the completed property as true
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText // 'this' keeps us on current thing clicked, the rest will select the text.
    try{
        const response = await fetch('markComplete', {
            method: 'put', // we are gonna change something in our db, need put method
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText //gives the text grabbed the property of rainbowUnicorn
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload() // reload page to run our get request again
    }catch(err){
        console.log(err)
    }
}
// here is another put method that undo's what the above function does. 
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