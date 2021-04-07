// Initializing variables and assigning them to the span with class 'del', all spans within the parent class 'todoItem', and all spans with class 'completed' with parent class 'todoItem' respectively.
const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll(".todoItem span");
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// For each function adding a click event to the deleteBtn variable we assigned above. It will run the deleteTodo function on click.
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});
// forEach function adding a click event to the todoItem variable we assigned above. It will run the markComplete function on click.
Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});
// For each function adding a click event to the todoComplete variable we assigned above. It will run the undo function on click.
Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", undo);
});

// Function that runs when a user triggers the deleteBtn event. This function makes a call to the DELETE request we wrote in the server.js file on the path /deleteTodo.
async function deleteTodo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Function that runs when a user triggers the markComplete event. This function makes a call to the PUT request we wrote in the server.js file on the path /markComplete.
async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// Function that runs when a user triggers the undo event. This function makes a call to the PUT request we wrote in the server.js file on the path /undo.
async function undo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("undo", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
