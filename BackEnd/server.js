require('dotenv').config()
const express =require ('express');
const mongoose=require('mongoose')
const userRoute=require('./Routes/userRoute')
const adminRoute=require('./Routes/adminRoute')
const Cors=require('cors')


console.log('it is server.js page')

const app=express()

app.use(Cors())

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
const PORT=4000;
console.log('it is server.js pagewerwqerqwerqwer') 

app.listen(PORT,()=>{
console.log(`server is runing`)
})