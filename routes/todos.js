const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { addTodos } = require("../controller/todos/addTodos");
const { validateAddTodos } = require("../middlewares/todos.js");


const Router = express.Router();

Router.post("/add-todo",verifyToken, validateAddTodos, addTodos);


module.exports={todosRouter:Router};