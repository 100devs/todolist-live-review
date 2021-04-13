
const deleteBtn = document.querySelectorAll('.del') // grab the delete button
const todoItem = document.querySelectorAll('.todoItem span') //select on span inside todoItem 
const todoComplete = document.querySelectorAll('.todoItem span.completed') //select completed class

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
}) //grab all of the .del data u got and put them in array and add eveent listener to all

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{ //adding event listener to listen for change in completed object
    el.addEventListener('click', undo)
})

async function deleteTodo(){
   const todoText = this.parentNode.childNodes[1].innerText //this is the thing clicked on(from span -delete, go up to li & into first span)
    try{
          const response=await fetch('deleteTodo', {  //this is where we tell the fetch we're about to use & its details
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
        const response = await fetch('markComplete',{  //the route to choose in the server.js
            method: 'put',
            headers: {'Content-type': 'application/json'}, //what kind of data to return
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        const data= await response.json()
        console.log(data)
        location.reload() //reload
    }catch(err){ // console.log error if there's a mistake
        console.log(err)
    }
}



async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('undo',{ //to distinguish between both puts
            method: 'put',
            headers: {'Content-type': 'application/json'}, //type of document to respond with
            body: JSON.stringify({
                'rainbowUnicorn': todoText  //send the text clicked on
            })
        })
        const data= await response.json()
        console.log(data)
        location.reload() //refresh page
    }catch(err){ //if promise fails log why (err)
        console.log(err) //console log error
    }
}
