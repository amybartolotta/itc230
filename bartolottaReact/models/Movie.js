var mongoose = require('mongoose');

// remote db connection settings. For security, connectionString should be in a separate file not committed to git
 var connectionString = "mongodb://amybartolotta:Peggy212@ds127993.mlab.com:27993/abitc230";
 var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } };
 mongoose.connect(connectionString, options);


var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));

// define Movie model in JSON key/value pairs
// values indicate the data type of each key
var mySchema = mongoose.Schema({
 title: { type: String, required: true },
 director: String,
 count: Number,
 date: Date,
 inStore: Boolean
}); 

module.exports = mongoose.model('Movie', mySchema);