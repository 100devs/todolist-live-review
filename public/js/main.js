//selects all items with a class of del and saves them to var deleteBtn
const deleteBtn = document.querySelectorAll('.del')
//selects all spans inside of elements with the class .todoItems and saves them to var todoItem
const todoItem = document.querySelectorAll('.todoItem span')
//selects all spans with completed class inside of elements with class .todoItems, saves them to todoComplete
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//creates array from deleteBtn items, and loops through each element
Array.from(deleteBtn).forEach((el)=>{
    //adds click event listener to each element, and callse deleteToDo function when clicked
    el.addEventListener('click', deleteTodo)
})

//creates array from todoItem items, and loops through each element
Array.from(todoItem).forEach((el)=>{
    //adds click event listener to each element, and callse mark complete function when clicked
    el.addEventListener('click', markComplete)
})

//creates array from todoComplete items, and loops through each element
Array.from(todoComplete).forEach((el)=>{
    //adds click event listener to each element, and callse undo function when clicked
    el.addEventListener('click', undo)
})

//declares async function called deleteTodo
async function deleteTodo(){
    //sets the todo text by looking at the parent node of what was clicked, and then taking the innertext from the first child
    const todoText = this.parentNode.childNodes[1].innerText
    //try path declares what we want the function to do
    try{
        //sets the fetch data and saves to the response variable, sends a fetch request to the /deleteTodo route
        const response = await fetch('deleteTodo', {
            //declares we are sending as a delete request
            method: 'delete',
            //I think this declares that we are sending json?
            headers: {'Content-type': 'application/json'},
            //sets the req body to a json element
            body: JSON.stringify({
                //passes in todoText as rainbowUnicorn which is used to locate the element in the db on the request
                'rainbowUnicorn': todoText
            })
        })
        //saves the fetch response as json into data variable
        const data = await response.json()
        //logs response that was saved in data variable to the console
        console.log(data)
        //reloads the homepage to reveal the todo was indeed removed
        location.reload()
    //catches any errors we might encounter in the try
    }catch(err){
        //logs err that causes try to break to console
        console.log(err)
    }
}

async function markComplete(){
    //sets the todo text by looking at the parent node of what was clicked, and then taking the innertext from the first child
    const todoText = this.parentNode.childNodes[1].innerText
    //try path declares what we want the function to do
    try{
        //sets the fetch data and saves to the response variable, sends a fetch request to the /markComplete route
        const response = await fetch('markComplete', {
            method: 'put',
            //I think this declares that we are sending json?
            headers: {'Content-type': 'application/json'},
            //sets the req body to a json element
            body: JSON.stringify({
                //passes in todoText as rainbowUnicorn which is used to locate the element in the db on the request
                'rainbowUnicorn': todoText
            })
        })
        //saves the fetch response as json into data variable
        const data = await response.json()
        //logs response that was saved in data variable to the console
        console.log(data)
        //reloads homescreen to reveal the item clicked was marked as complete
        location.reload()
    //catches any errors we might encounter in the try
    }catch(err){
        //logs err that causes try to break to console
        console.log(err)
    }
}

async function undo(){
    //sets the todo text by looking at the parent node of what was clicked, and then taking the innertext from the first child
    const todoText = this.parentNode.childNodes[1].innerText
    //try path declares what we want the function to do
    try{
        //saves the fetch results to the response variable, sends a fetch request to the /undo route
        const response = await fetch('undo', {
            method: 'put',
            //I think this declares that we are sending json?
            headers: {'Content-type': 'application/json'},
            //sets the req body to a json element
            body: JSON.stringify({
                //passes in todoText as rainbowUnicorn which is used to locate the element in the db on the request
                'rainbowUnicorn': todoText
            })
        })
        //saves the fetch response as json into data variable
        const data = await response.json()
        //logs response that was saved in data variable to the console
        console.log(data)
        //reloads homepage to reveal item clicked was changed back to uncomplete status
        location.reload()
    //catches any errors we might encounter in the try
    }catch(err){
        //logs err that causes try to break to console
        console.log(err)
    }
}