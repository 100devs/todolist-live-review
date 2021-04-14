const deleteBtn = document.querySelectorAll('.del')// find all the delete class
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')

    Array.from(deleteBtn).forEach((el) => {
        el.addEventListener('click', deleteTodo)
    })
    Array.from(todoItem).forEach((el) => {
        el.addEventListener('click', markComplete)
    })
    Array.from(todoComplete).forEach((el) => {
        el.addEventListener('click', undo)
    })
async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText //is the delet we click, it willl grab the tex that is stored inside the node
    try{
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers:{'Content-type': 'application/json'},//dont know
            body: JSON.stringify({ // the first try text is storinf thet todo text
                'rainbowUnicorn': todoText //dont know
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
    const todoText = this.parentNode.childNodes[1].innerText //we are grabbing the text
    try{
        const response = await fetch('markComplete', {
            method: 'put', //sent a fetch request that was a put
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText // this is the text that we passed along
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
    const todoText = this.parentNode.childNodes[1].innerText //we are grabbing the text
    try{
        const response = await fetch('undo', {
            method: 'put', //sent a fetch request that was a put
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText // this is the text that we passed along
            })
        })   
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
    console.log(err)
    }
}