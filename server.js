const express = require('express') // declares a const to require the express module 
const app = express() // declares a const to reference express and use its methods
const MongoClient = require('mongodb').MongoClient // declares a const to reference and require use of mongodb
const PORT = 2121 // declares a constant to reference a port for our server to run on
require('dotenv').config() // a method that allows us to use an .env file which in this case will hold our mongodb connect string and allow us to reference it in a variable, thus keeping our password hidden

let db, // declare db variable
    dbConnectionStr = process.env.DB_STRING, // declares our connection string and assigns it to the string in our .env file
    dbName = 'todo' // declares our database name, and assigns it 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // this is a function that connects to our database. We pass in our connection string as the first variable, and I don't know what the second variable does, but setting that value as true is important
    .then(client => { // once we are connected to the database our client will do the following:
        console.log(`Hey, connected to ${dbName} database`) // we will get a console log message if we have successfully connected that will show us that we have done so
        db = client.db(dbName) // we are assigning a method to the db variable that passes in the name or our database
    }) //closes the .then parameters and function block 
    .catch(err =>{ // But what if there's an error? this method will catch it and print it to the console log so we can see what went wrong
        console.log(err) // this tells the console to display the error
    }) //closes the .catch parameters and function block 

app.set('view engine', 'ejs') // I don't know what this does but I think it's to help the browser know what to display?
app.use(express.static('public')) // this declares that static files are in the public folder
app.use(express.urlencoded({ extended: true })) // something about how to handle urls
app.use(express.json()) // declares how we will handle json 

app.get('/', async (req,res)=>{ // this get function will get and then display the index page
    const todoItems = await db.collection('todos').find().toArray() //decares and assigns an array of items in the todos collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //decares and assigns an array of items in the todos collection that have a state of completed which is false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //this points the todoItems and itemsLeft arrays to code in the index.ejs file that will display them in the browser   
}) //closes the get parameters and function block 

app.post('/createTodo', (req, res)=>{ //this post function will handle adding new todo items to our database
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //this will insert a new todo item into our todos collection with a state of completed that is false
    .then(result =>{ //then something will happen
        console.log('Todo has been added!') //the console will let us know a new todo has been added
        res.redirect('/') //the browser will redisplay index.ejs will will now show the new item added to the to do list
    }) //closes the .then parameters and function block
}) //closes the post parameters and function block

app.put('/markComplete', (req, res)=>{ //declares a put function and passes in parameters
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //uses the updateOne method to target our todo item
        $set: { //we are going to set
            completed: true //we are setting the completed state of the item to true
        } //close set block
    }) //closes the updateOne parameters and function block
    .then(result =>{ //then it will...
        console.log('Marked Complete') //it will display a message in the console log so we can see that the function ran
        res.json('Marked Complete') //I don't understand what this does specifically
    }) //closes the .then parameters and function block
}) //closes the put parameters and function block

app.put('/undo', (req, res)=>{ //declares a put function and passes in parameters
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //uses the updateOne method to target our todo item
        $set: { //we are going to set
            completed: false //we are setting the completed state of the item to false
        } //close set block
    }) //closes the updateOne parameters and function block
    .then(result =>{ //then it will...
        console.log('Marked Complete') //it will display a message in the console log so we can see that the function ran
        res.json('Marked Complete') //I don't understand what this does specifically
    }) //closes the .then parameters and function block
}) //closes the put parameters and function block

app.delete('/deleteTodo', (req, res)=>{ //declares a delete function and passes in parameters
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //uses the deleteOne method to target our todo item
    .then(result =>{ //then it will...
        console.log('Deleted Todo') //it will display a message in the console log so we can see that the function ran
        res.json('Deleted It') //I don't understand what this does specifically
    }) //closes the .then parameters and function block
    .catch( err => console.log(err)) // if there's an error this tells the console to display the error
}) //closes the delete parameters and function block
 
app.listen(process.env.PORT || PORT, ()=>{ //declares a listen function and passes in a PORT variable from the local environment if there is one, otherwise it passes in the one declared in line 4
    console.log('Server is running, you better catch it!') // this prints to the console that our server is running
}) //closes the listen parameters and function block