// Constant variable declaration assigned to the element with del class property
const deleteBtn = document.querySelectorAll(".del");
// Constant variable declaration assigned to the element with todoItem class property as well as span
const todoItem = document.querySelectorAll(".todoItem span");
// Constant variable declaration assigned to the element with todoItem class property and span.completed
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// Creates new array from the deletedBtn query selector collection. Calls a forEach method passing the elements into an arrow function which assigns an event listening to a click event, calling the deleteTodo function
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

// Creates new array from the todoItem query selector collection. Calls a forEach method passing the elements into an arrow function which assigns an event listening to a click event, calling the markComplete function
Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

// Creates new array from the todoComplete query selector collection. Calls a forEach method passing the elements into an arrow function which assigns an event listening to a click event, calling the undo function
Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", undo);
});

// Async function declaration. Declares constant variable assigned to innerText node content tied to the object that called the function.
async function deleteTodo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  // Try block for attempting to seek an awaited promise call to the deleteTodo "action", passing along the delete method, proper header information and todoText info in a JSON string as the body info
  try {
    const response = await fetch("deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // Constant variable declaration awaiting the jsonified response object. Console logs the data and reloads the page
    const data = await response.json();
    console.log(data);
    location.reload();
    // Catch method call passing any error objects to be console logged
  } catch (err) {
    console.log(err);
  }
}

// Async function declaration. Declares constant variable assigned to innerText node content tied to the object that called the function.
async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText;
  // Try block for attempting to seek an awaited promise call to the markComplete "action", passing along the delete method, proper header information and todoText info in a JSON string as the body info
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // Constant variable declaration awaiting the jsonified response object. Console logs the data and reloads the page
    const data = await response.json();
    console.log(data);
    location.reload();
    // Catch method call passing any error objects to be console logged
  } catch (err) {
    console.log(err);
  }
}

// Async function declaration. Declares constant variable assigned to innerText node content tied to the object that called the function.
async function undo() {
  const todoText = this.parentNode.childNodes[1].innerText;

  // Try block for attempting to seek an awaited promise call to the markComplete "action", passing along the delete method, proper header information and todoText info in a JSON string as the body info
  try {
    const response = await fetch("undo", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });

    // Constant variable declaration awaiting the jsonified response object. Console logs the data and reloads the page
    const data = await response.json();
    console.log(data);
    location.reload();

    // Catch method call passing any error objects to be console logged
  } catch (err) {
    console.log(err);
  }
}
