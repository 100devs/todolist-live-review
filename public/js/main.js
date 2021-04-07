//This allows us to grab our span with the class of "del". It will let us create an action when it is clicked
const deleteBtn = document.querySelectorAll('.del')

//this will allow us to grab our span in the todoItem li. allows us to get the span if it is not "completed"
const todoItem = document.querySelectorAll('.todoItem span')

//This allows us to grab our span with the class of "del". It will let us create an action when it is clicked
const todoComplete = document.querySelectorAll('.todoItem span.completed')


//allows us to cycle through our ejs li and determine where the click for the delete occurred ???
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

//allows us to cycle through our ejs li and determine where the click for the mark complete occurred ???
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//allows us to cycle through our ejs li and determine where the click for the undo occurred ???
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})
//this async function allows us to connect to the app.delete in server.js . it selects the li wthat matches the "delete" that was clicked on and sends all that info to server.js in order for our Delete (From CRUD) to fire. At the end, it reloads our page, and by doing so, requestes a GET (The C in CRUD)
async function deleteTodo(){
    //selecting the li elements from ejs and putting them in constant todoText
    const todoText = this.parentNode.childNodes[1].innerText
    //making the request to the server with pathc deleteTodo, marked as method delete (CRUD), headers are just some meta data that is usually patched through http request, Do need to know now and who knows what it does. We are then saying that we want to send the body as a json file(s)
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
        //reload main page. initiates GET request from server.js
        location.reload()
    }catch(err){
        console.log(err)
    }
}
//This function allows us to send a PUT (Update request to the server.js). Specifically we want to rainbowUnicorn
async function markComplete(){
    //grabbing our li text from the ejs and putting them in variable todoText
    const todoText = this.parentNode.childNodes[1].innerText

    //making the request to the server with path markComplete, marked as method PUT (Update in CRUD), headers are just some meta data that is usually patched through http request, Do need to know now and who knows what it does. We are then saying that we want to send the body as a json file(s)
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        //log our results to data and reload the page (GET)
        const data = await response.json()
        console.log(data)
        location.reload()
        //catch error if things go south
    }catch(err){
        console.log(err)
    }
}


//here we have our antagonist to Function markComplete. We are in essense reversing the function markComplete and updating our li in ejs file back to "completed: false" that will take away our CSS style (the strike through). By default, we have our completed: in Mongo set as false, so we can only use this function once we have marked an li using
async function undo(){
    //grabbing text in ejs file and storing in variable todoText
    const todoText = this.parentNode.childNodes[1].innerText
    //sending PUT request through server.js
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
        //reload main page (sending GET request)
        location.reload()
        //Catch any errors if the "try" fails
    }catch(err){
        console.log(err)
    }
}