const mongoose  = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterestclone");

const userSchema =  mongoose.Schema({
  username :{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  fullname:{
    type:String,
    required:true
  },
  dp:{
    type:String
  },
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'post'
    }
  ]
});

userSchema.plugin(plm);
 
module.exports = mongoose.model("user",userSchema);
