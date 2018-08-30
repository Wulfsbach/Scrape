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


var results=[];
$("p.title").each(function(i,element){
   
    var title = $(element).text();
    

    var link =$(element).children().attr("href");

    results.push({
        title: title,
        link: link
    });
});
console.log(results);
    });

});
app.listen(PORT, function(){
    console.log("Running on Port " +  PORT);
});
