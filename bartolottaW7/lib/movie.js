'use strict'

let movies = [
    {title: "chinatown", director:"roman polanski", date:1974},
    {title: "jaws", director:"stephen spielberg", date:1975},
    {title: "misery", director:"rob reiner", date:1990},
];

exports.getAll = () => {
    return movies;
};

exports.get = (title) => {
    return movies.find((item) => {
        return item.title === title;
    });
};

exports.delete = (title) => {
    // retain array length for later comparison after array modification
    const oldLength = movies.length;
    movies = movies.filter((item) => {
        return item.title !== title;
    });
    // if old & new array lengths differ, item was deleted
    return {deleted: oldLength !== movies.length, total: movies.length };
};

exports.add = (newMovie) => {
    const oldLength = movies.length;
    // use existing get() method to check if movie already in our list
    let found = this.get(newMovie.title);
    if (!found) {
        movies.push(newMovie);
    }
    // if old & new array lengths differ, item was added
    return {added: oldLength !== movies.length, total: movies.length };
};
