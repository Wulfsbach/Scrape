var express = require("express");
var hndl= require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");


var cheerio = require("cheerio");

var db = require("./models");


var PORT = 3000;


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.engine("handlebars", hndl({defaultLayout: "main"}));
app.set("view engine", "handlebars");


app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, function(){
    mongoose.connection.db.dropDatabase();
    console.log("db dropped");
});



app.get("/scrape", function(req,res) {
    mongoose.connection.db.dropDatabase();
  
    request("https://www.reddit.com/r/worldnews/",function(error,response,html){

var $= cheerio.load(html);



$("p.title").each(function(i,element){
   
    var result ={};

    result.title =$(this)
    .children('a')
    .text();

    result.link= $(this)
    .children("a")
    .attr("href");

    db.Article.create(result)
    .then(function(dbArticle){
        console.log(dbArticle);
    })
    .catch(function(err){
        return res.json(err);
    });

    // var title = $(element).text();
    

    // var link =$(element).children().attr("href");

    // result.push({
    //     title: title,
    //     link: link
    // });
});
res.send("Scrape Complete");
    });

});


app.get("/articles", function(req,res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
res.json(err);
    });
});


app.listen(PORT, function(){
    console.log("Running on Port " +  PORT);
});
