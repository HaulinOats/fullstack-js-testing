#!/bin/env node
var express = require('express'),
	app = express(), 
	server = require('http').createServer(app),
	io = require('socket.io')(server);

	app.set('view engine', 'pug');
  	app.use( express.static(__dirname+'/public') );
	app.set('views', __dirname + '/templates');
	require('./routes')(app);

	//bacon ipsom for chat population
	var socketResArr = ["Bacon","ipsum","dolor","amet","chuck","pork","belly","turkey","ham","meatball","boudin","Ball","tip","fatback","porchetta,","turkey","pork","chop","leberkas","sausage","Pancetta","picanha","brisket","tri-tip","filet","mignon","rump","doner","strip","steak","ball","tip","andouille","Strip","steak","pork","belly","capicola","frankfurter","Picanha","jowl","andouille","turkey","meatloaf","chicken"];
	
	//Socket handling
	io.on('connect', function(socket) {
		//generate user id based on end of current timestamp combined with a bacon ipsum word
		var d = new Date(),
			timeStr = d.getTime().toString(),
			userId = socketResArr[Math.floor(Math.random() * socketResArr.length)].toUpperCase() + timeStr.slice(10);

		//send user their unique ID and number of users in chat
		socket.emit('openConnection', {"activeUsers":socket.server.eio.clientsCount, "userId":userId});

		//broadcast new count to all users
		socket.broadcast.emit('user_joined', {"userId": userId, "activeUsers":socket.server.eio.clientsCount});

		//return message sent from client back to client
		socket.on('message', function(data){
			// socket.emit('addToChat', {message:data.message});
			io.sockets.emit('addToChat', {userId: userId, message:data.message});
		})

		//on disconnect
		socket.on('disconnect', function(){
			socket.broadcast.emit('user_left', {"userId":userId, "activeUsers":socket.server.eio.clientsCount});
		});
	});

	var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

	//Open server for socket
	server.listen(server_port, server_ip_address, function () {
		console.log("Listening on " + server_ip_address + ", server_port " + server_port);
	});