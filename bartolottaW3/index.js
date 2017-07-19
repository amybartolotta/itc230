"use strict"

let movie = require("./lib/movie.js");

const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + '/public')); // allows direct navigation to static files
app.use(require("body-parser").urlencoded({extended: true}));

let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

// send static file as response
app.get('/', function(req,res){
    res.type('text/html');
//    res.sendFile(__dirname + '/public/home.html'); 
    res.render('home.html', {movies: movie.getAll}); 
});

// send plain text response
app.get('/about', function(req,res){
    res.type('text/plain');
    res.send('About page');
});

// handle GET 
app.get('/delete', function(req,res){
    let result = movie.delete(req.query.title); // delete movie object
    res.render('delete', {title: req.query.title, result: result});
});

app.get('/detail', function(req,res){
    console.log(req.query)
    var found = movie.get(req.query.title);
    res.render("details", {title: req.query.title, result: found, movies: movie.getAll()});
});

// handle POST
app.post('/detail', function(req,res){
    console.log(req.body)
    var found = movie.get(req.body.title);
    res.render("details", {title: req.body.title, result: found, movies: movie.getAll()});
});

// define 404 handler
app.use(function(req,res) {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), function() {
    console.log('Express started');    
});