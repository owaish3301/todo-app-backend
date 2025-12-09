const { Todo } = require("../../models/todos");
const { User } = require("../../models/auth");
const addTodos = async (req, res, next) => {
    try{
        const {data} = req.body;
        const decoded = req.decoded;
        const user =  await User.findOne({email: decoded.email})
        const newTodo = new Todo({
            ...data,
            User: user
        })
        await newTodo.save();
        return res
        .status(200)
        .json({
            success: true,
            message:"Todo saved successfully"
        })
    }
    catch(e){
        next(e);
    }
}

module.exports = {addTodos}