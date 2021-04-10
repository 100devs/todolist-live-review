const deleteBtn = document.querySelectorAll('.del')
// this event listener is saying that if you click on anything that has this span inside of todoItem then mark them complete.
const todoItem = document.querySelectorAll('.todoItem span')
const todoItemComplete = document.querySelectorAll('.todoItem span.completed')

// grabbing the items from the array and adding an event listener to all of them through a loop.
// el is short for element
// deleteTodo is the name of the function
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})
// this is for when the user is clicking and it will mark the items completed
Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el) => {
    el.addEventListener('click', undo)
})
// this stands for the class (del) and we want to go up to the first li (parentNode) and go to the span that has the text (childNode). then the text will be stored in todoText. 
// spaces are counted as nodes so thats why we have [1]
// we then make our fetch request, its delete request and it will have some json and we are sending a req body along with that delete req and we can grab the stuff out of it by using the rainbowUnicorn
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

// same function as the deleteTodo
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