//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose= require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


//-----------------Mongoose-------------

mongoose.connect("mongodb+srv://admin-antony:billiejean456@cluster0.bczwr.mongodb.net/blogDatabase",{useNewUrlParser:true});
const blogSchema= new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  }
});

const Post=mongoose.model("Post",blogSchema);


// -----------------website----------------


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Home Screen
app.get("/",function(req,res){
  /*posts=[];
  Post.find(function(err,data){
    if(err)console.log(err);
    else{
      for(let post of data)
      posts.push(post);
    }
    res.render("home",{title:"Home",
    startContent:homeStartingContent,
    posts:posts});
  });*/
  Post.find({},function(err,data){
    if(err)console.log(err);
    else{
      res.render("home",{title:"Home",startContent:homeStartingContent,posts:data});
    }
  });
});


// Contact Screen

app.get("/contact",function(req,res){
  res.render("contact",{title:"Contact",contactContent:contactContent});
});

//About Screen


app.get("/about",function(req,res){
  res.render("about",{title:"About",aboutContent:aboutContent});
});

//Compose Screen

app.get("/compose",function(req,res){
  res.render("compose",{title:"Compose"});
});

/*app.get("/posts/:postTitle",function(req,res){
  let flag=0,renderTitle="Uh-Oh! Post Not Found";
  renderBody="No such post exists. Please try again";
  let paramTitle=_.lowerCase(req.params.postTitle);
  posts.forEach(function(post){
    let storedTitle=_.lowerCase(post.title);
    if(paramTitle==storedTitle){
      renderTitle=post.title;
      renderBody=post.body;
    }
  });
  res.render("post",{title:renderTitle,postContent:renderBody});
});*/

app.get("/posts/:id",function(req,res){
  let paramID=req.params.id;
  Post.findOne({_id:paramID},function(err,post){
    let renderTitle="Uh-Oh! Post Not Found", renderBody="No such post exists. Please try again.";
    let found=0;
    if(err)console.log(err);
    else{
      renderTitle=post.title;
      renderBody=post.body;
      res.render("post",{title:renderTitle,postContent:renderBody});
    }
  });
});

app.post("/compose",function(req,res){
  let post={
    title:req.body.composeTitle,
    body:req.body.composeBody
  };
  const newPost=new Post({
    title:req.body.composeTitle,
    body:req.body.composeBody
  });
  newPost.save(function(err){
    if(!err)
    res.redirect("/");
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
