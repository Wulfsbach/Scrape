var express = require("express");
var hndl= require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
