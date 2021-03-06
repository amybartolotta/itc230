var http = require("http"), fs = require('fs'), qs = require("querystring");
let movies = require("./movies.js");

console.log(movies.getAll())

function serveStatic(res, path, contentType, responseCode){
  if(!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, function(err, data){
      if(err){
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      }
      else{
        res.writeHead(responseCode, {'Content-Type': contentType});
        res.end(data);
      }
  });
}

http.createServer((req,res) => {
  let url = req.url.split("?");  // seperate route from query string
  let params = qs.parse(url[1]); // convert query string to object
  let path = url[0].toLowerCase();

console.log(params)
  switch(path) {
    case '/': 
      serveStatic(res, '/../public/home.html', 'text/html');
      break;
    case '/about':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('About');
      break;
    case '/get':
      let found = movies.get(params.title);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      let results = (found) ? JSON.stringify(found) : "Not found";
      res.end('Results for ' + params.title + "\n" + results);
      break;
    case '/delete':
      res.writeHead(200, {'Content-Type': 'text/plain'});
      var result = movies.delete(params.title);
      console.log(result);
      res.end(params.title + ' removed. ' +  result.remaining + ' total books');
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404:Page not found.');
  }
  
}).listen(process.env.PORT || 3000);