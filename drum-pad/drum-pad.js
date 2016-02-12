$(document).ready(function() {

	var audioContext = (
		window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.oAudioContext ||
		window.msAudioContext
	);

	if ( !audioContext ) {

		$("#incompatible-browser").show();
		return;
	}

	var context = new audioContext();

	function loadAudio(object, url) {

		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				object.buffer = buffer;
			});
		};

		request.send();
	}

	function addAudioProperties(object) {

		object.name = object.id;
		object.source = 'sounds/' + $(object).data('sound');
		loadAudio(object, object.source);
		object.play = function() {
			var source = context.createBufferSource();
			source.buffer = object.buffer;
			source.connect(context.destination);
			source.start(0);
			object.source = source;
		}
	}

	$('.pad').each(function() {
		addAudioProperties(this);
	});

	$('.pad').click(function() {
		this.play();
	});

	$(document).keydown(function(key) {

		$('.pad').each(function() {
			if ( $(this).data('key') == key.keyCode ) {
				this.play();
				$(this).addClass('keydown');
			}
			return true;
		})
	});

	$(document).keyup(function(key) {

		$('.pad').each(function() {
			if ( $(this).data('key') == key.keyCode ) {
				$(this).removeClass('keydown');
			}
			return true;
		})
	});
});