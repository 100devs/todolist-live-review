const deleteBtn = document.querySelectorAll('.del') // I don't understand why this is set up this way
const todoItem = document.querySelectorAll('.todoItem span') // I don't understand why this is set up this way
const todoComplete = document.querySelectorAll('.todoItem span.completed') // I don't understand why this is set up this way

Array.from(deleteBtn).forEach((el)=>{ // takes the array from deleteBtn and puts event listener on each
    el.addEventListener('click', deleteTodo) // adds event listener to the button for when it's clicked
})

Array.from(todoItem).forEach((el)=>{ // takes the array from todoItem and puts event listener on each
  el.addEventListener("click", markComplete); // adds event listener for when it's clicked
})

Array.from(todoComplete).forEach((el)=>{ //takes the array from todoComplete and puts event listener on each
  el.addEventListener("click", undo); // adds event listener for when it's clicked
})

async function deleteTodo(){ // defines this as an async function
    const todoText = this.parentNode.childNodes[1].innerText // defines this as the inner text of the span
    try{ // asks to try the code inside it
        const response = await fetch('deleteTodo', {// await won't run until the deleteTodo is run
            method: 'delete', // tells the server to delete
            headers: {'Content-type': 'application/json'}, // tells the server what to expect & specifies the content type as a json application
            body: JSON.stringify({ // sends the data to the server as a string as it has to be
                'rainbowUnicorn': todoText // sends the span innertext we clicked on to the server as "rainbowUnicorn"
            })
        })
        const data = await response.json() // sets data to await the JSON to be extracted
        console.log(data)
        location.reload()//reload the data, works the smae as refreshing browser
    }catch(err){ // if there's an exception catch will take it
        console.log(err) // and console log it because we told it to
    }
}

async function markComplete(){ // defines this as an async function
    const todoText = this.parentNode.childNodes[1].innerText // sets todoText as the span we clicked
    try{ // tells it to try the code in the curly brackets
        const response = await fetch('markComplete', { // awaits the fetch of mark complete
            method: 'put', // tells server it's updating something
            headers: {'Content-type': 'application/json'}, // tells the server what to expect & specifies the content type as a json application
            body: JSON.stringify({ // turns the request into a string
                'rainbowUnicorn': todoText // calls the content stored "rainbowUnicorn"
            })
        })
        const data = await response.json() // sets data to extracted JSON
        console.log(data)
        location.reload() // refreshes browser
    }catch(err){ // catches errors
        console.log(err)
    }
}

async function undo(){// defines this as an async function
  const todoText = this.parentNode.childNodes[1].innerText; // sets todoText as the span we clicked
  try { // trys the code inside curly brces
    const response = await fetch("undo", { // defines response as the result of the fetch action
      method: "put", // tells server it's updating something
      headers: { "Content-type": "application/json" }, // tells server to expect JSON back
      body: JSON.stringify({ // turns data into a JSON string
        rainbowUnicorn: todoText, // the data we extracted form the span in assinged rainbowUNicorn
      }),
    });
    const data = await response.json(); // sets data to extracted JSON
    console.log(data);
    location.reload(); // refreshes app
  } catch (err) { // catches errors
    console.log(err); // console logs the errors
  }
}