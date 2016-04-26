'use strict';

var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass   = require('gulp-sass');
var maps   = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var pug = require('gulp-pug');
var express = require('express');

gulp.task('express', function(){
	var app = express(), 
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

	//Open server for socket
	server.listen(8000, function() {
	   console.log("Server listening on port 8000");
	});
});

gulp.task('concatScripts', function(){
	return gulp.src([
		'public/js/jquery-2.2.1.js',
		'public/js/bootstrap.min.js',
		'public/js/jquery.easing.min.js',
		'public/js/jquery.fittext.js',
		'public/js/wow.min.js',
		'public/js/creative.js',
	])
	.pipe(maps.init())
	.pipe(concat('app.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest(__dirname + '/public/js'))
	.pipe(livereload())
})

gulp.task("minify", ['concatScripts'], function(){
	return gulp.src("js/app.js")
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest(__dirname + '/public/js'))
});

gulp.task('sass', function () {
  return gulp.src('public/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'))
    .pipe(livereload());
});

gulp.task('pug', function(){
	return gulp.src('templates/**/*.pug')
	.pipe(livereload())
})

gulp.task('javascript', function(){
	return gulp.src('public/js/**/*.js')
	.pipe(livereload())
})

gulp.task('watch', function(){
	gulp.watch('public/js/*.js', ['concatScripts']);
	gulp.watch('public/scss/*.scss', ['sass']);
	gulp.watch('templates/**/*.pug', ['pug']);
	gulp.watch('public/js/**/*.js', ['javascript']);
	livereload.listen();
})

gulp.task('default', ['express','watch'], function(){

});