var movies = [
 { title:'Gone With the Wind', director: '?'},
 { title:'Wizard of Oz', director: '?'},
 { title:'Rat Race', director: '?'},
 { title:'Best in Show', director: '?'}
];

exports.getAll = () => {
    return movies;
};

exports.get = function(title) {
    return movies.find(function(item) {
        return item.title.toLowerCase() == title.toLowerCase()
    });
};

exports.delete = function(title) {
    var newMovies = movies.filter(function(item) {
        return item.title != title
    });
    
    console.log(newMovies)
    var deleted = newMovies.length != movies.length
    movies = newMovies
    return {deleted: deleted, remaining: movies.length }
};

//console.log(this.delete('Rat Race'))