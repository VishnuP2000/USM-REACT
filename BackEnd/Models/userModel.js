const mongoose=require('mongoose')

const userSchema= mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
          type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    },
    location:{
          type:String,
        required:true
    },
    password:{
          type:String,
        required:true
    },
    confirmPassword:{
          type:String,
        required:true
    },
    image:{
          type:String,
        required:true
    }


})
module.exports=mongoose.model('mongoUser',userSchema)