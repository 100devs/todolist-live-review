const express = require('express') // import Express.js, everyone's favourite unopinionated framework for setting up a server!
const app = express() // instantiate(?) the app using all the methods from Express
const MongoClient = require('mongodb').MongoClient // import MongoDB module; the MongoClient lets us connect to our database
const PORT = 2121 // choose a port number. When the server runs locally, it's accessible at localhost://2121
require('dotenv').config() // uses the dotenv module to store data that is confidential
// declare db (a reference to the database, assigned below), dbConnectionStr (the connection string from MongoDB), and the dbName
let db, 
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // we actually connect to the database in this line (this returns a promise)
    .then(client => { 
        console.log(`Hey, connected to ${dbName} database`) // a quick message for us to see that the connection is established
        db = client.db(dbName) // assigning the client to the db variable from line 7
    })
    .catch(err =>{ 
        console.log(err) // catch any errors from the first promise, or the then codeblock
    })

app.set('view engine', 'ejs') // sets the app's view engine to EJS. Other options include handlebars, pug, etc.
app.use(express.static('public')) // middleware, tells the app to access public-facing (client-side?) files by looking in the public folder (located in the root directory of the project)
// these next two lines are also middleware that check for certain things in the request body 
app.use(express.urlencoded({ extended: true })) // parses through the body of the request, and checks that Content-Type header matches the type 
app.use(express.json()) // needed for POST or PUT requests, because they may have JSON payloads for our server. This parses incoming those requests.

app.get('/', async (req,res)=>{ // a route for the home directory of the app; callback arrow function needs to be async so we can await the documents from the database
    const todoItems = await db.collection('todos').find().toArray() // creates an array from the documents found in the 'todos' collection. This array is assigned to todoItems
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // returns the number of documents that are incomplete in the todos collection of our database
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // sends a response to render the index.ejs file; passes variables from the previous two lines using a config object, so that we can use the in index.ejs
})

app.post('/createTodo', (req, res)=>{ // a route to handle the post request of creating a new task/To-Do List item
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // access the 'todos' collection in the db database, inserts a document with the information from the POST request (req.body)
    // 'todoItem' must be the value we use for the input tag's name attribute (located in our index.ejs form)
    // the 'completed' field is set to be false by default, as you would only add incomplete tasks to a to-do list 
    .then(result =>{ // chaining a then onto the previous line of code so that it doesn't execute before the promise is fulfilled
        console.log('Todo has been added!') // output for us in the console's log
        res.redirect('/') // responds with a redirect back to the homepage, where the form was submitted.
    })
})

app.put('/markComplete', (req, res)=>{ // a route to update the documents we currently have in our database collection
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // access the 'todos' collection, searches for a document with a todo field of "req.body.rainbowUnicorn" (incoming from the client's fetch request)
        $set: { 
            completed: true // after finding the first document that meets the query's condition, update its 'completed' property value to 'true'
        }
    })
    .then(result =>{
        console.log('Marked Complete') // provides confirmation that the update was successful in the server's console
        res.json('Marked Complete') // responds with confirmation that the update was successful to the client
    })
})

app.put('/undo', (req, res)=>{ // this route is a lot like the one immediately before, except it sets the 'completed' value back to 'false' (three lines below)
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{ // a route to handle a delete request
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // access our database (db) 'todos' collection; search for and delete a document whose todo field is "req.body.rainbowUnicorn"
    .then(result =>{
        console.log('Deleted Todo') // provides confirmation that the update was successful in the server's console
        res.json('Deleted It') // responds with confirmation that the update was successful to the client
    })
    .catch( err => console.log(err)) // catches any errors
})
 
app.listen(process.env.PORT || PORT, ()=>{ // tells the app to listen for a connection on the port we chose, or the one chosen wherever our app is deployed
    console.log('Server is running, you better catch it!') // confirmation for us on the server-side console
})    
