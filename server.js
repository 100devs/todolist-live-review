const express = require('express')
// In order to  use a module the module must be required. This line declares a variable express and assigns it the express module.
const app = express()
// This then sets the variable app as the function call of express. Its purpose is to create a server using the express framework.
const MongoClient = require('mongodb').MongoClient
// As this is a fullstack app, we need somewhere to store our info. This line requires the use of mongoDb as our database for the app.
const PORT = 2121
// This line declares the PORT variable, and assigns it a value of 2121.  Can be any value(apart from certain preallocated ports e.g ftp etc) from 0 up t0 65535
require('dotenv').config()
// This line enables us to use the dotenv module, which we use to hide away sensitive information, in this case our mongodb connection string. Can be used for api keys etc.

let db,
    // Declaring our database variable for assignment later
    dbConnectionStr = process.env.DB_STRING,
    // Setting our mongoDB connection string as the corresponding value in our .env file to keep secrets safe. The string can be found when you create a collection in mongodb atlas.
    dbName = 'todo'
    // Assigning our dbname as todo

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
// This is where we connect our server to the database created in mongodb atlas
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
// The .then and .catch methods indicate that this returns a promise. The .then simply lets us know if we have connected to our database, and assigns the db variable declared on line 12.
    .catch(err =>{
        console.log(err)
    })
// The .catch method is used to display any errors if encountered while connecting to mongodb

app.set('view engine', 'ejs')
// This line sets our view engine as ejs, a templating language we will use to generate our html files to be sent to the client.
app.use(express.static('public'))
// This line indicates that any files in the public folder, should be served up as part of the root directory on the client side. It usually houses client side css and js.
app.use(express.urlencoded({ extended: true }))
// This line tells express to use the middleware urlencoded which is used to parse the requests so as to extract information e.g from post requests where the info is sent within the body.
app.use(express.json())
// This tells our server to use the json middleware to parse responses to json.

//CRUD API
// The methods below form are set up to handle requests from the client side and form the base of our application. CRUD stands for CREATE, READ, UPDATE & DELETE.

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
// READ
// This method after receiving a GET requests from the client, then connects to our database, looks for all the relevant info using the find() method and stores it in an array.
// It uses the async await methods so operates like synchronous code i.e one line of code after another. Once the information we requested from the db, specifically all our todos,
// and a count of which todos are still pending completion, this is then sent to our index.ejs file for rendering, where the html to be sent back to the client is generated.

app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})
//CREATE
// This method facilitates the creation of entries in our db. On receiving a PUT request, the server contacts the db and sends over some information regarding the db entry 
// The req body of the information sent from the client holds the todo list item to be added and we set the completed value as false. The .then method lets us know if the 
// entry has been successfully created and then sends a response back to the client redirecting it to thhe root folder which in turn sets off another GET request

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

//UPDATE
// This method facilitates the editing of entries in our db. On receiving a POST request, the server contacts the db and sends over some information regarding the db entry 
// The req body of the information sent from the client holds the todo list item that we want to edit,and sets the completed value as true through the use of the updateOne method.
// The .then method lets us know if the entry has been marked complete and then sends a response back to the client that the task has been marked complete.

app.put('/undo', (req, res)=>{
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

//UPDATE
// This method which is also a PUT request does a very similar task to the above put method but differs in that it sets the completed value back to false as when the entry is initiall created.

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// This is our delete metod and it is used to remove entries from our database. the client sends over a request body with a delete method which telss our server that using this method,
// send over the information about the task to be deleted received in the request body. The db then navigates to our database and using the deleteOne method it finds an entry that
// shares the same todo list item as that which was sent and removes the entry. once this is done the server then sends a response to the client with a message saying the task was deleted. 
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    

// This method here is extremely importnat without it our server wouldnt know where to listen for requests from the client. We tell the server to listen for the various requests above,
// by specifying which port it should listen to. In this case if there is a port declared and assigned in our .env file it will use that or use the port declared on line 7 as a default.
// once this has successfully started a mesage will appear in the terminal to indicate the server is up and running and ready to process the requests from the client using the CRUD methods above.
