const deleteBtn = document.querySelectorAll('.del') //variable for DOM delete class
const todoItem = document.querySelectorAll('.todoItem span') //Variable for todo item
const todoComplete = document.querySelectorAll('.todoItem span.completed') //variable for complete todo item

Array.from(deleteBtn).forEach((el)=>{       //loops through a created array and adds event listener calling deletTodo on click
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{        //loops through created array adding event listener calling markComplete on click
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{       //loops through created array adding event listener calling undo on clock
    el.addEventListener('click', undo)
})

async function deleteTodo(){        //declares async function 
    const todoText = this.parentNode.childNodes[1].innerText        //sets text of todo to innertext of parent node child
    try{                 //the attempt 
        const response = await fetch('deleteTodo', {        //API for deleting todo
            method: 'delete',       //specifies method
            headers: {'Content-type': 'application/json'},      //specifies parsing of data
            body: JSON.stringify({      //JSON data being passed
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()      //variable for response from fetch
        console.log(data)                       //logs the response
        location.reload()                       //reloads current location
    }catch(err){                                //Ass saver 9000
        console.log(err)
    }
}

async function markComplete(){      //function to mark that shit DONE
    const todoText = this.parentNode.childNodes[1].innerText        //gets todo text
    try{            //the attempt
        const response = await fetch('markComplete', {      //API setup
            method: 'put',      //specifies method
            headers: {'Content-type': 'application/json'},      //specifies parsing of data
            body: JSON.stringify({      //JSON data being passed
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()      //variable for response from fetch
        console.log(data)                       //logs that shit
        location.reload()                       //reloads current location
    }catch(err){                                //Ass saver 9000
        console.log(err)
    }
}

async function undo(){                          //Same stuff as above but for undoing whats been done
    const todoText = this.parentNode.childNodes[1].innerText    //gets todo text
    try{        //the attempt
        const response = await fetch('undo', {      //API setup
            method: 'put',      //Specifies method
            headers: {'Content-type': 'application/json'},      //specifies parsing of data
            body: JSON.stringify({      //JSON data being passed
                'rainbowUnicorn': todoText
            })
        })
        const data = await response.json()      //Variable for response from fetch
        console.log(data)                       //Shitlogger 4000
        location.reload()                       //nice spritz of REFRESH
    }catch(err){                                //Ass saver 9000
        console.log(err)
    }
}