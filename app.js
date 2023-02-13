const express=require("express");
const app=express();
app.listen(4000);


app.get('/ping',(req,res)=>{
res.send("server is up")
})

