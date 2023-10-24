require('dotenv').config()
const express = require("express")
const app =express()
const port = 3000
const adminRoutes = require('./Routes/adminRoutes')
const userRoutes = require('./Routes/userRoutes')

app.use(express.json())
app.use('/api/admin',adminRoutes)
app.use('/api/users',userRoutes)

app.listen(port,(err)=>{
    if(err){
        console.log("Error occured:",err)
    }
    console.log(`server running at port ${port}`)
})




