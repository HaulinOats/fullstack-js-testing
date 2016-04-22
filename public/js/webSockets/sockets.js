var socket = io();
socket.on('openConnection', function (data) {
	$('#chat-window').append('<p id="open-connection">'+ data.hello +'</p>');
});
socket.on('returnChat', function(data){
	$('#chat-window').append('<p><b>Server: </b> '+ data.message +'</p>');
	$('#chat-window').scrollTop(10000000);
})
$('#chat-submit').on('keyup', function(event){
	if (event.keyCode === 13 && event.currentTarget.value.length > 0) {
		socket.emit('clientSent', {message:event.currentTarget.value});
		$('#chat-window').append('<p><b>Client: </b> '+ event.currentTarget.value +'</p>');
		$(event.currentTarget).val('');
	}
})