const express =require('express')
const cors=require('cors');
const port=process.env.PORT || 5000;
const app=express()
//midleware
app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('boss is running')
})
app.listen(port,(req,res)=>{
    console.log(`bistro boss  is running on Port: ${port}`)
})