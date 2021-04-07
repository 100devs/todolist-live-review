//this brings the express module into our server code
const express = require('express')
//this gives us a shorthand to call up express functions
const app = express()
//this brings in the Mongo module that'll let us connect to DB later
const MongoClient = require('mongodb').MongoClient
//this sets up a port variable for later use.
const PORT = 2121
//this lets us use a .env file to hide our secrets/personal info from the public on the github
require('dotenv').config()

//this sets up a variable we can store our database in for ease of use later, i assume it's set here to allow global access
let db,
//varuable to pull in data to access database from the .env file
    dbConnectionStr = process.env.DB_STRING,
    //variable to assign a name to the database
    dbName = 'todo'

    //establishing a connection to the Mongo database, one thing I'm not sure about is, does this connection remain active
    //while the user is on the site, or does it run through this code with each request made, making a new connection each time?
    //in other words, does this set up a sort of "listen" like our main server?
    MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    //after connection is made, inform of success via a console log
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        //assigning the connected database name to the variable
        db = client.db(dbName)
    })
    //this catches any errors and logs it for our information
    .catch(err =>{
        console.log(err)
    })

//turning on the module to let our code use EJS formatting for a template
app.set('view engine', 'ejs')
//any files put into 'public' can be easily called up by other files without any wacky pathing coding
app.use(express.static('public'))
//i'm not exactly sure how, but I know this is needed to transmit data to the server via the request.body
app.use(express.urlencoded({ extended: true }))
//allow us to send json data between client and server
app.use(express.json())

//any requests made to the root are resolved with this get, though I am very unfamiliar with the async/await technicalities other than "they just work"
app.get('/', async (req,res)=>{
    //grabs the data from the mongoDB, puts them into an array, and stores them in a variable
    const todoItems = await db.collection('todos').find().toArray()
    //grabs data from the mongoDB, counts how many are not marked as complete, returns an integer value
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //send the retrieved data to the EJS for dynamic formatting
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//post request to add an item to the list
app.post('/createTodo', (req, res)=>{
    //make a connection to the database, and insert a new document, using info from the request body to fill out the name, and a hard coded status field, all packaged like a JSON object
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //after the item has been added, logs a completed message
    .then(result =>{
        console.log('Todo has been added!')
        //redirects the browser to the root, also refreshing the data by pushing through another get request
        res.redirect('/')
    })
})

//an update request to the status of an item on the list to completed
app.put('/markComplete', (req, res)=>{
    //goes to the DB, searches for an item with the same name as the request.body.field
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //updates any found items with the below parameters, in this case setting completed to true
        $set: {
            completed: true
        }
    })
    //loggs a success on the server and sends a json object to also log a success on the client side
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

//an update request to mark an item on the list as not complete
app.put('/undo', (req, res)=>{
    //searches the DB for a document wih the same name field as req.body.rainbowUnicorn
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        //updates the found document with the parameters below, in this case setting completed to false
        $set: {
            completed: false
        }
    })
    //logs a success on the server and sends a json object to the client to also log a success
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

//this is a delete request to remove a document from the database
app.delete('/deleteTodo', (req, res)=>{
    //goes to the database, finds a record with the same name as req.body.rainbownUnicorn, and deletes it off the database
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    //upon completetion, logs a message on the server and sends a message to create a log on the client side.
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    //catches and logs any errors
    .catch( err => console.log(err))
})
 
//keeps a connection open to the client on the port in the .env file or the port selected in the code
//listening to any requests made from the client
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    