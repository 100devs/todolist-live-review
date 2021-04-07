//requiring express so we can use the package
const express = require('express')
//saving calling express to the app variable, so we don't have to constantly keep calling express manually
const app = express()
//requiring the mongodb package and calling MongoClient, saving it to MongoClient variable for future use
const MongoClient = require('mongodb').MongoClient
//setting the port we are going to use for testing the app.
const PORT = 2121
//requiring the dotenv package config so we can use environment file to hide sensitive info from github
require('dotenv').config()

//setting global db variable for future use
let db,
    //setting connection string to the string in our env file
    dbConnectionStr = process.env.DB_STRING,
    //setting the database name we are connecting to
    dbName = 'todo'

//connecting to the database on mongo atlass using the mongoclient variable and saved connection string    
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    //setting what happens when we connect to the database
    .then(client => {
        //logs to the console to let you know what database we connected to
        console.log(`Hey, connected to ${dbName} database`)
        //sets the global variable to the db we connected to
        db = client.db(dbName)
    })
    //this triggers if there is an error connecting to the database
    .catch(err =>{
        //logs the error
        console.log(err)
    })

//setting up the app so it can use the ejs files
app.set('view engine', 'ejs')
//setting up the app so it knows to look in the public folder for linked files 
app.use(express.static('public'))
//lets us use nested objects?
app.use(express.urlencoded({ extended: true }))
//codes the respones in json?
app.use(express.json())

//sets up the read route for our homepage, handles with async function
app.get('/', async (req,res)=>{
    //sets variable todoItems to an array with the items in the todos collection
    const todoItems = await db.collection('todos').find().toArray()
    //sets variable itemsLeft to only the items in the collection that aren't completed
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //sends the indes.ejs file as a response, passing in the two arrays we just created from the collection
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//sets up the post route that is used to created new todo items, the fetch way 
app.post('/createTodo', (req, res)=>{
    //connects to the todos collection and inserts a new todo using the request body, auto sets completed to false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //once the todo has been inserted, this handles the successful response
    .then(result =>{
        //logs success message to console
        console.log('Todo has been added!')
        //reloads the homepage where if all went well, will now have the new todo displayed
        res.redirect('/')
    })
})

//sets up the update route that is used to change the status of a todo to complete
app.put('/markComplete', (req, res)=>{
    //connects to the todos collection and we pass in the criteria for what we task we want to update first
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //we delare $set to make any needed updates to the item
        $set: {
            //this changes the completed status to true
            completed: true
        }
    })
    //handles the successful response to the above update
    .then(result =>{
        //logs the success message to the console
        console.log('Marked Complete')
        //responds to the requeste with json success message
        res.json('Marked Complete')
    })
})

//sets the update route for undoing tasks that were marked as complete
app.put('/undo', (req, res)=>{
    //connects to the todos collection, and passes in details for what task needs to be updated
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //declares the items we are going to change
        $set: {
            //changes status of completed back to false
            completed: false
        }
    })
    //handles success response from collection call above
    .then(result =>{
        //logs success message to the console
        console.log('Marked Complete')
        //response to request with success json message
        res.json('Marked Complete')
    })
})

//sets the delete route used to remove a todo from the list
app.delete('/deleteTodo', (req, res)=>{
    //connects to todos collection in db calls to delete one item that matches the passed in info from the request
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //handles success resonse from deletion call
    .then(result =>{
        //logs success message to the console
        console.log('Deleted Todo')
        //response to request with success message json
        res.json('Deleted It')
    })
    //handles error if occured in deletion call, logs error to console
    .catch( err => console.log(err))
})
 
//starts the server on either port provided by the environment, or the port we declared at the top
app.listen(process.env.PORT || PORT, ()=>{
    //logs success message to console
    console.log('Server is running, you better catch it!')
})    