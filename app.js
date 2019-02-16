#!/usr/bin/env nodejs


const express         = require("express"),
app                 = express(),
mongoose            = require("mongoose"),
expressSanitizer    = require("express-sanitizer"),
bodyParser          = require("body-parser"),
methodOverride      = require("method-override");


const port = 8080;

mongoose.connect("mongodb://localhost:27017/restfulblogapp", {useNewUrlParser: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
//Must go after body-parser .use()
app.use(expressSanitizer());
app.set("view engine", "ejs");


//Mongoose, Model config
let blogSchema = new mongoose.Schema({
    title: String,
    // image: {type: String, default: },
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "test dog",
//     image: "https://images.unsplash.com/photo-1529927066849-79b791a69825?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
//     body: "This is the post body"
// });


//Sanitize CREATE and UPDATE


//RESTful Routes
//Index Route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
            console.log(blogs);
        } else{
            res.render("index.ejs", {blogs: blogs});
        }
    });
});

//New route
app.get("/blogs/new", function(req, res){
    res.render("new.ejs");
});

//Create Route
app.post("/blogs", function(req, res){
    //Create Blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err);
        } else {
    //Redirect to ...
            res.redirect("/blogs");
        }
    });
});

//Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", {blog: foundBlog})
        }
    });
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("edit.ejs", {blog: foundBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
             console.log(err);
        } else {
            res.redirect("/blogs/" + updatedBlog.id)
        }
    });
});

//Delete Route
app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
    //Redirect to..
            res.redirect("/blogs");
        }
    });
});

app.listen(port, function(){
    console.log("server started");
    console.log("Magic at: " + port);
});




// const express         = require("express"),
// app                 = express(),                 
// // mongoose            = require("mongoose"),
// // expressSanitizer    = require("express-sanitizer"),
// bodyParser          = require("body-parser"),
// methodOverride      = require("method-override");

// const port = process.env.PORT || 8080;  

// app.use(express.static("public"));
// app.use(methodOverride("_method"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.set("view engine", "ejs");


// app.get("/", function(req, res){
//     res.redirect("/blogs");
// });

// app.get("/blogs", function(req, res){
//     Blog.find({}, function(err, blogs){
//         if(err){
//             console.log(err);
//             console.log(blogs);
//         } else{
//             res.render("index.ejs", {blogs: blogs});
//         }
//     });
// });



// app.listen(port, function(){
//     console.log("server started");
//     console.log("Magic at: " + port);
// });

// const router = express.Router();
// router.get('/', function(req, res) {
//     res.json({ message: 'API is Online!' });   
// });

// app.use('/api', router);


