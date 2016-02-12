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
	var convolver = context.createConvolver();
	var dryGain = context.createGain();
	var wetGain = context.createGain();

	dryGain.gain.value = 1;
	wetGain.gain.value = 0;

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
			convolver.buffer = source.buffer;
			source.connect(convolver);
			source.connect(dryGain);
			dryGain.connect(context.destination);
			convolver.connect(wetGain);
			wetGain.connect(context.destination);
			source.start(0);
			object.source = source;
		}
	}

	$('.pad').each(function() {
		addAudioProperties(this);
	});

	$('.pad').mousedown(function() {
		$(this).addClass('keydown');
		this.play();
	});

	$('.pad').mouseup(function() {
		$(this).removeClass('keydown');
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

	$('#reverb').on('change', function() {
		var percent = $(this).val();

		wetGain.gain.value = Math.cos((1 - percent) * 0.5 * Math.PI);
		dryGain.gain.value = Math.cos(percent * 0.5 * Math.PI);
	});
});