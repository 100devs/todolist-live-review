// It's loading all the express functionality
const express = require('express')
// it says we are using express on our app
const app = express()
// we are loading mongoDB
const MongoClient = require('mongodb').MongoClient
// it opens a port (I really don't know why exactly)
const PORT = 2121
// dont know what this is or what dotenv is
require('dotenv').config()


let db,
  // Its saving the connection string inside a variable for using later (don't know why yet)
    dbConnectionStr = process.env.DB_STRING,
  // it sets the database name to 'todo'  
    dbName = 'todo'

  // we are connecting with the Mongo client using the connection string (I think it's the direction or the ID of this particular database)  and its telling that we are using an unified topology (whatever that is)
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // if we connect then...
    .then(client => {
        // we log a success message
        console.log(`Hey, connected to ${dbName} database`)
        // and we save the name of the database to the db variable (I think)
        db = client.db(dbName)
    })
    // if we can't connect
    .catch(err =>{
        // we log an error message
        console.log(err)
    })

    // I really don't know what is going on in these next 4 lines
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

    //this function handles the getting all the tasks on the list. don't know what that '/' is for
app.get('/', async (req,res)=>{
    //it saves all the to do tasks inside todoItems as an array, it waits until it's done and continues.
    const todoItems = await db.collection('todos').find().toArray()
    //saves the amount of todo tasks on the list (???)
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // no idea man. Something to do with the format in what it's going to be shown on the page maybe.
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

  //This function handles the creation of new tasks. Again, idk what the first argument of the post function is or why do we need it.
app.post('/createTodo', (req, res)=>{
    // Makes a promise to add the task to the list (don't know exactly how)
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // if it works, then...
    .then(result =>{
        // log a success message...
        console.log('Todo has been added!')
        // and... i don't know.
        res.redirect('/')
    })
})

  //This function handles the marking of a task as complete
app.put('/markComplete', (req, res)=>{
    // It updates the collection of tasks like... rainbowUnicorn??? what?
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            // Sets the state of the task to 'completed'
            completed: true
        }
    })
    // if it works...
    .then(result =>{
        // logs the success message
        console.log('Marked Complete')
        // sets that task as completed (don't know exactly how)
        res.json('Marked Complete')
    })
})

  //This function undoes the completion of a task
app.put('/undo', (req, res)=>{
    // changes the completion state of the task back to uncompleted
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    // If it works ...
    .then(result =>{
        // log the success message 
        console.log('Marked Complete')
        // and update this res object that I don't know exactly what's it's purpose. Maybe is the response of the promise (?)
        res.json('Marked Complete')
    })
})

  // This function deletes a task
app.delete('/deleteTodo', (req, res)=>{
    // goes to the todos collection and ... makes a promise...  I really don't know what goes on here or what an unicorn has to do with anything...
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // if it works (or resolves)
    .then(result =>{
        // log the success message
        console.log('Deleted Todo')
        // updates this response json file (?)
        res.json('Deleted It')
    })
    // if you cant... log the error
    .catch( err => console.log(err))
})

  // This function checks if the server is running (not sure)
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    