// these variables connect our js to elements in our ejs file so they may be targeted for click events
const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll(".todoItem span");
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// since we used a querySelectorAll method for our delete buttons, we want to convert it into an array of elements so we can iterate over them using the forEach array method. Each delete button is now ready to listen for an event listener so it can execute the 'deleteTodo' function
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

// since we used a querySelectorAll method for our span elements that hold our tasks, we want to convert it into an array of elements so we can iterate over them using the forEach array method. Each text span is now ready to listen for an event listener so it can execute the 'markComplete' function
Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

// since we used a querySelectorAll method for our span elements with a class of 'completed', we want to convert it into an array of elements so we can iterate over them using the forEach array method. Each text span that has a class of 'completed' is now ready to listen for an event listener so it can execute the 'undo' function
Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", undo);
});

// this function sends a promise to our 'deleteTodo' route in server.js. It tells our server that we want to delete the item that triggered the click event and we stringify it so that it is consistent with the format of the document in the database
async function deleteTodo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText
      })
    });
    // when the response if received, the page if refreshed
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// this function sends a promise to our 'markComplete' route in server.js. It tells our server that we want to update the item that triggered the click event and we stringify it so that it is consistent with the format of the document in the database
async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText
      })
    });
    // when the response if received, the page if refreshed
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

// this function sends a promise to our 'undo' route in server.js. It tells our server that we want to update the item that triggered the click event and we stringify it so that it is consistent with the format of the document in the database
async function undo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("undo", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        rainbowUnicorn: todoText
      })
    });
    // when the response if received, the page if refreshed
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
