$(document).ready(function(){
	$('#submit-parameter').on('click', function(){
		window.location.href = "/rest/" + $('#url-parameter').val();
	});
});