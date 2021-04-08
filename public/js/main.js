alert("working");
// make sure that we have our main.js linked to our ejs file. <script>
// grabbing all of the elements with the .del class so we can add the event listener
const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll(".todoItem span");
const todoComplete = document.querySelectorAll(".todoItem span.completed");

// binding an event listener to every element (deleteBtn)
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", undo);
});

// now we need to write a function that makes a request to our server from the client side.
// what can we use from the client side to make a request to our server???!!
// .... we know that JS is single threaded language does not have the ability to make requests to the server!!!!
// BUUUTT js here is running inside the BROWSER! so it has access to WEB API's -- in this case --- .fetch()
// here we are using the async/await syntax
async function deleteTodo() {
  alert("delete clicked");
  // this is how we are grabing the thing that we are clicking on!!!!!!
  // we are going from the delete text that we just clicked (this) and we go up the li (parent node) and into the first span (grabing the text)
  const todoText = this.parentNode.childNodes[1].innerText;
  // we can go from the delete text that we clicked (.this) into the text that is in the other span elemet
  try {
    // in this fetch we can give whatever nave we want inside out API
    // ... here we are making a normal fetch and sending some extra info with that fetch.
    // sending an object along with the body. the object will have a property called rainbowUnicorn that will equal the text that is next to the delete that we clicked on.
    const response = await fetch("deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        // we can pullout the text next to the delete by using the rainbowUnicorn property (where the text was stored after we clicked delete)
        rainbowUnicorn: todoText,
        // we cound also use ids to match! might be a better option
      }),
    });
    // this will hear the response comming from the server
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

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
