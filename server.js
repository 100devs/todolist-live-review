const express = require('express') //Importing Express
const app = express() // app to call all the methods from express
const MongoClient = require('mongodb').MongoClient //Inporting MongoDB
const PORT = 2121 //Port number to run your server
require('dotenv').config() //Storing confidential data.

// setting up data base 
let db,
    
    dbConnectionStr = process.env.DB_STRING,// conecting to the database (MongoDB link)
    dbName = 'todo'//Database Name
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})// Conecting to the databas and getting a promise
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) // console loging that we ared conected to the database
        db = client.db(dbName)// Assign client to the database.
    })
    .catch(err =>{
        console.log(err) // Catching errors from the database
    })

app.set('view engine', 'ejs') // setting the engine to ejs
app.use(express.static('public')) // Accesing to all kind of files in the public folder (Middleware)
app.use(express.urlencoded({ extended: true })) // checking that cintent type match type.
app.use(express.json()) //Getting the request as json Post or put 

app.get('/', async (req,res)=>{ //get route or home route to render content 
    const todoItems = await db.collection('todos').find().toArray() // creating array with the information found
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // Counts the documents that are not completed
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // Rendering the index file with the info
})

app.post('/createTodo', (req, res)=>{ // Post request to create a task
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // inserting the task to the database
    .then(result =>{ //waithing to the promise to fulfilled
        console.log('Todo has been added!') //consolelog to see that tha task has been added 
        res.redirect('/') // redirect to the home page
    })
})

app.put('/markComplete', (req, res)=>{ // Updating our database to have completed tasks
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //Updating one element on the database
        $set: {
            completed: true // the completed propertive is being change to true(completed task)
        }
    })
    .then(result =>{ //
        console.log('Marked Complete') // consoleloging to have confirmation of completion
        res.json('Marked Complete') // Response as completed
    })
})

app.put('/undo', (req, res)=>{ // Route do undo what was done with markCompleted
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //Updatting database 
        $set: {
            completed: false //Same as line 43 but backwards
        }
    })
    .then(result =>{
        console.log('Marked Complete') //consoleloging confirmation
        res.json('Marked Complete') // Response as conpleted to the client
    })
})

app.delete('/deleteTodo', (req, res)=>{ //Route  to delete request 
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //accesing database and deleting element
    .then(result =>{ 
        console.log('Deleted Todo') // consologing confirmation of deletion
        res.json('Deleted It') // Response as conpleted to the client
    })
    .catch( err => console.log(err)) //catching errors for deletion.
})
 
app.listen(process.env.PORT || PORT, ()=>{ // Listening to the Port
    console.log('Server is running, you better catch it!') //consoleloging just to make sure that the server is running.
})    