var express = require('express');
var app = express();
var port = process.env.port || 4500;
app.use(express.json()) ;
app.post("/notify",function(request,response)
{
	console.log("received notify : " + JSON.stringify(request.body));
    //response.json({"Message":"Welcome to Node js" + request.body});
});

app.get("/notify",function(request,response)
{
	console.log("Received action call : " + JSON.stringify(request.query));
	var action = '';
	try
	{
		action = request.query.a;
	}
	catch(ex)
	{
		console.log("Could not extract action name. VOID call.");
	}
	console.log("Performing action : " + action);
	//switch(action)
    //response.json({"Message":"Welcome to Node js" + request.body});
});
 
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});
