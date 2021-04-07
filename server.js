//"express" will mean require() with express pkg passed in as a peram
const express = require('express')
//"app" will call "express" we just defined above
const app = express()
//"MongoClient" will now rep the pkg that handles connection to the DB
const MongoClient = require('mongodb').MongoClient
//PORT defines number of localserver to listen on
const PORT = 2121
//dotenv has something to do with the .env we use below...
require('dotenv').config()
//db will be database
let db,
//dbConnectionStr will reference the abstracted db connection string (with user ID, pswd, etc)
    dbConnectionStr = process.env.DB_STRING,
// dbName refs the specific db that contains the collection we're accessing
    dbName = 'todo'
//connects to db using vars we set 
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
//then console logs name of db
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
//don't forget to catch the err's
    .catch(err =>{
        console.log(err)
    })
//we defined app above (app=express()=require('express)), now we use some methods on it
//something about the ref to the view folder and ejs inside
app.set('view engine', 'ejs')
//using express to connect to public folder; aka your fave line of code
app.use(express.static('public'))
//not sure, something about the url/http stuff I think
app.use(express.urlencoded({ extended: true }))
//using express to use json
app.use(express.json())
//finally we get to gettin'
app.get('/', async (req,res)=>{
//got your async, and now these vars will await as we go to db, to-do's collection, grab it all/all the things, stick 'em in an array
    const todoItems = await db.collection('todos').find().toArray()
//this one goes to db-->coleection--> finds all the stuff that is NOT "complete"
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
//ok now our response paints all this in the dom by putting it in ejs first, then ejs-->html
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})
//this is our create, we add to db
app.post('/createTodo', (req, res)=>{
//go to db-->todos collection-->add an object/item. Data comes from request body (stuff we pulled from input in dom)
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
//then we make sure that's done and console.log
    .then(result =>{
        console.log('Todo has been added!')
//then we respond by redirecting/refreshing the page
        res.redirect('/')
//which goes back to db--> grabs the new list of stuff, stashes in an array, brings back and paints into ejs-->html
    })
})
//here's where we update/edit items
app.put('/markComplete', (req, res)=>{
//go to db-->todos collection-->find an item named rainbowUnicorn and mark complete
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
//console.log
        console.log('Marked Complete')
//response in json, but I don't know where this goes/why using json?
        res.json('Marked Complete')
    })
})
//heres another edit option; same path to db but this time the edit finds a rainbowUnicorn and marks incomplete
app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
//verify return from db and then console.log; response in .json again
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})
//delete handler, last of CRUD.  Go to db-->todos collection-->find one that matches rainbowUnicorn, remove
app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
//got another console.log confirming return from db
    .then(result =>{
        console.log('Deleted Todo')
//response in .json (still not sure why)
        res.json('Deleted It')
    })
//catch those errs!
    .catch( err => console.log(err))
})
//app with all the http stuff from express etc is listening on the hosted server, OR locally on PORT as defined above (localHost: 2121)
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    