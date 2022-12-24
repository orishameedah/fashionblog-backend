import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogRouter from "./routes/blog-routes.js";
import router from "./routes/user-routes.js";
import cors from 'cors';
import path from "path";


const app = express();  //all the application will be save on the express server for production
dotenv.config().parsed;

app.use(cors());
app.use(express.json());  //it will all the data object in a json format for use to read the req.body instead of using body parser but both still have the same functionality

const __dirname = path.resolve();

app.use("/api/user", router); //http://localhost:5000/api/user/ //the api router for the user
app.use("/api/blog", blogRouter); //http://localhost:5000/api/blog/ //the api router for the user blogs

// mongoose.connect('mongodb+srv://hameedah:meedah7002*@cluster0.5lnkg.mongodb.net/Blog?retryWrites=true&w=majority'
// ).then(()=>{
//     console.log('Connected to mongodb')
// }).catch((error)=>{
//     console.log(error.message)
// })


const connect = async () => {
    try {
    mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected to mongodb")      
    } catch (error) {
        console.log(error.message)
    }
}

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", function(_, res){
    res.sendFile(path.join(__dirname, "/frontend/build/index.html")),
    function(err){
        if(err){
            res.status(500).send(err)
        }
    }
})

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    connect()
    console.log(`server listening to port ${port}`);
})
