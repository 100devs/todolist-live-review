// declering a variable to all the element that as a "del" class
const deleteBtn = document.querySelectorAll('.del')

// declering a variable to all the element that as a parent class of ".todoItem" and parentChild reletionship of span element.
const todoItem = document.querySelectorAll('.todoItem span')

// declering a variable of all perent element of "class todoItems" and perent child relationship of span element with a class of "completed"
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// from all variable element that as deleteBtn find the clicked one.
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// from all variable element that as todoItem find the clicked one.
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// from all variable element that as todoCompleted find the clicked one.
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

// 
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