// variable that requires express module
const express = require('express')
//assigns the express stuff to variable app
const app = express()
//assigns MongoClient variable to require the mongo module, I don't know why the dot MongoClient is at the end
const MongoClient = require('mongodb').MongoClient
//assigns the port number that we will host our app on
const PORT = 2121
//requires the dotenv module that allows us to link the database string and other stuff in the .env file to the node code
require('dotenv').config()

//declares the db variable and assigns the dbConnectionStr to process.env.DB_STRING and declares/assigns dbName to 'todo
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//connects the database to our client-side code, then it lets us know that we are connected by console logging that fact, it assigns the client database name to the previously declared variable "db"... the catch will catch the error and log it to the console
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true})
    .then(client => {
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>
        console.error(error))

//this makes stuff render to the ejs after it's pulled from the database and processed through the client javascript/nodejs files -- we can use ejs as a templating engine (incorporate our javascript into the HTML)       
app.set('view engine', 'ejs')
//our static files are in the public folder and this code makes everything in the public folder accessible without having to use that folder name in the path
app.use(express.static('public'))
//express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }))
// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object. This method is called as a middleware in your application using the code: app.use(express.json());
app.use(express.json())

//this requests stuff in an asychronous manner for our index page
app.get('/', async (req, res) => {
// declares and assigns todoItems variable to the database collection named 'todos', finds the documents in the collection and puts them into an array
const todoItems = await db.collection('todos').find().toArray()
// declares and assigns itemsLeft to the database collection'todos', counts the documents with the keys of completed and values of false
const itemsLeft = await db.collection('todos').countDocuments(
    {completed: false})
// sends the previously declared and assigned todoItems to the index.ejs file and renders the todoItems and itemsLeft in the DOM
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// this creates a request using the createTodo action in the ejs file
app.post('/createTodo', (req, res) => {
// this creates in the database collection todos one todoItem (see previously declared and assigned variable) and inserts it as a document with two properties: key todo, value request body todoItem pulled from the input & key completed, value is false.
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
//then (after the previous code is successfully done) we need some kind of result as follows
    .then(result => {
//console logs 'todo has been added'
        console.log('Todo has been added')
//refreshes the index pages so that our new todo actually shows up
        res.redirect('/')
    })
})  

//put changes stuff in the database, and in this case we have a click event in our main js file, and when the node or element is clicked, it triggers the action 'markComplete'
app.put('/markComplete', (req, res) => {
// goes to the database todos collection and updates one document that matches the key todo and value req.body.rainbowUnicorn (it's not really rainbowUnicorn)
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
// $set outputs documents that contain all existing fields from the input documents and newly added fields. in this case, it will be an array of completed todo items
        $set: {
            completed: true
        }
    })
//this shows what we are going to do after $set is done
    .then(result =>
//we will console log marked complete
        console.log('Marked Complete'),
//this recognizes the incoming request object and sends it over to the client (our ejs & main js) and puts it in api
        res.json('Marked Complete')
)})


//put changes the complete items to incomplete in the database 
app.put('/undoComplete', (req, res) => {
//going to the todos collection and updating the document with the key of todo and the value of req.body.rainbowUnicorn (rainbowUnicorn just refers to the item that has been clicked on in the browser and has triggered the event listener and async function undoComplete in the main.js file)
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
//$set outputs documents that contain all existing fields from the input documents and newly added fields. in this case, it will be an array of completed todo items
        $set: {
            completed: false
        }
    })
//shows what we are doing after we update the documents
    .then(result =>
//this console logs marked incomplete
        console.log('Marked Incomplete'),
//this recognizes the incoming request object and sends it over to the client (our ejs & main.js) and puts it in api format
        res.json('Marked Incomplete')

)})

//this deletes the document that matches whatever was clicked on and triggered the event listener in the main.js file and fired the async function deleteTodo
app.delete('/deleteTodo', (req, res) => {
//goes to our todos collection and deletes one document that matches the item that was clicked on
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
//this is what happens after the db is updated (item deleted)
    .then(result => {
//console logs deleted todo
        console.log('Deleted Todo')
//recognizes the incoming request object and sends it over to the client (our ejs and main.js) and puts it in api format
        res.json('Deleted it')
    })
//this catches problems that occur while this function executes and logs the errors to the console
    .catch( err => console.log(err))
})

//sets the communication endpoint (the port/remote server or local host) that listens for our requests
app.listen(process.env.PORT || PORT, () => {
//console logs which port the server is running on
    console.log(`Server is running on port ${PORT}`)
})