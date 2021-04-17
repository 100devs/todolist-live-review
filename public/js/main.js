// Get array of buttons that have a class of .del
const deleteBtn = document.querySelectorAll(".del");
// Gets array of span tags that is nested under each todoItem class
const todoItem = document.querySelectorAll(".todoItem span");
// Get array of span items with a class of completed nested under the todoItem class
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// Convert deleteBtn to an array and then execute a loop for each item in the array
Array.from(deleteBtn).forEach((el) => {
  // If delete button is clicked, execute the deleteTodo
  el.addEventListener("click", deleteTodo);
});

// Convert todoItem to an array and then execute a loop for each item in the array
Array.from(todoItem).forEach((el) => {
  // If toodoItem is clicked, execute the markComplete
  el.addEventListener("click", markComplete);
});

// Convert todoComplete to an array and then execute a loop for each item in the array
Array.from(todoComplete).forEach((el) => {
  // If toodoComplete is clicked, execute undo
  el.addEventListener("click", undo);
});

async function deleteTodo() {
  // Gets the inner text of the todoItem
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    //   Sends a delete request to the deleteTodo route with a header of appplication/json, and a rainbowUnicorn property set to the todoText
    const response = await fetch("deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // Takes the response object and gets the json object back that was passed to it in the app.delete
    const data = await response.json();
    // Output in browser console the json message
    console.log(data);
    // Reloads the webpage
    location.reload();
  } catch (err) {
    //   Catches errors
    console.log(err);
  }
}
// For each todo item that does not have a span of completed, execute this function, if clicked.
async function markComplete() {
  //  Get inner text of todo item
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    //   send a fetch request with a put method, and pass the todoText value to it
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // Wait for the response to resolve and then parses the JSON into a javascript object
    const data = await response.json();
    // Console log the response
    console.log(data);
    // reload and execute the get request
    location.reload();
  } catch (err) {
    //   Catches any errors
    console.log(err);
  }
}

// This function is executed when items that have the class of completed are clicked, and so what this function does is it undoes the complete
async function undo() {
  // Gets the inner text of the list item
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    //   Sends a fetch PUT request to the server and passes in a object of todoText which contains the text of the list item
    const response = await fetch("undo", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // Waits to get back the json response sent by the server, and turns it into a JSON object
    const data = await response.json();
    // Outputs the response sent by the server
    console.log(data);
    // Reload the page by sending a get request
    location.reload();
  } catch (err) {
    //   Catches all errors
    console.log(err);
  }
}
