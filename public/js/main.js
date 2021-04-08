const deleteBtn = document.querySelectorAll('.del')  //find all the delete class
const todoItem = document.querySelectorAll('.todoItem span') //click even for the complete to do items
const todoComplete = document.querySelectorAll('.todoItem span.completed')

Array.from(deleteBtn).forEach((el)=> { //el is element
    el.addEventListener('click', deleteTodo) 
})

Array.from(todoItem).forEach((el)=> { //el is element
    el.addEventListener('click', markComplete) 
})

Array.from(todoComplete).forEach((el)=> { //el is element
    el.addEventListener('click', undo) 
})

async function deleteTodo(){
    const todoText = this.parentNode.childNodes[1].innerText //this is the delete that's being clicked
    try {
        const response= await fetch('deleteTodo', {  //fetch can take an object
            method: 'delete', //a method to delete
            headers:{'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //i dont know what this is
                    'rainbowUnicorn': todoText //i dont know what this is
            })
        })
        const data=await response.json() //part of the aysnc function for await but other than that, I don't know
        console.log(data)
        location.reload()
    }catch(err) {  //to catch an error
        console.log(err) // to show an error on the console
    }
}

async function markComplete(){ //creating a function 
    const todoText = this.parentNode.childNodes[1].innerText //this is the delete that's being clicked
    try {
        const response= await fetch('markComplete', {  //fetch can take an object
            method: 'put', //put method as in create part of CRUD
            headers:{'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //i dont know what this is
                    'rainbowUnicorn': todoText //i dont know what this is
            })
        })
        const data=await response.json() //part of the aysnc function for await but other than that, I don't know
        console.log(data)
        location.reload()
    }catch(err) {  //to catch an error
        console.log(err) // to show an error on the console
    }
}

async function undo(){ //creating a function 
    const todoText = this.parentNode.childNodes[1].innerText //taking the innertext to become true to false
    // console.log(this.parentNode.childNodes)
    try {
        const response= await fetch('undo', {  //fetch can take an object
            method: 'put', //put method as in create part of CRUD
            headers:{'Content-type': 'application/json'}, //I don't know what this is
            body: JSON.stringify({ //i dont know what this is
                    'rainbowUnicorn': todoText //i dont know what this is
            })
        })
        const data=await response.json() //part of the aysnc function for await but other than that, I don't know
        console.log(data)
        location.reload()
    }catch(err) {  //to catch an error
        console.log(err) // to show an error on the console
    }
}