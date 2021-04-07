// variable that tells us express is required for this server to run
const express = require('express')
// not entirely sure why we do this but I know it is the root of all that we do with Node.js
const app = express()
// variable that tells us mongodb is required for this server to run
const MongoClient = require('mongodb').MongoClient
// variable for the port we run our server on
const PORT = 2121
// allows us to have sensitive lines in other locations that dont need to be seen by everyone
require('dotenv').config()

// variable for our database that will be assigned something
let db,
    // variable that grabs our "DB_STRING" from the .env file
    dbConnectionStr = process.env.DB_STRING,
    // name of the database variable
    dbName = 'todo'

// creates a promise to connect our server to our mongodb cluster 
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    // then method returns the promise as client and console.logs a string and gives db an assignment
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    // catch method is here to catch any errors
    .catch(err =>{
        console.log(err)
    })

// express.js set function so our server knows to read ejs
app.set('view engine', 'ejs')
// express.js use and static function used to show code from the public folder
app.use(express.static('public'))
// not really sure what this does
app.use(express.urlencoded({ extended: true }))
// I think this makes requests and responses json
app.use(express.json())

// get method creates a request to our server to get info from the db
app.get('/', async (req,res)=>{
    // variable that grabs info from the database and puts it into an array
    const todoItems = await db.collection('todos').find().toArray()
    // variable for the number of items in the db collection that has completed: false
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // renders the index.ejs file and puts the info from zebra and left into the ejs
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// post method creates a new item in our db collection
app.post('/createTodo', (req, res)=>{
    // insertOne posts the input value to our db and ejs
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    // then returns the promise and console.logs and redirects back to the main server url
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

// put method updates db collection items
app.put('/markComplete', (req, res)=>{
    // updateOne updates our db and ejs
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // not sure what $set is but I know that it changes our collections completed to true
        $set: {
            completed: true
        }
    })
    // returns promise and console.logs and res.jsons
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// put method updates db collection items
app.put('/undo', (req, res)=>{
    // updateOne updates our db and ejs
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        // not sure what $set is but I know that it changes our collections completed to false
        $set: {
            completed: false
        }
    })
    // returns promise and console.logs and res.jsons
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

// delete method deletes items from db collection
app.delete('/deleteTodo', (req, res)=>{
    // deleteOne deletes from db and ejs
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    // returns promise and console.logs and res.jsons
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
// this is how our app is able to run.  Node.js listens for the port and runs on it
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    