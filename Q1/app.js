import express from "express";
import env from "dotenv";
import axios from "axios";
env.config();
const app = express();
const port = process.env.PORT;


app.use((req,res,next)=>{
    const authHeader = req.headers['Authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({error : "No authentication provided"});
        next();
    }
})

const WINDOW_SIZE = 10 ;
const TIMEOUT = 500 ;

const numberWindow = [] ;

const EndPoints = {
    p : "http://20.244.56.144/evaluation-service/primes",
    f : "http://20.244.56.144/evaluation-service/fibo",
    e : "http://20.244.56.144/evaluation-service/even",
    r : "http://20.244.56.144/evaluation-service/rand"
};
app.get("/",(req,res)=>{
    res.send("working ! ");
})

app.get("/numbers/:numberid",async(req , res)=>{
    const {numberid} = req.params ;
    const url = EndPoints[numberid]

    if(!url){
        return res.status(400).json({error : "Invalid number Id"});
    }
    const windowPrevState = [...numberWindow];
    let fetchedNumbers = [] ; 

    try{
        const response = await axios.get(url,{timeout : TIMEOUT});
        fetchedNumbers = response.data.numbers || [] ;

    }catch(error){
        fetchedNumbers = [];
    }
    for(const num of fetchedNumbers){
        if(!numberWindow.includes(num)){
            numberWindow.push(num);
            if(numberWindow.length > WINDOW_SIZE){
                numberWindow.shift();//poping from front 
            }
        }
    }
    const avg = numberWindow.length === 0 ? 0 : Number((numberWindow.reduce((sum , val)=>sum+val,0)/numberWindow.length).toFixed(2));

    res.json({
        windowPrevState , 
        windowCurrState : [...numberWindow],
        numbers : fetchedNumbers , 
        avg ,
    });
});




app.listen(port, () => {
    console.log(
        `listening at http://localhost:${port}`
    )
})