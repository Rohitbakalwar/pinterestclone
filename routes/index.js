var express = require('express');
var router = express.Router();
var userModel = require("./users")
var passport = require("passport")
 const localstrategy = require("passport-local");
passport.use(new localstrategy(userModel.authenticate()));
const upload = require("./multer")
const postModel = require("./posts")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  userModel
 .findOne({username:req.session.passport.user})
 .populate("posts")
//  .populate("profileImage")
 .then(function(oneuser){ 
  // console.log(oneuser)
  res.render('profile',{ oneuser }); 
 }) 
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/changeprofileimage',isLoggedIn, function(req, res) {
  res.render('profileimg');
});

router.post('/addprofileimage',isLoggedIn, upload.single('image') ,  async function(req, res, next) {
  const user = await userModel.findOne({ username:req.session.passport.user})
    user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile")
});

router.get('/edit', isLoggedIn, function(req, res, next) {
  userModel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    res.render("edit",{founduser})
  })
});

router.post('/update',function(req,res){
  userModel.findOneAndUpdate({username:req.session.passport.user},{
    username:req.body.username,
    email:req.body.email,
    fullname:req.body.fullname
  })
  .then(function(updateuser){
    res.redirect("/profile")
  })
})

router.get('/feed', isLoggedIn ,function(req,res){
  postModel.find()
  .populate("user")
  .then(function(allposts){
    res.render("feed", {allposts} )
  })
})

router.get('/upload',function(req,res){
  res.render("upload");
})

router.post('/upload',isLoggedIn, upload.single('file'), async function(req,res){
  if(!req.file){
    return res.status(400).send('No files were uploaded.');
  }
  const user = await userModel.findOne({ username:req.session.passport.user })
    const post =  await postModel.create({
    image:req.file.filename,
    postText:req.body.filecaption,
    user:user._id
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
})

router.post("/register",function(req,res){
  let newUser = new userModel({
    username:req.body.username,
    email:req.body.email,
    fullname:req.body.fullname
  })
  userModel.register(newUser,req.body.password)
  .then(function(u){
    passport.authenticate('local')(req,res,function(){
      res.redirect("/feed")
    })
  })
  .catch(function(e){
    res.send(e)
  })
})

router.post("/login",passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:"/login" 
}),function(req,res){})

router.get('/logout',function(req,res,next){
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

function isLoggedIn(req,res,next)
{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/')
  }
}

module.exports = router;
