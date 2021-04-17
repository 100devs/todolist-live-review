const deleteButton = document.querySelectorAll('.delete')//Creating the delete button. Everytime the .delete class appears, grab them
const toDoListItems = document.querySelectorAll('.toDoListItems span')//When you click on the span, you can mark it complete
const completedToDo = document.querySelectorAll('.toDoListItems span.done')//Grabs all of the todo items where the span has the .done class

Array.from(deleteButton).forEach((element) => {//Adding an eventListener to all the buttons that have the .delete class
    element.addEventListener('click', deleteListItem)//The name of the function. Makes it so that the function gets triggered by a click
})
async function deleteListItem() {
  //A fetch. Makes it so not only does the item get deleted from the frontend, but also on the mongo server
  const todoTextItem = this.parentNode.childNodes[1].innerText; //grabs the dataItem span.Grabs the list item thats next to the delete button
  try {
    const response = await fetch("deleteListItem", {
      //The name thats going to appear in the api.
      method: "delete", //The following code is just going to be all the things that describe this name in mongo
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        //Making a request to the mongo to remove the item you want to delete
        'item': todoTextItem,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload(); //Refresh the page to reflect that we just removed a toDoListItem
  } catch {
    console.log(err);
  }
}

Array.from(toDoListItems).forEach((element) => {//Adding an eventListener to all the buttons that have the .delete class
    element.addEventListener('click', markAsDone)//The name of the function. Makes it so that the function gets triggered by a click
})
async function markAsDone() {//A fetch. The remaining code here has the same syntax as the delete code, only with some slight things changed to fix the completed function
    const todoTextItem = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markAsDone', {
            method: 'put', 
            headers: {'Content-type': "application/json"},
            body: JSON.stringify({
                'item': todoTextItem
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()//Refresh the page to reflect that we just removed a toDoListItem
    }catch {
        console.log(err)
    }
}

Array.from(completedToDo).forEach((element) => {//Creating the ability to undo a already crossed off completed task
  element.addEventListener('click', undoCompleted)
})
async function undoCompleted() {//A fetch. The remaining code here has the same syntax as the markAsDone code, only with some slight things changed to fix the undoCompleted function
    const todoTextItem = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('undoCompleted', {
            method: 'put', 
            headers: {'Content-type': "application/json"},
            body: JSON.stringify({
                'item': todoTextItem
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()//Refresh the page to reflect that we just removed a toDoListItem
    }catch {
        console.log(err)
    }
}