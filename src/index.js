const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const flash = require("connect-flash")

var bodyParser = require('body-parser');
const StudentCollection = require("./mongoose")
var ObjectId = require('mongodb').ObjectID
var session = require('express-session');


app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
const tempelatePath = path.join(__dirname, '../templates')

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(tempelatePath))
app.use(bodyParser.json())
app.use(flash())




app.get('/', (req, res) => {
    res.render('home')
})



app.get('/teacher', (req, res) => {
    StudentCollection.find((error,allrecords)=>{
        if (error){
            console.log("error")
            console.log(error)
        }else{
            //console.log(allrecords)
            res.render("teacher", { "studentdetails": allrecords,"length":allrecords.length })
        }
    })
})

app.get("/student/:id/delete",(req,res)=>{

    const del_id = req.params.id 
    
    StudentCollection.deleteOne(({"_id":del_id}),(err,docs)=>{
        
        var deletedcounts = docs["deletedCount"]
        
        if (deletedcounts == 0){
            console.log("Did not found matching id")
            res.redirect("/teacher")
        }else{
            console.log("The delete docs is----",docs)
            res.redirect("/teacher")
        }
    })
})


app.get("/student/:id/edit",async (req,res)=>{

    let update_id = req.params.id 
    console.log("The update id issssss")
    console.log(update_id)
    const checking = await StudentCollection.findOne({"_id":update_id})
    console.log("Cheking het update")
    console.log(checking)
    res.render("edit_student_record",{"data":checking})
})

app.post("/student/:id/edit", async (req,res)=>{

    let update_id = req.params.id 
    console.log("The update id is")
    console.log(update_id)

    StudentCollection.updateOne({"_id":(update_id)},{ $set: { "name":req.body.name,"roll_no":req.body.roll_no,"birth_date":req.body.birth_date,"Score":req.body.score } },(err,value)=>{
        console.log("The value is")
        console.log(value)
        res.redirect("/teacher")
    })
})

app.get("/add/studentdata",(req,res)=>{
    res.render("add_student_record")
})


app.post("/add/studentdata",async (req,res)=>{

    const data = {
        "name":req.body.name,
        "roll_no":req.body.roll_no,
        "birth_date":req.body.birth_date,
        "Score":req.body.score
    }
    await StudentCollection.insertMany([data])
    res.redirect("/teacher")
})

app.get("/findStudent",(req,res)=>{
    res.render("student_login",{"message":req.flash("info")})
})

app.post("/findStudent",async (req,res)=>{
    console.log("find result")
    const checking = await StudentCollection.findOne({ name: req.body.name,roll_no:req.body.roll_no })
    console.log(checking)
    if (checking == null){
        req.flash("info","Please Pass the Correct Details");
        res.redirect("/findStudent")
        
    }else{
        res.render("student_details",{"data":checking})
    }
})


app.listen(3000, () => {
    console.log('port connected');
})