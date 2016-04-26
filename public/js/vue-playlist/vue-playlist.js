var songsRef = new Firebase("https://shining-heat-6737.firebaseio.com/songs");

new Vue({
	el:'#playlist-container',
	firebase: {
		songs:songsRef
	},
	methods: {
		addSong:function(event){
			var form = document.getElementById('new-song'),
				songObj = {};
			for (var i = 0; i < form.elements.length - 1;i++){
				console.log(form.elements[i].name);
				if (form.elements[i].value.length < 1)
					return;
				else {
					songObj[form.elements[i].name] = form.elements[i].value;
				}
			}
			songsRef.push(songObj);
			form.reset();
		}
	}
})