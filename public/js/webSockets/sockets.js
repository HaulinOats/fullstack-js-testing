var socket = io(),
	userId;
socket.on('openConnection', function (data) {
	$('#chat-window').append('<p id="open-connection">Connection opened...</p>');
	$('#chat-window').append('<p>Your ID is: ' + data.userId + '</p>');
	$('#active-users-count').text(data.activeUsers);
	userId = data.userId;
});
socket.on('addToChat', function(data){
	$('#chat-window').append('<p><b>' + data.userId + ':</b>  ' + data.message + '</p>');
	$('#chat-window').scrollTop(10000000);
});
socket.on('user_joined', function(data){
	$('#active-users-count').text(data.activeUsers);
	$('#chat-window').append('<p>Your ID is: ' + data.userId + ' has joined the conversation...</p>');
});
socket.on('user_left', function(data){
	$('#active-users-count').text(data.activeUsers);
	$('#chat-window').append('<p>Your ID is: ' + data.userId + ' has left the conversation</p>');
});
$('#chat-submit').on('keyup', function(event){
	if (event.keyCode === 13 && event.currentTarget.value.length > 0) {
		socket.emit('message', {message:event.currentTarget.value});
		$(event.currentTarget).val('');
	}
});