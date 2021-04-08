const express = require('express') //Makes a variable to store express in. 
const app = express() //Makes a variable that implements express
const MongoClient = require('mongodb').MongoClient //Makes a variable to store MongoDB in.
const PORT = 2121 //Assigns a port number to the PORT variable, which is where your app will be hosted.
require('dotenv').config() //I don't know what this does. I think it's an additional NPM.

let db, //creating db as a variable; no value yet.
    dbConnectionStr = process.env.DB_STRING, //assigning dbConnectionStr a value. I don't understand what that value breaks down to be. 
    dbName = 'todo' //Assigning the name of the database to 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //connecting the MongoClient to the dbConnectionStr. I don't know what unifiedTopology is.
    .then(client => { //.then I think is a function attached to APIs. So it's doing something in regards to that here. 
        console.log(`Hey, connected to ${dbName} database`) //Setting up a console log notificaiton telling you what database you're connected to.
        db = client.db(dbName) //finally assigning that db value that was declared earlier. Not sure how 'client' plays into it or how the value is broken down. 
    })
    .catch(err =>{ //Catch function where it talks about IF there's an error...
        console.log(err)//console log that there's an error. 
    })

app.set('view engine', 'ejs')//I think that this makes it so we can use ejs, but not sure. 
app.use(express.static('public')) //I think that this lets us use our public folder, but also not sure. 
app.use(express.urlencoded({ extended: true }))//I don't know what this is.
app.use(express.json())//Lets use use json in Express.

app.get('/', async (req,res)=>{//Reading and taking us to the base homepage (/). Also setting up an async/await function. 
    const todoItems = await db.collection('todos').find().toArray()//assigning todoItems the value of waiting for the database collection to find its values and put them into an array. 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})//assigning itemsLeft to wait for the database collection of todos to count documents. Not sure what the value of false has to do with this here.
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})//Renders the index.ejs doc. Not sure what the zebra:todoItems and left:itemsLeft do.
})

app.post('/createTodo', (req, res)=>{//starts the post() function and sets the destination of the page to be /createTodo.
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})//Inserts an uncompleted todo item to the database collection.
    .then(result =>{//.then() function called. Probably means what will happen after the condition above is fulfilled. 
        console.log('Todo has been added!')//console logs that a todo item has been added. 
        res.redirect('/')//redirects to main page.
    })
})

app.put('/markComplete', (req, res)=>{//starts the put() function. I think this is the Update in CRUD. Sets the destination page to be /markComplete.
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//Updates the todos in the database. I don't know what req.body.rainbowUnicorn is/does.
        $set: { //I don't know why it looks like $set, but this is setting the boolean value of the todo item.
            completed: true//Setting the boolean value of the todo item.
        }
    })
    .then(result =>{//taking the consequent value of the result
        console.log('Marked Complete')//console logging that the item is marked complete. 
        res.json('Marked Complete')//Inputting to the JSOn that the item is marked complete. 
    })
})

app.put('/undo', (req, res)=>{//For updating undoing whether a function is completed or not; destination is /undo.
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{//Updating one of the todo items
        $set: {//Setting the boolean value of the todo item.
            completed: false//Setting the boolean value of 'completed' to be false. 
        }
    })
    .then(result =>{//Taking the result of the above
        console.log('Marked Complete')//console logging that the item is marked complete. 
        res.json('Marked Complete')//Inputting to the JSOn that the item is marked complete.
    })
})

app.delete('/deleteTodo', (req, res)=>{//Delete step of CRUD. Starting the delete() function. Destination is /deleteTodo.
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})//Deleting one of the todo items.
    .then(result =>{//taking the result and
        console.log('Deleted Todo')//console logging that the item is deleted.
        res.json('Deleted It')//Inputting to the JSOn that the item is deleted.
    })
    .catch( err => console.log(err))//catch() function catching any of the errors. If there are any, console logging the error. 
})
 
app.listen(process.env.PORT || PORT, ()=>{//Making the server listen on the determined PORT or whatever PORT MongoDB assigns to it. 
    console.log('Server is running, you better catch it!')//Console logging that the server is up and running.
})    