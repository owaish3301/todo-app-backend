const { addTodoSchema } = require("../validation/todos");

const validateAddTodos = (req,res,next) => {
    const {data} = req.body;
    
    const isValidTodo = addTodoSchema.safeParse(data);
    if(isValidTodo.success){
        next();
    }
    else{
        return res.status(400).json({
          success: false,
          message: isValidTodo.error.issues[0]?.message || "Invalid todo data"
        });
    }
}

module.exports = {validateAddTodos}