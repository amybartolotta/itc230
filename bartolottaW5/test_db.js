var Movie = require("./models/Movie");

// find all documents 
Movie.find((err, result) => {
    // output error if one occurred
    if (err) {
        console.log(err);
    } else {
        // otherwise output the array of documents
        console.log(result);
    }
});

