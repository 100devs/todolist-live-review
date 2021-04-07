const deleteBtn = document.querySelectorAll('.del')  //var delteBtn from class del from ejs
const todoItem = document.querySelectorAll('.todoItem span') //var todoItem from class todoItem span from ejs
const todoComplete = document.querySelectorAll('.todoItem span.completed') //var5 todoComplete from class todoItem span completed from ejs

Array.from(deleteBtn).forEach((el)=>{ //makes array from .todoItem span and forEach iterates and assigns an element for each oen
    el.addEventListener('click', deleteTodo) //for each element (el) add click event listener linked to deleteTodo fxn
})

Array.from(todoItem).forEach((el)=>{ //makes array from todoItem and foreach iterates and asisgns an element for each one
    el.addEventListener('click', markComplete) //for each element add click even lsitener linked to markCompelte fxn
})

Array.from(todoComplete).forEach((el)=>{ //makes array form todoCompelte and assigns an elemlent for each element inside array
    el.addEventListener('click', undo) //elemetn adds click event listener linked to undo fxn
})

async function deleteTodo(){ //async deleteTodo fxn
    const todoText = this.parentNode.childNodes[1].innerText //var todoText equal to innertext of first todo
    try{ //try method
        const response = await fetch('deleteTodo', { //var response equal to fetch from deleteTodo from server.js CRUD
            method: 'delete', //method is used as the operation from server.js the CRUD operation in this case is app.delete
            headers: {'Content-type': 'application/json'}, //I dont know what this does
            body: JSON.stringify({ //I dont know what this does
                'rainbowUnicorn': todoText //I dont know what this does
            })
        })
        const data = await response.json() //I dont know what this does
        console.log(data) //I dont know what this does
        location.reload() //I dont know what this does
    }catch(err){ //catch error
        console.log(err) //console.log error
    }
}
/* The other functions are similar to above deleteTodo fxn so I know and dont know the same things from each one */
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
