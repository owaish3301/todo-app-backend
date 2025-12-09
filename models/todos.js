const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    title :{
        type: String,
        required: true,
    },
    hexColor:{
        type: String,
        required: true,
    },
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    isFinished : {
        type: Boolean,
        default: false,
    },
    scheduleTime: {
        type: String,
        required: false
    },
    scheduledDate:{
        type:Date,
        required:true,
    }
},{timeStamps : true})

const Todo = mongoose.model("Todo",todoSchema);

module.exports = {Todo}