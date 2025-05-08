import express from "express";
import env from "dotenv";
env.config();
const app = express();
const port = process.env.PORT ;

app.listen(port,()=>{
    console.log(
        `listening to port ${port}`
    )
})