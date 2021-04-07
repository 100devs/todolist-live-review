const deleteBtn = document.querySelectorAll('.del'); //save in variable to all html delete classes
const todoItem = document.querySelectorAll('.todoItem span'); //save in variable to all todoItem classes with spans
const todoComplete = document.querySelectorAll('.todoItem span.completed'); //save in variable to all todoItem classes spans.completed

//creates an Array from all deleteBtn and loops through every single one adding an event listener to each
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener('click', deleteTodo);
});

//creates an Array from all todoItem and loops through every single one adding an event listener to each
Array.from(todoItem).forEach((el) => {
  el.addEventListener('click', markComplete);
});

//creates an Array from all todoComplete and loops through every single one adding an event listener to each
Array.from(todoComplete).forEach((el) => {
  el.addEventListener('click', undo);
});

//async/await is a promise and try/catch is how you parse info and catch errors
async function deleteTodo() {
  const todoText = this.parentNode.childNodes[1].innerText; //variable is holding solely the text inside the span
  try {
    const response = await fetch('deleteTodo', {
      //trigger a delete request through a Fetch API
      method: 'delete', //method of handler, delete for delete
      headers: { 'Content-type': 'application/json' }, //tells the server type of data being sent, aka JSON
      body: JSON.stringify({
        //converts the information sent from the DOM into JSON to then send to the server
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json(); //returns json response from server
    console.log(data);
    location.reload(); //reloads after information is sent to show new render
  } catch (err) {
    console.log(err); //catches errors in fulfilling the promise
  }
}

//async/await is a promise and try/catch is how you parse info and catch errors
async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText; //variable is holding solely the text inside the span
  try {
    const response = await fetch('markComplete', {
      //trigger a put request through a Fetch API
      method: 'put', //method of the handler, put for update
      headers: { 'Content-type': 'application/json' }, //tells the server type of data being sent, aka JSON
      body: JSON.stringify({
        //converts the information sent from the DOM into JSON to then send to the server
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json(); //returns json response from server
    console.log(data);
    location.reload(); //reloads after information is sent to show new render
  } catch (err) {
    console.log(err); //catches errors in fulfilling the promise
  }
}

//async/await is a promise and try/catch is how you parse info and catch errors
async function undo() {
  const todoText = this.parentNode.childNodes[1].innerText; //variable is holding solely the text inside the span
  try {
    const response = await fetch('undo', {
      //trigger a put request through a Fetch API
      method: 'put', //method of the handler, put for update
      headers: { 'Content-type': 'application/json' }, //tells the server type of data being sent, aka JSON
      body: JSON.stringify({
        //converts the information sent from the DOM into JSON to then send to the server
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json(); //returns json response from server
    console.log(data);
    location.reload(); //reloads after information is sent to show new render
  } catch (err) {
    console.log(err); //catches errors in fulfilling the promise
  }
}
