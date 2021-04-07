const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.todoItem span')
const todoComplete = document.querySelectorAll('.todoItem span.completed')
//setting up our variables which will hold the relevent elements

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})

//setting up the respective event listeners for the relevant buttons/texts

async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText //store name of task in var
    try{
        const response = await fetch('deleteTodo', { //fetch request to relevant api link
            method: 'delete', //specifying method
            headers: {'Content-type': 'application/json'}, //specifying content type of application/json
            body: JSON.stringify({
                'rainbowUnicorn': todoText //sending in our body with name of text set to rainbowUnicorn
            })
        })
        const data = await response.json() //awaiting our json response
        console.log(data) //logging data
        location.reload() //refresh page
    }catch(err){
        console.log(err) //catch errs and log
    }
}

//SAME THING AS ABOVE MOSTLY
async function markComplete(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put', //specifying our PUT type of request
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
//SAME THING AS ABOVE MOSTLY
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