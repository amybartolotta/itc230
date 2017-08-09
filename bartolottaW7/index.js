'use strict'

var express = require("express");
var app = express();
var Movie = require("./models/Movie"); // use database model

// configure Express app
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/../public'));
app.use(require("body-parser").urlencoded({extended: true}));
app.use('/api', require("cors")());
app.use((err, req, res, next) => {
  console.log(err)
})

// set template engine
let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html', defaultLayout: 'main' }));
app.set("view engine", ".html");

app.get('/', (req,res) => {
    Movie.find((err,movies) => {
        if (err) return next(err);
        res.render('home', {movies: movies });    
    })
});

app.get('/about', (req,res) => {
    res.type('text/html');
    res.render('about');
});

app.get('/get', (req,res,next) => {
    Movie.findOne({ title:req.query.title }, (err, movie) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: movie} ); 
    });
});

app.post('/get', (req,res, next) => {
    Movie.findOne({ title:req.body.title }, (err, movie) => {
        if (err) return next(err);
        res.type('text/html');
        res.render('details', {result: movie} ); 
    });
});

app.get('/delete', (req,res) => {
    Movie.remove({ title:req.query.title }, (err, result) => {
        if (err) return next(err);
        let deleted = result.result.n !== 0; // n will be 0 if no docs deleted
        Movie.count((err, total) => {
            res.type('text/html');
            res.render('delete', {title: req.query.title, deleted: result.result.n !== 0, total: total } );    
        });
    });
});

// api's
app.get('/api/v1/movie/:title', (req, res, next) => {
    let title = req.params.title;
    console.log(title);
    Movie.findOne({title: title}, (err, result) => {
        if (err || !result) return next(err);
        res.json( result );    
    });
});

app.get('/api/v1/movies', (req,res, next) => {
    Movie.find((err,results) => {
        if (err || !results) return next(err);
        res.json(results);
    });
});

app.get('/api/v1/delete/:title', (req,res, next) => {
    Movie.remove({"title":req.params.title }, (err, result) => {
        if (err) return next(err);
        // return # of items deleted
        res.json({"deleted": result.result.n});
    });
});

app.get('/api/v1/add/:title/:director/:date', (req,res, next) => {
    // find & update existing item, or add new 
    let title = req.params.title;
    Movie.update({ title: title}, {title:title, director: req.params.director, date: req.params.date }, {upsert: true }, (err, result) => {
        if (err) return next(err);
        // nModified = 0 for new item, = 1+ for updated item 
        res.json({updated: result.nModified});
    });
});

app.use((req,res) => {
    res.type('text/plain'); 
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
    console.log('Express started');    
});