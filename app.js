//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')

const _ = require('lodash')

const homeStartingContent = "There is no other better place in the world, than being in the comfort of our homes. Home is where we learn the first lessons in life. The unity, love, togetherness all comes from a home. Home is the base for every individual and we should thank God for being blessed with a lovable home.";

const contactContent = "I am a web developer who loves to contribute to the world as much as he can !"
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postSchema = {

  title: String,
 
  content: String
 
 };

 const Post = mongoose.model("Post", postSchema);
// setting up the route '/' for our homepage

app.get('/', function(req,res){

  Post.find({}, function(err,posts){
      
      res.render('home', {
        StartingContent: homeStartingContent,
        posts: posts
      })
  })
  
  // res.render("The page you wantg to render", {Any data in the form of objects you want to send to the 
 // page you want ot render so that that page can use that data and use it with the help of ejs }
})

// setting up the route '/contact' for our contactpage
 app.get('/contact', function(req,res){
   res.render('contact', {
     contactContent: contactContent
   })
 })

 // setting up the route '/contact' for our contactpage
 app.get('/compose', function(req,res){
  res.render('compose')
  
})

// handling the case of the post request of '/compose'
// post request occurs when user submits the form having method="POST" see compose.ejs for reference
app.post('/compose', function(req,res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
    // we did this because of the body-parser 
  // usually syntax is req.body.nameOfTheInput

  // posts.push(post)
 
  post.save(function(err){

    // we want to redirect th the home page only when data is saved
    if (!err){
 
      res.redirect("/");
 
    }
 
  });
})

// Express routing
// instead of individual app.get('/POST KA NAAM')
// we can do this dynamically because for many posts it is not time consuming 
// to write app.get for every post

app.get('/posts/:postId', function (req, res) {

  // now we want to display the same post if user typed "Post_ka_naam" or "post_ka_naam"
  // Eg "Day1" or "day1" shouldnt be  a difference
  // so for this purpose we'll use lodash library
  
  // const requestedTitle= _.lowerCase(req.params.postName)
  const requestedPostId = req.params.postId;
  // we could this because of lodash
  
  Post.findOne({_id: requestedPostId}, function(err, post){

    res.render("post", {
 
      title: post.title,
 
      content: post.content
 
    });
 
  });
})
mongoose.connect("mongodb+srv://admin-vidhu:vidhu007@cluster0.thkqd.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});



	app.listen(process.env.PORT || 3000, () => {
		console.log('Server started')
	})


