//JSON Data is received via Post request. The data must then be filtered and returned according to the given specifications.

const http = require('http');
const fs = require('fs');
//use the environment port or if that's not available use port 5000.
const PORT = process.env.PORT || 5000;

http.createServer(function(req,res){
	//check requested method, depending on the request method perform different actions.
	if(req.method ==='GET'){
		if(req.url.matches(/.html$/)){
			//Define the header of response
			res.writeHead(200, {'Content-Type':'text/html'});
			//Pipe a file system read stream of the html to the body of the response.
			fs.createReadStream('./index.html','UTF-8').pipe(res); 
		}else if(req.url.matches(/.css$/)){
			//Define the header of response
			res.writeHead(200, {'Content-Type':'text/css'});
			//Pipe a file system read stream of the html to the body of the response.
			fs.createReadStream('./styles.css','UTF-8').pipe(res); 
		}else{
			//Respond with file not found
			res.writeHead(404, {'Content-Type':'text/plain'});
			res.end("404 File Not Found.");
		}
	}else if(req.method === 'POST'){
		//Variable to store the JSON data as it is streamed
		var body = "";
		//Listen for the 'data' event, which fires whenever data from the stream is received as a 'chunk'.
		req.on('data', function(chunk){
			//Append the chunk of data to the body
			body+=chunk;
		});

		//Define an end listener which will return the filtered JSON response once the post request has ended.
		req.on('end', function(){
			res.writeHead(200, {'Content-Type':'text/json'});
			filterJSON(res,JSON.parse(body));
		});
	}
	

}).listen(PORT); //listen on given port for incoming requests.

console.log(`Server listening on port ${PORT}`);


//Filters input JSON data, 'data'. Sends back the response, 'res', containing the filtered JSON data as text.
function filterJSON(res, data){
				//array has filter function.
	var filtered = data.filter(function(item){
		//This is a predicate function called once for every item of the input array. 
		//If true is returned, then that particular item will be included in the filtered array, otherwise it wont be.
		return (item.type === 'htv' && item.workflow === 'completed');
	});
	//Send back the response with filtered json as the body of the response
	res.end(JSON.stringify(filtered)); 
}
