#!/bin/env node
//  OpenShift sample Node application
// var express = require('express'),
//         app  = express();
// app.use(express.static(__dirname + '/public'))
// app.set('view engine', 'pug');
// app.set('views', __dirname + '/templates');
// require('./routes')(app);

// http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
//     console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
//     server();
// });
var express = require('express'),
	app = express(), 
	server = require('http').createServer(app),
	io = require('socket.io')(server);

	app.set('view engine', 'pug');
  app.use( express.static(__dirname+'/public') );
	app.set('views', __dirname + '/templates');
	require('./routes')(app);

	//Socket handling
	var socketResArr = ["Bacon","ipsum","dolor","amet","chuck","pork","belly","turkey","ham","meatball","boudin.","Ball","tip","fatback","porchetta,","turkey","pork","chop","leberkas","sausage.","Pancetta","picanha","brisket","tri-tip","filet","mignon","rump","doner","strip","steak","ball","tip","andouille.","Strip","steak","pork","belly","capicola","frankfurter.","Picanha","jowl","andouille","turkey","meatloaf","chicken"];
	io.sockets.on('connection', function(socket) {
		//confirm connection
		socket.emit('openConnection', { hello:'Connection opened...'});

		//return message sent from client back to client
	  socket.on('clientSent', function(data){
	  	socket.emit('returnChat', {message:socketResArr[Math.floor(Math.random() * socketResArr.length)]});
	  })
	});

	var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

	//Open server for socket
	server.listen(server_port, server_ip_address, function () {
		console.log("Listening on " + server_ip_address + ", server_port " + server_port);
	});