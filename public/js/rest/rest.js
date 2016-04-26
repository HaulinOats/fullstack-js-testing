$(document).ready(function(){
	$('#rest-submit').on('click', function(){
		goToLink($('#rest-input').val())
	});
	$('#rest-input').on('keyup', function(e){
		if (e.keyCode == 13)
			goToLink($('#rest-input').val())
	});
	function goToLink(value){
		window.location.href = "/rest/" + value;
	}
});