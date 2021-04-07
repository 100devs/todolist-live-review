// add express to the module list of dependencies
const express = require('express')
// use express or give access to using express
const app = express()
// add MomgoDb to the list of dependecies
const MongoClient = require('mongodb').MongoClient
// use port 2121 for the application gateway to the internet
const PORT = 2121
// add .env (environment) file to the depencies to be used
require('dotenv').config()
// database object, container holding reference points for access to pushing or pulling data to the database
let db,
// the variable holding the abstracted access to the database web access point address with login deets in it
    dbConnectionStr = process.env.DB_STRING,
// reference point that holds the database name in this case for MongoDb    
    dbName = 'todo'

// points the variable holding the database web access string to MongoDb to access the database in Mongo's language with unified topology - (not sure what that is)
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
// kind of verification of when database is connected next step direction
    .then(client => {
// logs to the console after successful connection to the database a statement
    console.log(`Hey, connected to ${dbName} database`)
// takes the database object and accesses the client part of the global db variable and makes it the database name which is 'todo'
        db = client.db(dbName)
    })
// to catch errors and show what the error and push it
    .catch(err =>{
// logs the pushed error data to the console
        console.log(err)
    })

// sets a dependency that allows the use of embedded javascript in place of html as the way to see and access the front-end
app.set('view engine', 'ejs')
// allows the use 'express' static framework(?) and assign it to the public folder
app.use(express.static('public'))
// use the urlencoding for express or turns it on.  I believe it applies to special characters
app.use(express.urlencoded({ extended: true }))
// uses json to format the data that is taken in and pushed out from with express.  Kind of like encoding I think.
app.use(express.json())

// get request from the root using async to manage the queue and start the push to the request, response method
app.get('/', async (req,res)=>{
// assign an await function to the 'todoItems' variable which in this case involves global database object and the collection's in the MongoDb to a 
//     finder method and then changes it to an array
    const todoItems = await db.collection('todos').find().toArray()
// assign to the variable 'itemsLeft' an await function that uses the global database object MongoDb collection 'todos' data and processes
//     it through a count method if it is not completed 
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
// still part of the get method/function and handles the response by rendering (nice play on words right) in the ejs with and object containing to key 
//     value pairs: zebra and left
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// Post method pointed at the 'createTodo' in the root which uses and response and request function that forwards the Post in question to a function 
// parameters
app.post('/createTodo', (req, res)=>{
// pull from the global database variable accessing the MongoDb collection's 'todos' data and the insertOne's accessed object with the 'todo' and 'completed'
//     key value pairs and moving it on to be processed
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
// processing of the Post if it is meets the false requirement and then responding with something    
    .then(result =>{
// log to the console
        console.log('Todo has been added!')
// this is the response part of the Post which is set to redirect the view to the root webpage
        res.redirect('/')
    })
})

// Makes a change to the '/markComplete' throught the request and response function
app.put('/markComplete', (req, res)=>{
// in this case it is a pointer path to a specific part of the database collection for editing    
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
// a template literal type set that allows updating something
        $set: {
// changes the 'completed' status to true
            completed: true
        }
    })
// a next step pointing at the result status function    
    .then(result =>{
// logs the message to the consold        
        console.log('Marked Complete')
// edits the json data of the response to the message      
        res.json('Marked Complete')
    })
})

// this put request takes a request and response and pushes it to a function
app.put('/undo', (req, res)=>{
// this line accepts the 'undo' request to the MongoDb collection 'todos' and processes it with the 'updateONe' function/object
//     to update the 'rainbowUnicorn' of the todo database
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
// allows the update to be set        
        $set: {
// updates 'completed' to false            
            completed: false
        }
    })
// the next part of the Put request which pushes to the result function    
    .then(result =>{
// logs a message        
        console.log('Marked Complete')
// Responds with json with a message        
        res.json('Marked Complete')
    })
})

// use the delete function dependency towards the '/deleteTodo' function which points to it's request and response function
app.delete('/deleteTodo', (req, res)=>{
// targets the delete request to the 'deleteOne' method on the MongoDb collection's rainbowUnicorn    
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
// the next step of the delete request which triggers the result function
    .then(result =>{
// logs a message
        console.log('Deleted Todo')
// logs a json message to the response object
        res.json('Deleted It')
    })
// cathes error data and logs it to the console
    .catch( err => console.log(err))
})
// uses the listen dependency to listen on either MongoDb's port of choice or if not, then the preselected port assigned at the top of this file.  Then
// triggering the function that follows
app.listen(process.env.PORT || PORT, ()=>{
// logs a message
    console.log('Server is running, you better catch it!')
})    
