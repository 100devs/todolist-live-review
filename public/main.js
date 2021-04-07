
//setting up our variables to select all items that match the requriements. 
//our delete button with the class of "del"
const deleteBtn = document.querySelectorAll(".del")
//our selector for all spans in todoITem
const todoItem = document.querySelectorAll(".todoItem span")
//selector for all todoItems which are completed
const todoComplete = document.querySelectorAll(".todoItem span.completed")

//from the array, for each element that has .del class, create on click event. Syntax problems in the first line. Don't understand why Array is capital letter and .from(deleteBtn). I don't think I could recreate this syntax on my own along with the above const declaration and below functions 
Array.from(deleteBtn).forEach((element)=>{
 element.addEventListener("click", deleteTodo)
})

//same as above, adding event listener on click
Array.from(todoItem).forEach((element)=>{
 element.addEventListener("click", markComplete)
})

// adding event listener on click for many elements.
Array.from(todoComplete).forEach((element)=>{
 element.addEventListener("click", undo)
})

//our function for the click event 
async function deleteTodo() {
  //not sure why we're declaring const todoText here... forgot the syntax here. 
 const todoText = this.parentNode.childNodes[1].innerText
  try{
    //ok very confused here. Syntax and what's happening
    const response = await fetch("deleteTodo", {
      method: "delete", 
      //don't know what are headers. 
      headers: {"Content-type": "application/json"},
      //don't know
      body: JSON.stringify({
       "rainbowUnicorn": todoText
      })
    })
//getting our response back and getting that data
    const data = await response.json()
    console.log(data)
    location.reload()
  }catch(err){
    console.log(err)
  }
}

//same as above, confused here on almost everything
async function markComplete() {
 const todoText = this.parentNode.childNodes[1].innerText
  try{
    const response = await fetch("markComplete", {
      method: "put", 
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
       "rainbowUnicorn": todoText
      })
    })

    const data = await response.json()
    console.log(data)
    location.reload()
  }catch(err){
    console.log(err)
  }
}

//same here, confused on a lot 
async function undo() {
 const todoText = this.parentNode.childNodes[1].innerText
  try{
    const response = await fetch("undo", {
      //are method, headers, body built into node? How does JS recognise them and know what to do. What are they called? 
      method: "put", 
      headers: {"Content-type": "application/json"},
      //not sure how we set rainbowUnicorn.. 
      body: JSON.stringify({
       "rainbowUnicorn": todoText
      })
    })

    const data = await response.json()
    console.log(data)
    location.reload()
  }catch(err){
    console.log(err)
  }
}