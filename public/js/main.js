//Select All elements with these classes
//And store respectivaly in variables
const deleteBtn = document.querySelectorAll('.del');
const todoItem = document.querySelectorAll('.todoItem span');
const todoComplete = document.querySelectorAll('.todoItem span.completed');

//Grab all the elements in an Arrays
Array.from(deleteBtn).forEach((el) => {
  el.addEventListener('click', deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener('click', markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener('click', undo);
});

//Function for delete todo item
async function deleteTodo() {
  //Path - How to capture the text on the list
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    //fetch(path, object about the fetch)
    const response = await fetch('deleteTodo', {
      method: 'delete',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        rainbowUnicorn: todoText,
      }),
    });
    const data = await response.json();
    console.log(data);
    //refresh the page
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

//Function to mark the item complete
async function markComplete() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
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

//Function to undo the complete task
async function undo() {
  const todoText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch('undo', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
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
