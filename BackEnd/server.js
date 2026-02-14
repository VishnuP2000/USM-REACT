require('dotenv').config()
const express =require ('express');
const mongoose=require('mongoose')
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
const cookieParser=require('cookie-parser')
const Cors=require('cors')


console.log('it is server.js page')

const app=express()

app.use(Cors({
  origin: "http://localhost:5173", // Your frontend domain
  credentials: true // ✅ Important to allow cookies
}));

app.use(cookieParser());
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('hello from express')
})

mongoose.connect(process.env.MONGODB_CONNECTION)
.then(()=>{
    console.log('Mongodb atlas connected')
})
.catch((error)=>{
    console.log('it is error',error)
})

app.use('/',userRoute)
app.use('/admin',adminRoute)
const PORT=process.env.PORT || 4000;
console.log('it is server.js pagewerwqerqwerqwer') 

app.listen(PORT,()=>{
console.log(`server is runing${PORT}`)
})