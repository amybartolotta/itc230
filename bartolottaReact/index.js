'use strict'

let express = require("express");
let bodyParser = require("body-parser");
let Movie = require("./models/Movie"); // use database model

let app = express();

// configure Express app
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', require("cors")());
app.use((err, req, res, next) => {
  console.log(err);
});

// set template engine
let handlebars =  require("express-handlebars");
app.engine(".html", handlebars({extname: '.html'}));
app.set("view engine", ".html");

app.get('/', (req,res, next) => {
    Movie.find((err,movies) => {
        console.log(movies)
        if (err) return next(err);
        res.render('home', {movies: JSON.stringify(movies)});    
    });
});

app.get('/about', (req,res) => {
    res.type('text/html');
    res.render('about');
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

app.get('/api/v1/delete/:id', (req,res, next) => {
    Movie.remove({"_id":req.params.id }, (err, result) => {
        if (err) return next(err);
        // return # of items deleted
        res.json({"deleted": result.result.n});
    });
});

app.post('/api/v1/add/', (req,res, next) => {
    // find & update existing item, or add new 
    if (!req.body._id) { // insert new document
        let movie = new Movie({title:req.body.title,director:req.body.director,date:req.body.date});
        movie.save((err,newMovie) => {
            if (err) return next(err);
            console.log(newMovie)
            res.json({updated: 0, _id: newMovie._id});
        });
    } else { // update existing document
        Movie.updateOne({ _id: req.body._id}, {title:req.body.title, director: req.body.director, date: req.body.date }, (err, result) => {
            if (err) return next(err);
            res.json({updated: result.nModified, _id: req.body._id});
        });
    }
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