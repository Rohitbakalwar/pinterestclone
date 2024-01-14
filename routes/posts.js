const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    postText:{
        type:String,
        required:true,
    },
    image:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    },
    date:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

module.exports = mongoose.model("post",postSchema);