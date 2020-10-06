//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

//Connect to MongoDB instance
mongoose.connect("mongodb://localhost:27017/journalDB", {useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


//Create Post Schema for MongoDB
const postSchema = {
  title: {
    type: String,
    required: [true, 'Title is required.']
  },
  content: {
    type: String,
    required: [true, 'Content cannot be blank.']
  }
};

//Compile Schema into a model
const Post = mongoose.model("Post", postSchema);
//Now we can create DB objects using the format const <variable> = new Post({title: 'title'}, {content: 'content'})


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req,res) {
  Post.find({}, function (err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        homeContent: homeStartingContent,
        posts: foundPosts
        })
    }
  })

  });

app.get("/about", function(req,res) {
  res.render("about", {
    aboutContent:aboutContent
  })
});

app.get("/contact", function(req,res) {
  res.render("contact", {
    contactContent:contactContent
  })
});

app.get("/compose", function(req,res) {
  res.render("compose")
});

//Express Route Parameters
app.get("/posts/:postId", function(req,res) {
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function (err, post) {
    if (!err) {
      res.render("post", {postTitle: post.title, postContent: post.content});
    }
  });
});


//Composing new post will add to DB.
app.post("/compose", function(req,res) {

  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;

  const newPost = new Post({
    title: postTitle,
    content: postContent
  });

  newPost.save(function(err) {
    if (!err) {
      console.log(newPost);
      res.redirect("/");
    }
  });

});



//App is listening on server port.
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});
