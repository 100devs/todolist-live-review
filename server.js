//initiate node and install dependencies
//npm init
//npm install express --save
//npm install mongodb --save
//npm install ejs --save
//npm install dotenv --save

//create a public folder for static files
//create views folder for ejs templates

//require dependencies
const express = require('express')
//get all the goodies from express into a variable for ease of use
const app = express()
//setup mongodb package to be able to connect to the database
const MongoClient = require('mongodb').MongoClient
//assign a port for the server
const PORT = 2121
//require dot env for security
require('dotenv').config()
//db holds databse
let db,
//string to connect to mongo Atlas
    dbConnectionStr = process.env.DB_STRING,
//hold the name of the database
    dbName = 'todo'
//connect to the database. connect takes connection string and an object. unified topology is special new stuff to avoid getting errors from atlas. This returns with the connection, it's a promise, once it resolves we get our connection
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//method that triggers once we get the response, the connection, client is holding the connection
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
//store the connection to the database into a variable. 
        db = client.db(dbName)
    })
//handle errors while connecting
    .catch(err =>{
        console.log(err)
    })
//setting up the server, everything that the server is gonna use
//set viewengine to ejs to use ejs files
app.set('view engine', 'ejs')
//use express static for files that the server can serve up
app.use(express.static('public'))
//To look at our application, at the requests and pull information from the requests, often from a form. never memorized
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//get request on the main route, /, and handle the response
app.get('/', async (req,res)=>{
    //go to the database and plug it into our ejs

    //go to collection todos in db, find() to find all the documents in the collection, put those objects into an array

    // $ db.collections('todos').find().toArray()
    //data is the array we got back
        // $ .then(data =>{
            // send data into the rendering, pass ejs file and object, we assign a key to the object and data as the value. pass the object into the ejs file
            // now when we see zebra in the ejs, we know its data, and data is the array of documents in the collection
        //    $ res.render('index.ejs', {zebra: data})
        // $ })


    // new syntax with async await (gotta review async await)
    // use connection to database, access collection 'todos', find all documents, put them inside an array. Store the array in a variable
    const todoItems = await db.collection('todos').find().toArray()
    // use connection to database, access collection 'todos' count documents that have completed: false, store number into a variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //respond with our ejs file
    // plug in zebra and left, with the arrays with all the documents and the number from the count into ejs so we can use them there
    // in ejs, zebra will be the array of all the todos documents, left the number of todos that are not completed
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

//route that will hear that post /createTodo from form action. Run a function aftear hearing that request 
app.post('/createTodo', (req, res)=>{
    //db is our connection to the database, create a collection, use insertOne() to insert a document into that todos collection
    // insertOne({}) is what properties will be stored, here we want to insert the to-do and wheter it has been completed - defaults to false
    // req.body is how we take a piece of the request from the body. we can grab parts of it with express
    //req.body will have a property from what we name the input in the form, in this case todoItem from ejs file
    //insertOne({x}) x, x on this document is req.body.todoItem takin the value from the input in the form, then we also add whatever we want, we create a property named completed and every time we submit we add a completed property that will be false
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    //if this promise resolves the we run this 
    .then(result =>{
        console.log('Todo has been added!')
        //we refresh the page as a response
        res.redirect('/')
    })
})

// route for markComplete function from our fetch
app.put('/markComplete', (req, res)=>{
    // go to db, select collection todos, updateOne takes in an object to compare the documents in the collection, with the text from the span we clicked in the request
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // update the completed key to true
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    // go to db, select collection todos, updateOne takes in an object to compare the documents in the collection, with the text from the span we clicked in the request
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // update completed key to false
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// delete route from the fetch request in the client side js
app.delete('/deleteTodo', (req, res)=>{
    // go to db, find collection todos, deleteOne({}) you pass in an object and it will try to find a match. an object whose todo value is the text inside the sister span to the one we clicked on the client side
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // since we used a promise we need the then
    .then(result =>{
        console.log('Deleted Todo')
        // answer the fetch with 'deleted it'
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
//actually start the server. Takes in a port and a callback once it connects
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    