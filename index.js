const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require('cors');

const { connectMongo } = require("./connection");
const { authRouter } = require("./routes/auth");

const app = express();

app.use(cors({
    origin:"http:localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieparser());


app.use('/api/auth',authRouter)

app.listen(3000,()=>{
    console.log("Server running on 3000");
    connectMongo();
})