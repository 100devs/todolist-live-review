const express = require('express') // assign the express module as the express variable so it can be used
const app = express() // call express and assign the result to the app variable so methods are available
const MongoClient = require('mongodb').MongoClient // assign the mongodb module's MongoClient class as the MongoClient variable so it can be used
const PORT = 2121 // assign 2121 as the PORT variable
require('dotenv').config() // call the dotenv module's config method so we can use the .env file's entries as process.env.entryname

let db, // initialise a db variable
    dbConnectionStr = process.env.DB_STRING, // assign the value from the .env file associated with the property DB_STRING to the dbConnectionStr variable
    dbName = 'todo' // assign 'todo' to the dbName variable

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // connect to MongoDB Atlas using the connection string and get rid of the annoying topology error in the console
    .then(client => { // once connected, use the returned client
        console.log(`Hey, connected to ${dbName} database`) // log this to the server's terminal
        db = client.db(dbName) // assign the cluster from MongoDB to the db variable initialised on line 7
    })
    .catch(err =>{ // if there's an error connecting, take the error
        console.log(err) // log the error in the server's terminal
    })

app.set('view engine', 'ejs') // tell Express to use ejs to compile any calls to the render method into HTML
app.use(express.static('public')) // tell Express to use the public folder as the root path for any requests not specified
app.use(express.urlencoded({ extended: true })) // tell express to handle URL parameters properly
app.use(express.json()) // tell Express to convert HTML form encoding into JSON

app.get('/', async (req,res)=>{ // intercept any browser navigation requests to the root of the site
    const todoItems = await db.collection('todos').find().toArray() // find the todos document from MongoDB, turn it into an array and assign it to the todoItems variable
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // find the todos document from MongoDB, count how many have their completed value equal to false and assign it to the itemsLeft variable
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // send the browser an HTML file compiled from the index EJS file being passed zebra and left as arguments
})

app.post('/createTodo', (req, res)=>{ // intercept any requests sent using the post method to the root/createTodo path
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // get the todos collection from MongoDB and add a new todo with todo and completed properties. todo's value is the todoitem value sent from the browser
    .then(result =>{ // after adding the new todo to the collection
        console.log('Todo has been added!') // log this to the server's terminal
        res.redirect('/') // respond to the browser with a hint to redirect to the root and an ok response
    })
})

app.put('/markComplete', (req, res)=>{ // intercept any requests sent using the put method to the root/markComplete path
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // get the todos collection from MongoDB and find the first todo with a todo property matching the browser request's rainbowUnicorn value
        $set: { // change a field in the document
            completed: true // add/replace the completed field to true
        }
    })
    .then(result =>{ // after adding/updating the completed field
        console.log('Marked Complete') // log this to the server's terminal
        res.json('Marked Complete') // respond to the browser with this message and a 200 ok response
    })
})

app.put('/undo', (req, res)=>{ // intercept any requests sent using the put method to the root/undo path
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // get the todos collection from MongoDB and find the first todo with a todo property matching the browser request's rainbowUnicorn value
        $set: { // change a field in the document
            completed: false // add/replace the completed field to false
        }
    })
    .then(result =>{ // after adding/updating the completed field
        console.log('Marked Complete') // log this to the server's terminal
        res.json('Marked Complete') // respond to the browser with this message and a 200 ok response
    })
})

app.delete('/deleteTodo', (req, res)=>{ // intercept any requests sent using the delete method to the root/deleteTodo path
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // get the todos collection from MongoDB, find the first todo with a todo property matching the browser request's rainbowUnicorn value and delete the todo document
    .then(result =>{ // after deleting the document
        console.log('Deleted Todo') // log this to the server's terminal
        res.json('Deleted It') // respond to the browser with this message and a 200 ok response
    })
    .catch( err => console.log(err)) // if there's a problem getting the collection or document, or a problem deleting log the error to the server's terminal
})

app.listen(process.env.PORT || PORT, ()=>{ // listen for any browser requests made to localhost:PORT where PORT is the port value from the .env file or, if it's not there, the PORT variable on line 4
    console.log('Server is running, you better catch it!') // log this to the server's terminal, have a little chuckle
})