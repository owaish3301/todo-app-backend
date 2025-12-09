const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require('cors');

const { connectMongo } = require("./connection");
const { authRouter } = require("./routes/auth");
const { globalErrorHandler } = require("./middlewares/globalErrorHandler");
const { todosRouter } = require("./routes/todos");

const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieparser());


app.use('/api/auth',authRouter)
app.use('/api/todos',todosRouter);

app.use(globalErrorHandler);

app.listen(3000,()=>{
    console.log("Server running on 3000");
    connectMongo();
})