const express = require('express') //getting the express module 
const app = express() //creatiing an express application
const MongoClient = require('mongodb').MongoClient //getting mongoclient and storing it in a var
const PORT = 2121 //just declaring an arbitrary port
require('dotenv').config() //allows use for environment vars

let db,
    dbConnectionStr = process.env.DB_STRING, //getting db string out of .env
    dbName = 'todo' //declaring vars related to the database.

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //connecting to mongo db with connection uri and providing options
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`) //logging into console to confirm
        db = client.db(dbName) //assignning db name to db
    })
    .catch(err =>{
        console.log(err) //catch all errors
    })

app.set('view engine', 'ejs') //setting ejs to view engine
app.use(express.static('public')) //setting up our static folder which is public
app.use(express.urlencoded({ extended: true })) //allows to get the req.body from params during POST reqs
app.use(express.json()) //converts objects passed from POST to JSON format

app.get('/', async (req,res)=>{ //home page GET req
    const todoItems = await db.collection('todos').find().toArray() //getting all documents and converting to array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //getting the count of tasks left
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //rendering ejs with two variables, zebra and left
})

app.post('/createTodo', (req, res)=>{ //POST req
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //inserting body into db
    .then(result =>{
        console.log('Todo has been added!') //just logging confirmation
        res.redirect('/') //redirect to home page
    })
})

app.put('/markComplete', (req, res)=>{ //PUT request for adding 'completed' status
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //setting up out update request
        $set: {
            completed: true //modifying the completed property
        }
    })
    .then(result =>{
        console.log('Marked Complete') //just logging confirmation
        res.json('Marked Complete') //sending confirmation back in json format
    })
})

app.put('/undo', (req, res)=>{ //PUT request for removing 'completed' status
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false //modifying the completed property
        }
    })
    .then(result =>{
        console.log('Marked Complete') //logging confirmation
        res.json('Marked Complete') //sending confirmation back in json format
    })
})

app.delete('/deleteTodo', (req, res)=>{ //DELETE request for removing tasks
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //using the mongo command to delete as per our req.body
    .then(result =>{
        console.log('Deleted Todo') //logging confirmation
        res.json('Deleted It') //sending confirmation back in json format
    })
    .catch( err => console.log(err)) //catch errors
})
 
app.listen(process.env.PORT || PORT, ()=>{ //get server to listen on our port
    console.log('Server is running, you better catch it!') //logging confirmation
})    