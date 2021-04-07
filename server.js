const express = require('express') //tells node to use express
const app = express() // makes it quicker to use express? maybe? 
const MongoClient = require('mongodb').MongoClient // tells node to use Mongodb but don't know what the client part is
const PORT = 2121 // This is our default port for our server
require('dotenv').config() // This is our environment variables to hide sensitive stuff

let db, // create the database variable
    dbConnectionStr = process.env.DB_STRING, // This sets our database address from the dot env file
    dbName = 'todo' // name of the datbase we are writing and reading too. 

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //this is the start of connecting to our database on atlas
    .then(client => {  //we wait for the response 
        console.log(`Hey, connected to ${dbName} database`) //we are console logging the database name to chekc if it's connected
        db = client.db(dbName) //sets db variable to response + database name
    })
    .catch(err =>{ // good ole error catcher
        console.log(err) // error logger
    })

app.set('view engine', 'ejs') // I'm not exactly sure on this I think it define our frontend framework?
app.use(express.static('public')) // Set's the default folder that is served by our server
app.use(express.urlencoded({ extended: true })) //let's us gram URL parameters?
app.use(express.json()) //let's us pass json objects? 

app.get('/', async (req,res)=>{ // our get request to pull data - takes request and response
    const todoItems = await db.collection('todos').find().toArray() //get's back json, then gives us first object?, then changes it to an array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // counts the documents that has the completed property set to false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //says to render to index.ejs and passes the todos and count of uncompleted
})

app.post('/createTodo', (req, res)=>{ //let's us create a todo - takes request and response
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //inserts a new object into our db from the body of a post and sets completed to false
    .then(result =>{ //we waiting here 
        console.log('Todo has been added!') //log so we know it worked
        res.redirect('/') //send people back to the orginal page since we navigated to /createTodo
    })
})

app.put('/markComplete', (req, res)=>{ //updating a record
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // sending the updated body of a post 
        $set: { //mongodb function to set values
            completed: true //setting completed to true for this item
        }
    })
    .then(result =>{ //we waiting here
        console.log('Marked Complete') //logged to make sure it worked
        res.json('Marked Complete') // sent a response becasue.....it's a promise?
    })
})

app.put('/undo', (req, res)=>{ //updating a record again because people make mistakes
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //sending the updated from the post 
        $set: { //mongodb function to set values
            completed: false //setting completed to false
        }
    })
    .then(result =>{ // we waiting here
        console.log('Marked Complete') //logging that thing
        res.json('Marked Complete') //sending response because....still a promise?
    })
})

app.delete('/deleteTodo', (req, res)=>{ //getting rid of a record
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //using mongodb method to delete record that matches the post body
    .then(result =>{ // we waiting here
        console.log('Deleted Todo') // logging to make sure it worked
        res.json('Deleted It') // pretty sure we are returning response because promise
    })
    .catch( err => console.log(err)) //catch and log if we got some bugs
})
 
app.listen(process.env.PORT || PORT, ()=>{ //sets server to listen on our port or env. port 
    console.log('Server is running, you better catch it!') //logging to see if it running.
})    