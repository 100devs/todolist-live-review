//// heavily commented for #100DEVS!
const deleteBtn = document.querySelectorAll(".delete") //const to store the x's
const todoItem = document.querySelectorAll(".todoItem span") //const to store the list of todo items
const completedItem = document.querySelectorAll(".todoItem span.completed") // const to store the list of ocmpleted items
const themes = document.querySelectorAll(".theme") //const to store the theme class. put it in a variable to experiment with theme changes
const body = document.querySelector('body') // const to store the body element
// let theme = 'yellowTheme'   // experimenting with changing themes

Array.from(deleteBtn).forEach(el => {  // using from method on array obj to create array from deleteBtn (the x's), calling forEach, passing in arrow function with el as an argument, el being dummy var for each item
    el.addEventListener('click', deleteTodo) //add an event listener to each element in the array created from delete Btn. Listens for click, on click runs function called deleteTodo
}) //close forEach block, close forEach

Array.from(todoItem).forEach(el => { // same as line 9 but array is being created from todoItem which holds the list of to do items
    el.addEventListener('click', markComplete) //add an event listener which runs markComplete on click of todo item
}) //close forEach block, close forEach

Array.from(completedItem).forEach(el => { //another one, this time for all completed items
    el.addEventListener('click', undoComplete) //add event listener which runs the undoComplete function on click
}) //close forEach block, close forEach

// Array.from(themes).forEach(theme => theme.addEventListener('click', changeTheme))    // experimenting with changing themes

async function deleteTodo(){ //defining an asyncronous function called deleteTodo - I need to practice more on these.
    // alert("you clicked delete") //to test if the js file is working
    const todoText = this.parentNode.childNodes[1].innerText.trim() // 1 because space is at index 0, trim to remove space padding the string
    // console.dir(todoText.length) //verifying that the todoText doesn't have funky space
    try { //defining try block
        const response = await fetch('deleteTodo', { //request to server, route is deleteTodo. we will await the response
            method: 'delete', //it's going to be a delete request
            headers: {'Content-type': 'application/json'}, //we are sending json
            body: JSON.stringify({ //we also sending a request body
                'clickedText': todoText //it contains the property clickedText which is set to todoText which was defined on line 25
            })
        })
        const data = await response.json() // waiting for data from response to be parsed to .json format?
        // console.log(data) //just to see what data looks like. runs after the await is resolved
        location.reload() //reload the page
    } catch (err) { console.error(err) } //console error any errors if try block doesn't work

}

async function markComplete() {  //another async function called markComplete
    const todoText = this.parentNode.childNodes[1].innerText.trim() //defining the text we are looking to match, just like on line 25
    try {  //starting the try block which is all the code that we will try, moving to the error block if there are errors
        const response = await fetch('markComplete', { //defining response which is a fetch to the 'markComplete' route? and with it passing along this object
            method: 'put', //which includes a method property of 'put' (because it's a put request)
            headers: { 'Content-type': 'application/json' }, // letting the server know to expect JSON format
            body: JSON.stringify({ //create a body property and then use stringify JSON method to hold the following in body, in JSON notation
                'itemToMark': todoText //property 'itemToMark' containing the text from the DOM, on line 43
            }) //close the to-be JSON formatted object, closing paren on the stringify method
        }) //close the object passed into the fetch, closing paren on fetch
        const data = await response.json() //another const to wait for the response to come back from the fetch on line 45, which is in JSON, and .json() converts it to a Javascript object? which ine 62 in server.js will read...
        // console.log(data)
        location.reload() //refresh the page, initiating another get request
    } catch (err) { console.error(err) } //console error any errors if try block doesn't work
}

async function undoComplete() { //yet another async function definition, this one is undoComplete
    const todoText = this.parentNode.childNodes[1].innerText.trim() //same as the last async function
    try { //starting try block
        const response = await fetch('undoComplete', { //another fetch request which is sending an object, this time to the url undoComplete
            method: 'put', // put method
            headers: { 'Content-type': 'application/json' }, //in json format
            body: JSON.stringify({ //create the body property
                'itemToUndo': todoText //set itemToUndo to the todoText defined on line 59
            }) // close the stringify call
        }) //close the fetch
        const data = await response.json() // we are waiting for data to come back, make it readable to server.js
        // console.log(data)
        location.reload() //refresh the page
    } catch (err) { console.error(err) } //console error any errors if try block doesn't work
}

// function changeTheme(){                        // experimenting with changing themes
//     let text = this.textContent.split(' ')
//     let currentClass = body.classList.value
//     text = text[0].toLowerCase() + text[1]
//     theme = text

//     console.log(theme, text, currentClass)

//     body.classList.remove(currentClass)
//     body.classList.add(text)
// }
