const deleteBtn = document.querySelectorAll('.delete')//sets variable deleteBtn and selects all objects in the document with 'delete' class
const todoItem = document.querySelectorAll('.todoItem span')//sets variable todoItem and selects all objects in the document with 'todoItem' class and which are spans
const todoComplete = document.querySelectorAll('.todoItem span.completed')//sets variable todoItemComplete and selects all objects in the document with 'todoItem' class and which are completed spans

Array.from(deleteBtn).forEach((element) => {//for each element that lies within the deleteBtn variable...
    element.addEventListener('click', deleteTodo)//...create an event listener that, on click, runs the deleteTodo function
})

Array.from(todoItem).forEach((element) => {//for each element that lies within the todoItem variable...
    element.addEventListener('click', markComplete)//...create an event listener that, on click, runs the markComplete function
})

Array.from(todoComplete).forEach((element) => {//for each element that lies within the todoComplete variable...
    element.addEventListener('click', undo)//...create an event listener that, on click, runs the undo function
})

async function deleteTodo(){//creaets async function deleteTodo
    const todoText = this.parentNode.childNodes[1].innerText //go up to the li, grab the span, grab the text within the span... what a doozy
    try{
        const response = await fetch('deleteTodo', {//creates variable response that awaits the fetch request from the event listener
            method: 'delete',//then runs this delete method
            headers: {'Content-type': 'application/json'},//only applies to content with the json content type?
            body: JSON.stringify({//parses json
                'rainbowUnicorn': todoText//not really sure here. I know that rainbowUnicorn is a property that has been set, so if it has this property run the todoText from above?
            })
        })
        const data = await response.json()//sets data to wait for json response
        console.log(data)//logs the json response
        location.reload()//refreshes page
    }catch(err){//catches error
        console.log(err)//logs error
    }
}

async function markComplete(){//creates new async function
    const todoText = this.parentNode.childNodes[1].innerText //go up to the li, grab the span, grab the text within the span
    try{
        const response = await fetch('markComplete', {//creates response, which waits for markComplete to be called
            method: 'put',//sets the method for response to 'put', so that we know this function is updating an object
            headers: {'Content-type': 'application/json'},//json content type
            body: JSON.stringify({//parses json
                'rainbowUnicorn': todoText//if object contains this property, implement todoText from above
            })
        })
        const data = await response.json()//creates data and sets it to wait for a response from json
        console.log(data)//logs data
        location.reload()//refreshes page
    }catch(err){//catches error
        console.log(err)//logs error
    }
}

async function undo(){
    const todoText = this.parentNode.childNodes[1].innerText //go up to the li, grab the span, grab the text within the span... what a doozy
    try{
        const response = await fetch('undo', {//waits on eventListener to be called for 'undo'
            method: 'put',//another update method
            headers: {'Content-type': 'application/json'},//json content type
            body: JSON.stringify({//parses json
                'rainbowUnicorn': todoText//if rainbowUni, use todoText
            })
        })
        const data = await response.json()//sets data to wait for json response
        console.log(data)//logs data
        location.reload()//refreshes page
    }catch(err){//catches error
        console.log(err)//logs error
    }
}
