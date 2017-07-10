let movies = [
    {title: "dune", author:"frank herbert", pubdate:1969},
    {title: "it", author:"steven king", pubdate:1975},
    {title: "moby dick", author:"herman melville", pubdate:1869},
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
    let newmovies = movies.filter((item) => {
        return item.title !== title;
    });
    movies = newmovies;  
    // if old & new array lengths differ, item was deleted
    return {deleted: oldLength !== movies.length, total: movies.length };
};

exports.add = (newmovie) => {
    const oldLength = movies.length;
    // use existing get() method to check if movie already in our list
    let found = this.get(newmovie.title);
    if (!found) {
        movies.push(newmovie);
    }
    // if old & new array lengths differ, item was added
    return {added: oldLength !== movies.length, total: movies.length };
};
