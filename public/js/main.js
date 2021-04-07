// collects all elements of the DOM with the class of 'del' in the form of a nodelist and stores them in a variable
const deleteBtn = document.querySelectorAll('.del')
// collects all spans in the DOM with the class of 'todoItem' in the form of a nodelist and stores them in a variable
const todoItem = document.querySelectorAll('.todoItem span')
// collects all spans in the DOM with the class of 'todoItem' and a class of 'completed in the form of a nodelist and stores them in a variable
const todoComplete = document.querySelectorAll('.todoItem span.completed')

// takes our deleteBtn variable which contains a nodeList and creates an array from it in order to use the forEach method and add an eventListener to each element in said array,each of which will trigger a deleteTodo function when clicked
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

// takes our todoItem variable which contains a nodeList and creates an array from it in order to use the forEach method and add an eventListener to each element in said array, each of which will trigger a markComplete function when clicked
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

// takes our todoComplete variable which contains a nodeList and creates an array from it in order to use the forEach method and add an eventListener to each element in said array, each of which will trigger a undo function when clicked
Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', undo)
})


async function deleteTodo(){
    // stores the text of the todo we are trying to delete
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // makes and awaits a fetch request to our database with the path of '/deleteTodo'
        const response = await fetch('deleteTodo', {
            // lets our app know the type of request we're making is for it to delete something in the database
            method: 'delete',
            // lets our app know the type of content we're sending with our request
            headers: {'Content-type': 'application/json'},
            // attaches a body to our request with the text of the document we want to delete for our app to find a match in the database. Makes sure we're sending JSON content our database will be able to read.
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // assigns our response in json format to the variable data when the fetch completes
        const data = await response.json()
        console.log(data)
        // refreshes the page when our request is done
        location.reload()
    }catch(err){
        // console logs any errors that occur in the fetch
        console.log(err)
    }
}

async function markComplete(){
        // stores the text of the todo we are trying to mark as complete
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // makes and awaits a fetch request to our database with the path of '/markComplete'
        const response = await fetch('markComplete', {
            // lets our app know the type of request we're making is for it to update something in the database
            method: 'put',
            // lets our app know the type of content we're sending with our request
            headers: {'Content-type': 'application/json'},
            // attaches a body to our request with the text of the document we want to update so our app can find a match in the database. Makes sure we're sending JSON content our database will be able to read.
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // assigns our response in json format to the variable data when the fetch completes
        const data = await response.json()
        console.log(data)
        // refreshes the page when our request is done
        location.reload()
    }catch(err){
        // console logs any errors that occur in the fetch
        console.log(err)
    }
}

async function undo(){
    // stores the text of the todo we are trying to mark as incomplete
    const todoText = this.parentNode.childNodes[1].innerText
    try{
        // makes and awaits a fetch request to our database with the path of '/undo'
        const response = await fetch('undo', {
            // lets our app know the type of request we're making is for it to update something in the database
            method: 'put',
            // lets our app know the type of content we're sending with our request
            headers: {'Content-type': 'application/json'},
            // attaches a body to our request with the text of the document we want to update so our app can find a match in the database. Makes sure we're sending JSON content our database will be able to read.
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
        // assigns our response in json format to the variable data when the fetch completes
        const data = await response.json()
        console.log(data)
        // refreshes the page when our request is done
        location.reload()
    }catch(err){
        // console logs any errors that occur in the fetch
        console.log(err)
    }
}