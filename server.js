// declares variables for requirements
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()  //Loads environment variables from .env file

let db,                     // Declares database as variable for connection
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})  //connects to MongoDB 
    .then(client => {                                              //Console logs connection and links database with variable
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

app.set('view engine', 'ejs')  //sets app to use EJS
app.use(express.static('public'))  // tells express to link to public
app.use(express.urlencoded({ extended: true })) //Middleware returning JSON and urlencoded
app.use(express.json())

app.get('/', async (req,res)=>{                 //Get request to homepage as async
    const todoItems = await db.collection('todos').find().toArray()     //Creates variable for items in collection as array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //makes variable for uncompleted items
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})        //renders response for previously declared variables into EJS
})

app.post('/createTodo', (req, res)=>{            //sets up creation of todo
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})  //adds a todo item to collection unmarked
    .then(result =>{        //logs action confirmation and refreshes page
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{  //marks todo item complete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  //updates todo item in collection to completed
        $set: {
            completed: true
        }
    })
    .then(result =>{            //logs the finished task and responds with JSON
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{  //put method to undo previous put method
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  //updates collection item 
        $set: {
            completed: false
        }
    })
    .then(result =>{        //logs success and responds with JSON
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{         //delete method to get rid of shit we done did
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})        //removes item from collection of todos 
    .then(result =>{                //Logs removal and responds with JSON
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))  //Saves our ass if shit fucks up
})
 
app.listen(process.env.PORT || PORT, ()=>{      //Starts server on environment port or declared port as fallback
    console.log('Server is running, you better catch it!')  // Programmer jokes are really awful huh?
})    