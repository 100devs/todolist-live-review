const deleteButton = document.querySelectorAll('.delete')//Creating the delete button. Everytime the .delete class appears, grab them
Array.from(deleteButton).forEach((element) => {//Adding an eventListener to all the buttons that have the .delete class
    element.addEventListener('click', deleteListItem)//The name of the function. Makes it so that the function gets triggered by a click
})

async function deleteListItem() {//A fetch. Makes it so not only does the item get deleted from the frontend, but also on the mongo server
    const todoTextItem = this.parentNode.childNodes[1].innerText//grabs the dataItem span.Grabs the list item thats next to the delete button
    try {
        const response = await fetch('deleteListItem', {//The name thats going to appear in the api.
            method: 'delete', //The following code is just going to be all the things that describe this name in mongo
            headers: {'Content-type': "application/json"},
            body: JSON.stringify({//Making a request to the mongo to remove the item you want to delete
                'removedToDoItem': todoTextItem
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()//Refresh the page to reflect that we just removed a toDoListItem
    }catch {
        console.log(err)
    }
}