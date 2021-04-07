//require loads the modules and give the access
//to their exports. It is stored in a variable which
//can be any name but convention is to use the module name
const express = require('express')
    // calls the express application and store in variable app
    //We can say it as a newly created object
const app = express()

//connect to a database 
const MongoClient = require('mongodb').MongoClient
    // use the given port
const PORT = 2121
    //loads the dotenv modules, allows secrets about your
    //database credentials to be stored and shared
require('dotenv').config()
    //store your mongodb database credentials
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
    //connection configuration
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    //promise resolve
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    //promise unresolve display the error
    .catch(err => {
        console.log(err)
    })
    //set EJS as templating engine
app.set('view engine', 'ejs')
    //adds a middleware to maek it possible to access 
    //files from the public folder via HTTP
app.use(express.static('public'))
    // middleware that parses urlencoded with the querystring module
app.use(express.urlencoded({ extended: true }))
    //middleware that only parses JSON
app.use(express.json())
    // this function lets you define a route
    //handler for GET requests to a given URL.express is 
    //called when it receives an HTTP GET request to home dir /
    // conver this function that uses async/await 
app.get('/', async(req, res) => {
        //we call an await inside of the request handler and returns a
        //curosr to the documents that match the query criteria and converts into am array
        // to the cursor returned from the find
        const todoItems = await db.collection('todos').find().toArray()
        const itemsLeft = await db.collection('todos').countDocuments({ completed: false })

        // render function is used to render a view and sends the HMTL string to the client without the middleware
        // pass a local variable to the view
        res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
    })
    //user clicks on the button on HTML page, it will post request 
    //to server and get the response
app.post('/createTodo', (req, res) => {
        //insert a single document into a collection if it exists
        //else create the collection and insert the document into it.
        db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
            //returns a promise
            .then(result => {
                console.log('Todo has been added!')
                    //redirects the page to home
                res.redirect('/')
            })
    })
    //post and put methods are used to send data to the servers
    //PUT is used to update the data 

app.put('/markComplete', (req, res) => {
    // updateOne in the database updates the first collection that matches 
    //the specified filter.
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
            //set is used to specify the name of each field to add and sets it value
            // however if the name of the new field is the same as an existing field name,
            // $set overwrites th value of that field with the value of the specified expression
            $set: {
                completed: true
            }
        })
        //returns a promise
        .then(result => {
            console.log('Marked Complete')
                // res.json sends a JSON  response. it is 
                //identical to res.send() when an object or array is passed,
                //but it also converts non-objects(null,undefined) to JSON
            res.json('Marked Complete')
        })
})

app.put('/undo', (req, res) => {
        db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
                $set: {
                    completed: false
                }
            })
            .then(result => {
                console.log('Marked Complete')
                res.json('Marked Complete')
            })
    })
    //respond to a delete request to the /deleteTODO route
    //to delete a serverside file via http delete method
app.delete('/deleteTodo', (req, res) => {
        //removes a single document form the collection
        db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
            //returns a promise
            .then(result => {
                console.log('Deleted Todo')

                res.json('Deleted It')
            })
            //catch errors from the promise is rejected
            .catch(err => console.log(err))
    })
    //listens for the connections on the given path
    // binds and listens for connections on the specified host and port
    //process.env.port is used when hosting your app on another sevice,
    //so they can configure the variable for you or you can 
    //hardcode the PORT in your code
app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!')
})