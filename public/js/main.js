//declares and assigns the variable deleteBtn to all content in elements with the class "del"
const deleteBtn = document.querySelectorAll('.del')
//declares and assigns the variable todoItem to all content in elements with the class "todoItem" within the span element
const todoItem = document.querySelectorAll('.todoItem span')
//declares and assigns the variable todoComplete to all content in elements with the class "todoitem" and spans with with class "completed"
const todoComplete = document.querySelectorAll('.todoItem span.completed')

//creates an array from all elements in the DOM having the class "del" and for each element it adds an event listener that fires the "deleteTodo" function on a click
Array.from(deleteBtn).forEach((el) => {
    el.addEventListener('click', deleteTodo)
})

//creates an array from all todoItems elements (as assigned above) in the DOM having the class "todoItem" in the span element, and for each element it adds an event listener that fires the "markComplete" function on a click
Array.from(todoItem).forEach((el) => {
    el.addEventListener('click', markComplete)
})

//creates an array from all todoComplete elements (as assigned above) in the DOM having the class "todoItem" in the span element with class "completed," and for each element it adds an event listener that fires the "undoComplete" function on a click
Array.from(todoComplete).forEach((el) => {
    el.addEventListener('click', undoComplete)
})

//declares the asychronous function deleteTodo 
async function deleteTodo() {
//declares and assigns the todoText to the parent (probably li) and child (probably span)nodes' innerText--i.e., the stuff that is already in the spans
    const todoText = this.parentNode.childNodes[1].innerText
//we are going to try to delete the todo
    try{
//declare and assign the the variable response (after we're done waiting for it to "fetch" the deleteTodo with the method 'delete' in the input, headers key "content-type" with value "application/json") and body key with stringify method for the rainbowUnicorn value(found in the server.js file) and value of todoText
        const response = await fetch('deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'rainbowUnicorn': todoText
            })
        })
//declare and assign the variable data to the response variable declared and assigned above, which yields data in json format, likely containing the DOM content referred to rainbowUnicorn property with todoText value
        const data = await response.json()
//console logs the rainbowUnicorn: todoText data per code above
        console.log(data)
//refreshes the index page so that the delete item is no longer visible
        location.reload()
//catches any errors
    } catch(err) {
//logs the errors to the console
        console.log(err)
    }
}

//declares the asychronous function markComplete
    async function markComplete() {
//declares and assigns the todoText to the parent (probably li) and child (probably span)nodes' innerText--i.e., the stuff that is already in the spans
        const todoText = this.parentNode.childNodes[1].innerText
//we are going to try to mark it complete
        try{
//declare and assign the the variable response (after we're done waiting for it to "fetch" the markComplete with the method 'put' in the input, headers key "content-type" with value "application/json") and body key with stringify method for the rainbowUnicorn value(found in the server.js file) and value of todoText
            const response = await fetch('markComplete', {
                method: 'put',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'rainbowUnicorn': todoText
                })
            })
//declares and assigns the data variable to await the response (see above) in json format
            const data = await response.json()
//logs the data (above) to the console
            console.log(data)
//refreshes the page so that the updated, strikethrough, gray text appears in the DOM
            location.reload()
//catches errors
        } catch(err) {
//logs errors to the console
            console.error(err)
        }
        }

//declares the asychronous function undoComplete
        async function undoComplete() {
//declares and assigns the todoText to the parent (probably li) and child (probably span)nodes' innerText--i.e., the stuff that is already in the spans
            const todoText = this.parentNode.childNodes[1].innerText
//we're going to try to undo the markComplete function with the following:
            try {
//declare and assign the the variable response (after we're done waiting for it to "fetch" the markComplete with the method 'put' in the input, headers key "content-type" with value "application/json") and body key with stringify method for the rainbowUnicorn value(found in the server.js file) and value of todoText
                const response = await fetch('undoComplete', {
                    method: 'put',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        'rainbowUnicorn': todoText
                    })
                })
//declares and assigns the data variable to await the response (see above) in json format
                const data = await response.json()
//logs the data in json format (see data variable above)
                console.log(data)
//refreshes the page so the previously marked-complete, gray text with a strikethrough is default black with no strikethrough
                location.reload()
//catches errors
            } catch(err) {
//logs errors to the console
                console.error(err)
            }
            }

