// we are grabbing our DOM elements and storing them in
// their respective variables
const deleteBtn = document.querySelectorAll(".del");
// We grab all the span elements inside the todoItem class
const todoItem = document.querySelectorAll(".todoItem span");
// we grab all the spans with a completed class added to it inside
// our todoItem class
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// We create an array out of the above variables
// and iterate through each of the elements/items
// adding an event which fires up on click
// We then setup a call back function for something
// to happen when the said item is clicked

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", undo);
});

// WE use an async function as we have to do fetch here
async function deleteTodo() {
  // we are storing the clicked items inner text into this variable
  // by first grabbing its parent which is li and then the span
  // and then targetting the first child because at index 0 its gonna be
  // an empty space as since all the nodes are interconnected inside the DOM
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    // We are making a normal fetch fetch(deleteTodo) and we are
    const response = await fetch("deleteTodo", {
      // sending some info, we say its a delete request
      method: "delete",
      // I DONT UNDERSTAND THIS
      headers: { "Content-type": "application/json" },
      // I DONT UUNDERSTAND THIS
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    // I DONT KNOW WHY WE DO THIS
    const data = await response.json();
    console.log(data);
    // we reload the page
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      // sending some info, we say its a put request
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
