const express = require('express') // Allows for the express framework to be integrated into the node server
const app = express() // A variable shortcut to enable the framework
const MongoClient = require('mongodb').MongoClient // A variable that integrates MongoDB and creates a new instance to connect to the database
const PORT = 2121 // The port on which our server listens & runs
require('dotenv').config()  // Loads variables in the process

let db, // Creates a variable which will eventually hold our database
    dbConnectionStr = process.env.DB_STRING, // Loads the variable in the .env file 
    dbName = 'todo' // A variable to hold the database name

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) // MongoClient.connect creates the instance to connect to our database. We pass in the connection string. Topology I am not sure what it does.
    .then(client => { // Because the request to our database is like a promise, we expect something back in return. In this case, we are returning the access to the database which we are calling 'client'
        console.log(`Hey, connected to ${dbName} database`) // A log confirming we have successfully connected to the database
        db = client.db(dbName) // Assigning the DB variable to the successful connection of the database and naming it our "dbName" variable.
    })
    .catch(err =>{ // If we can NOT connect to the server, then...
        console.log(err) // This log runs telling us what error occured. 
    })
// Middleware
app.set('view engine', 'ejs') // app is our express framework syntax that allows the set method. The parameters describe what template language is being used for HTML markup.
app.use(express.static('public')) // the "use" method allows us to implement the following express methods.  express.static('public') serves up the files in our public folder for us without the extra legwork of setting it up manually.
app.use(express.urlencoded({ extended: true })) // I do not know exactly what this does.
app.use(express.json()) // Allows json objects to be used for sending information to the database.  This allows us to easily pick and use data the client may send.

app.get('/', async (req,res)=>{ // A get request that asynchronously directs us to the main route of the site
  const todoItems = await db.collection("todos").find().toArray(); // A variable which, when the promise of accessing the main route fulfills, returns the "todo" collection inside our mongoDB database, finds that data inside that collection, and uses toArray to place all those objects inside of an array.
  const itemsLeft = await db // A variable that sets the completion status of items in the database by..
    .collection("todos") // Looking inside the "todos" data in mongoDB
    .countDocuments({ completed: false }); // Not sure about this
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft }); // Renders means populate the page to show content (our ejs markup) with the items in our database, and assigning the 'incomplete' status to each item in the database.
}) // End get request 

app.post('/createTodo', (req, res)=>{ // The start of a post request, which will create data in our database. /createTodo comes from the "action" URI in the index.ejs that processes our form information. The next parameter is a "request/response"
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // This looks inside our database, inside our "todos" collection, and inserts something to the database.  That something is the forms value where the name matches "todoItems". The item in the form gets added as a value while "todo" is added as a key in the database.  "Completed" is automatically set to false and is attached to this data as well.
    .then(result =>{
      // As a result of successfully adding this information to the database, we...
      console.log("Todo has been added!"); // Console log the success
      res.redirect("/"); // And in response redirect the page to the homepage, effectively refreshing the page.
    }) // End of "then"
}) // End of post request

app.put('/markComplete', (req, res)=>{ // The PUT request line, to update our database info. Works similar to the create method above.
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // Much like the POST method, this code finds the "todos" collection in our database, updates one (as opposed to several) todo items, and performs an action
        $set: { // Changes the value of the following database key: value
            completed: true // The given "false" value is now true, because the task is marked complete.
        } // End of what to update
    }) // End request to database
    .then(result =>{ // Following the successful completion of a PUT method..
        console.log('Marked Complete') // Log to the console the successful completion of task
        res.json('Marked Complete') // Respond with json data the the task was complete.
    }) // End result of promise
}) // End put method

app.put('/undo', (req, res)=>{ // As above, so below.  Another put method to undo a task complete put request.
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // Again, finds the "todos" collection in the database, updates one item, updates the body of the template showing clientside.
        $set: { // Changes the Key/Value to the following...
            completed: false // In the database, "completed" is changed back to false.
        } // End of what to update
    }) // End request
    .then(result =>{ // Following the successful completion of a PUT method..
        console.log('Marked Complete')// Log to the console the successful completion of task
        res.json('Marked Complete')  // Respond with json data the the task was complete.
    }) // End result of promise
}) // End put method

app.delete('/deleteTodo', (req, res)=>{ // A delete request which will remove data from the database.
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // Finds the "todos" collection in our database, deletes ONE (the selected task on the client side) and removes the data from the database.
    .then(result =>{ // As a result of the data being removed..
        console.log('Deleted Todo') // Log the successful deletion
        res.json('Deleted It') // Responds with json to the clientside it was deleted ? 
    }) // End result of promise
    .catch( err => console.log(err)) // In case Delete doesn't work, console log error.
}) // End of delete method.
 
app.listen(process.env.PORT || PORT, ()=>{ // Express listen method, to allow our server to perform on the desired port locally or on whatever port our hosting service wants.
    console.log('Server is running, you better catch it!') // Logging to the console the server is indeed running.
}) // End of listen method.