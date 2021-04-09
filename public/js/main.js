
// files is served up by express server
const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span') // when we click on a span inside todo item it marks it as complete
const todoComplete = document.querySelectorAll('.todoItem span.completed') // grabs all completed items marked as true

// delete button
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', undo)
})

// delete todo item
async function deleteTodo(){
    // when clicking on delete, grab first text in ejs to delete
   const todoText = this.parentNode.childNodes[1].innerText
    try {
       const response = await fetch('deleteTodo', { // request to server
           method: 'delete',
           headers: {'Content-Type': 'application/json'}, // knows how data is sent
           body: JSON.stringify({
               'rainbowUnicorn': todoText // sending object along with body to pull out text with rainbow unicorn property
           })
       })
       const data = await response.json() // grab any response and put in data
       console.log(data)
       location.reload() // if it works, reload
   } catch (err) {
       console.error(err)
   } 
}

// Mark list item complete
async function markComplete(){
    // when clicking on delete, grab first text in ejs to delete
   const todoText = this.parentNode.childNodes[1].innerText
    try {
       const response = await fetch('markComplete', { // request to server
           method: 'put',
           headers: {'Content-Type': 'application/json'}, // knows how data is sent
           body: JSON.stringify({
               'rainbowUnicorn': todoText // sending object along with body to pull out text with rainbow unicorn property
           })
       })
       const data = await response.json() // grab any response and put in data
       console.log(data)
       location.reload() // if it works, reload
   } catch (err) {
       console.error(err)
   } 
}

// undo marked completed item
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