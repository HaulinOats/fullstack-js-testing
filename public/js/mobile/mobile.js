$(document).ready(function(){
	if (navigator.geolocation) {
		//Get Geolocation
	    navigator.geolocation.getCurrentPosition(showPosition, showError);

	    //Get Device Orientation
	    window.addEventListener("deviceorientation", handleOrientation, true);

	    //Get Device Motion
	    window.addEventListener('devicemotion', deviceMotion, true);
     } else
        alert('browser does not support geolocation')

	//Geolocation Success/Error Handling
	function showPosition(position){
		var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
		
		//print lat and lon to screen
		$('.coords-lat').text(myLatLng.lat);
		$('.coords-lon').text(myLatLng.lng);


	    var map = new google.maps.Map(document.getElementById('show-map'), {
	      zoom: 13,
	      center: myLatLng,
	      scrollwheel: false,
	      draggable:false
	    });

	    var marker = new google.maps.Marker({
	      position: myLatLng,
	      map: map,
	      title: 'You Are Here!'
	    });
	};
	function showError(error){
		switch(error) {
			case error.PERMISSION_DENIED:
	            $('.coords-new').html('').html("<p>User denied the request for Geolocation.</p>");
	            break;
	        case error.POSITION_UNAVAILABLE:
	            $('.coords-new').html('').html("<p>Location information is unavailable.</p>");
	            break;
	        case error.TIMEOUT:
	            $('.coords-new').html('').html("<p>The request to get user location timed out.</p>");
	            break;
	        case error.UNKNOWN_ERROR:
	            $('.coords-new').html('').html("<p>An unknown error occurred.</p>");
	            break;
	    }
	};

	//Device Orientation Handling
	function handleOrientation(event){
		$('#abs-val').text(event.absolute);
		$('#alpha-val').text(event.alpha);
		$('#beta-val').text(event.beta);
		$('#gamma-val').text(event.gamma);
		// $('.cube').css({'translateZ':})
	};

	//Device Motion Hanlding
	function deviceMotion(event){
		
	}
});