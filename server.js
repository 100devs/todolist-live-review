const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

// I understand the above code - refering to dependencies that we installed



let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'
// understand this part - db_string is "abstraction"
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
// understand the above code - connecting to your database in mongo
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// I understand the above - this is middleware that is needed for the 'server' to understand the code the will be passed into IE view engine - ejs

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

// Understand this code = this is your 'root' website, when you connect you are going to access the collection inside of your db and then pass it into the ejs folder in views
app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

// Kinda understand this - the deconstructing the object is still foggy to me
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

// when we are accessing the upvote you are getting the collection from the DB and then changing a property in the object upvote
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
// when we are accessing the downvote you are getting the collection from the DB and then changing a property in the object downvote

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 // // when we are accessing the delete you are getting the collection from the DB and then changing a property in the object deleting the child

app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    

/// this is where you localhost listens for a port or process.env.PORT will listen if its hosted on heroku etc.