const deleteBtn = document.querySelectorAll('.del')  //making a smurf for out deletes
const todoItem = document.querySelectorAll('.todoItem span') //making a smurf for our completed items 
const todoComplete = document.querySelectorAll('.todoItem span.completed') //making a smurf for undo completed items 


Array.from(deleteBtn).forEach((el) => { //our loop for the deleted but not sure how it is working 
    el.addEventListener('click', deleteTodo) // adding the actual smurf to all the elements in our loop 
})

Array.from(todoItem).forEach((el) => {  //our loop for the completed but not sure how it is working 
    el.addEventListener('click', markComplete) // adding the actual smurf to all the elements in our loop 
})

Array.from(todoComplete).forEach((el) => {  //our loop to undo the completed but not sure how it is working 
    el.addEventListener('click', undoComplete) // adding the actual smurf to all the elements in our loop 
})

async function deleteTodo(){  //Don't really understand why this works (Entire block)
    const todoText = this.parentNode.childNodes[1].innerText //I think it is how to are targeting the span
     try{ //Not sure what the try is 
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data) //debug but I don't see this pop up in the console
        location.reload() //I think this is making the page refresh?  
     }catch(err){ //how to catch errors
         console.log(err)

     }
}
    async function markComplete(){   //Don't really understand why this works (Entire block)
    const todoText = this.parentNode.childNodes[1].innerText //I think it is how to are targeting the span
        try{ //Not sure what the try is 
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data) //debug but I don't see this pop up in the console
        location.reload() //I think this is making the page refresh?
        
        }catch(err){  //how to catch errors
            console.log(err) //debugging 

         }
}


async function undoComplete(){   //Don't really understand why this works (Entire block)
    const todoText = this.parentNode.childNodes[1].innerText //I think it is how to are targeting the span
        try{ //Not sure what the try is 
        const response = await fetch('undoComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()
        console.log(data) //debug but I don't see this pop up in the console
        location.reload() //I think this is making the page refresh?
        
        }catch(err){  //how to catch errors
            console.log(err) //debugging 

         }
}




