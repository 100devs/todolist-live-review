const express = require('express') // creates variable 'express' that allows us to use express
const app = express() //creates variable 'app' that uses express in this code
const MongoClient = require('mongodb').MongoClient // creates variable that allows us to connect to mongodb
const PORT = 2121 // variable that stores the localhost port we'll be using (local server)
require('dotenv').config() // allows us to have a file that stores our environment info?? (loads environment variables from a .env file into process.env)


let db, // creates variable 'db' but it is unassigned for now
    dbConnectionStr = process.env.DB_STRING, // creates variable 'dbConnectionStr' and assigns it 'process.env.DB_STRING' which grabs the DB_STRING from the .env file
    dbName = 'todo' // creates variable 'dbName' and assigns it 'todo' which is the name of the database in mongodb (does database === collection??)

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) // sets up the connection to mongodb with two parameters: the database connection string and an object that sets up 'useUnifiedTopology' and I do not know what that does. (have to include it to avoid errors, it is something newer that mongoclient is looking for)
    .then(client => { // .then is older syntax. 'client' holds the connection
        console.log(`Hey, connected to ${dbName} database`) // lets us know we're connected
        db = client.db(dbName) // assigns the connection (((('client.db(dbName)')))) to the variable 'db' so we can use it later
    })


app.set('view engine', 'ejs') // idk what this does but it allows us to use ejs files stores in views perhaps?
app.use(express.static('public')) // sets up a public folder thatautomatically renders
app.use(express.urlencoded({ extended: true })) // idk what this does
app.use(express.json()) // sets up json, probably

app.get('/', async (req,res)=>{ // start of a get/read request (get info from database) via the homepage with an async function with request and response parameters
    const todoItems = await db.collection('todos').find().toArray() // declares a variable that is a promise of an array from the 'todos' collection
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // declares a variable that is a promise of the number of incomplete items from the 'todos' database
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // the response from the database will be an ejs file that will provide the names of the items and the number of items left to complete, and they are assigned to the variables 'zebra' and 'left' (are they variables, or property names?)
})

app.post('/createTodo', (req, res)=>{ // start of a post/create request (posts info from the DOM to the database to potentially the DOM again?) via the route '/createTodo' with request and response parameters
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // goes into the todos collection and adds a todo to the collection with the properties(? or key value pairs? is that the same thing?) 'todo' and 'completed'
    .then(result =>{ // result holds the result/response?
        console.log('Todo has been added!') // lets us know the info was successfully added to the database
        res.redirect('/') // refreshes the page, which triggers another get request, which will get everything in the get request, including the new item we just posted
    })
})

app.put('/markComplete', (req, res)=>{ // start of a put/update request (update an item in the database) via the route '/markComplete' with request and response parameters
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // goes into the todos collection and finds the document(item) that matches the listed properties (?) ('todo' in this case)
        $set: { // updates the property (?)
            completed: true //this is the property (?) that gets updated
        }
    })
    .then(result =>{ // result holds the result/response?
        console.log('Marked Complete') // lets us know the update was made successfully in the database
        res.json('Marked Complete') //idk what this does and i know that for a fact
    })
})

app.put('/undo', (req, res)=>{ // start of another put/update request (update an item in the database) via the route '/undo' with request and response parameters
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // goes into the todos collection and finds the document(item) that matches the listed properties (?) ('todo' in this case)
        $set: { // updates the property (?)
            completed: false //this is the property and value (?) that gets updated
        }
    })
    .then(result =>{ // result holds the result/response?
        console.log('Marked Complete') // lets us know the update was made successfully in the database
        res.json('Marked Complete') // again idk
    })
})

app.delete('/deleteTodo', (req, res)=>{ // start of a delete request (delete an item in the database) via the route '/deleteTodo' with request and response parameters
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // goes into the todos collection and finds the document(item) that matches the listed properties (?) ('todo' in this case) and deletes it
    .then(result =>{ // result holds the result/response?
        console.log('Deleted Todo') // lets us know the delete was made successfully in the database
        res.json('Deleted It') // again idk
    })
    .catch( err => console.log(err)) // lets us know if there was an error in this process
})

app.listen(process.env.PORT || PORT, ()=>{ // connects app to the server, which is either heroku or localhost
    console.log('Server is running, you better catch it!') // lets us know we're connected to the server 
})
