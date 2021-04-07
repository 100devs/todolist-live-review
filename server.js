const express = require('express') // grabbing express module that we downloaded using 'npm install express' and storing it in a variable
const app = express() // storing the express 'method' or 'function' in a variable named app
const MongoClient = require('mongodb').MongoClient // grabbing MongoCient (property) from the 'mongodb' module that we installed using 'npm install mongodb' and storing it in a variable named MongoClient
const PORT = 2121 // declaring a port and storing it in a variable named PORT. Port will default to 3000 if we don't declare one
require('dotenv').config() // installed using 'npm install dotenv'. Using this will hide our sensitive information i.e. usernames, passwords 

let db, // declaring a varible named 'db' to store the name of our database located on mongodb (see line 14)
    dbConnectionStr = process.env.DB_STRING, //storing our secret link to mongodb database in a variable (see line 5)
    dbName = 'todo' // Naming our database. this same name with appear in the cluster when we log into mongodb Atlas

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

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

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    