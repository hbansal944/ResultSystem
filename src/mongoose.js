const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://hbansal944:9017650030@cluster0.ue2iqkf.mongodb.net/himanshu?retryWrites=true&w=majority",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log(e)
    console.log('failed');
})


const studentschema = new mongoose.Schema({
    roll_no: {
      type: Number,
      unique: true,
    },
    name: String,
    Score: Number,
    birth_date: String,
})

const user=new mongoose.model('studentCollection',studentschema)

module.exports= user