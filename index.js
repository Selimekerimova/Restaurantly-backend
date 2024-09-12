const express = require('express')
const cors=require("cors")
const bodyParser=require("body-parser")
const uuid =require("uuid")
const app = express()
const mongoose=require("mongoose")
const {Schema}=mongoose
require("dotenv").config()
const PORT = process.env.PORT
const DB_URL=process.env.DB_URL



app.use(cors())
app.use(bodyParser.json({limit:"50mb"}))
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}))
app.get('/users', (req, res) => {
  res.send('Hello World!')
})

mongoose.connect(DB_URL).then(()=>{
    console.log("succesfuly ");
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
      })   
}).catch((err)=>{
    console.log(err);  
})


const productSchema=new Schema({
    img:{type:String,required:true},
    title:{type:String,required:true},
    price:{type:Number,required:true},
    content:{type:String,required:true},
    category:{type:String,required:true}
})

const Products=mongoose.model("Products",productSchema)

app.get("/product", async (req,res)=>{
    try{
        const products=await Products.find({})
        res.send(products).status(200)
    }catch(error){
        res.status(500).send({
            message:error
        })
    }
})

// get by id
app.get("/product/:id", async (req,res)=>{
    try {
        const {id}=req.params
    const product=await Products.findById(id)
    res.send(product).status(200)
    } catch (error) {
        res.status(500).send({
            message:error
        })
    }
})

// delete
app.delete("/product/:id", async (req,res)=>{
    const {id}=req.params
    try {
       let deleted= await Products.findByIdAndDelete(id)
    //    const products=Products.find({})
       res.send(deleted).status(200)
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
})

// post
app.post("/product", async (req,res)=>{
    const newProduct=new Products(req.body)
    try {
        await newProduct.save()
        res.status(201).send(newProduct)
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
})


// update data put
app.put("/product/:id" ,async (req,res)=>{
    const {id} =req.params
    try {
        await Products.findByIdAndUpdate(id,req.body)
        const updateProduct = await Products.findById(id)
        res.status(200).send({
            message:"Updated succesfuly",
            data:updateProduct
        })
    } catch (error) {
        res.status(500).send({
            message:error.message
        })
    }
})
