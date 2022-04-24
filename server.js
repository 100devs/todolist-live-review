//Configurations - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//L1: Adds Express package to the Node project, L2 allows us to use the app, L3 requires MongoDB package, L4 sets up port to use with Localhost: <<PORT>>, and L5 requires dotenv package, allowing us to hide sensitive data like the MongoDB file using the .env file.
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

//creates variable to hold our database information
let db,
    //sets up URL for our database, which is stored secretly in the .env file
    dbConnectionStr = process.env.DB_STRING,
    //fetches name of MongoDB collection
    dbName = 'todo'

//Accesses MongoDB using our specified string. Returns a promise when connected which we either resolve and log confirmation of, or the promise is rejected and we throw the error
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    //Runs when MongoClient promise resolves
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    //Runs when MongoClient promise is rejected
    .catch(err =>{
        console.log(err)
    })

//Middleware! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -- - - - - - - - - - - - - - - - - - - - -
//Sets up express to use our ejs package to render our pages
app.set('view engine', 'ejs')
//Tells express to serve requests on pages from the "public" folder in our app
app.use(express.static('public'))
//No idea here. Something to do with parsing URL requests into the correct format for our app
app.use(express.urlencoded({ extended: true }))
//Tells our app to use built-in middleware to convert files to and from json data
app.use(express.json())



//Server Routing! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//This is the route for requests to 'read' our server
app.get('/', async (req,res)=>{
    //Asynchronously waits for MongoDB to return an array of our documents
    const todoItems = await db.collection('todos').find().toArray()
    //Asynchronously waits for MongoDB to return a count of all "incomplete" tasks on the todo list
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //Sends the data we got from MongoDB to our index.ejs page to be rendered our as HTML markup
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//This is the route for requests to 'create' something on our server
app.post('/createTodo', (req, res)=>{
    //Creates a new object which is inserted as a document into our MongoDB collection using the POST request data from our client. It also adds the "completed: false" property to this object which was not sent with the POST request.
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //Runs after db promise is resolved
    .then(result =>{
        //Logs our data and then makes a GET request to our initial server to reload the page.
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

//This is the route for requests to 'update' something on our server, marking things as complete
app.put('/markComplete', (req, res)=>{
    //Grabs the document in our database matching the "todo: <<info>>" that was sent from the client
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //Tells Mongo to update whatever properties are set in this object
        $set: {
            //Changes status from "completed: false" which was set in the POST route
            completed: true
        }
    })
    //Runs when db promise is resolved; logs the data to our server and then sends a json back to the client
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    //There should be a .catch here to log any errors and tell the user if there is an error
})

//This is the route for requests to 'update' something on our server, marking things as incomplete
app.put('/undo', (req, res)=>{
    //Grabs the document in our database matching the "todo: <<info>>" that was sent from the client
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //Tells Mongo to update whatever properties are set in this object
        $set: {
            //Changes status from "completed: false" which was set in the other PUT route
            completed: false
        }
    })
    //Runs when db promise is resolved; logs the data to our server and then sends a json back to the client
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
    //Again, missing the .catch for this promise, correct?
})

//This is the server route for DELETE requests from the client to our server
app.delete('/deleteTodo', (req, res)=>{
    //Grabs the matching document from the MongoDB collection, and tells Mongo to delete it
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //Runs after Mongo resolves its promise
    .then(result =>{
        //Console logs the confirmation and sends a json with confirmation data to the client
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    //Runs if the Mongo promise is rejected, throwing and error to our console
    .catch( err => console.log(err))
})

//Tells our server to begin listening for requests of all kinds on the port we set or the port prescribed by the .env file on heroku where it will be hosted.
app.listen(process.env.PORT || PORT, ()=>{
    //This is a technical term called a 'terrible joke', but it allows us to know that everything is connected properly when the server is requested to run
    console.log('Server is running, you better catch it!')
})    