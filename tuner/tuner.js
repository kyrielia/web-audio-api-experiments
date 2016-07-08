$(document).ready(function() {

	// A5 = 440Hz
	var concertPitch = 440;

	// 88 keys on a piano
	var numberOfNotes = 88;

	var noteNames = ['A', 'A#/Bb', 'B', 'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab'];

	// Keep a map of piano notes against key number
	var notesMap = {};

	var initialiseNotesMap = function() {

		var octave = 0;
		for ( var n = 1; n <= numberOfNotes; n++ ) {

			// Formula from https://en.wikipedia.org/wiki/Piano_key_frequencies
			var frequency = Math.pow(2, (n - 49)/12) * concertPitch;

			var noteName = noteNames[(n - 1) % noteNames.length];
			if ( noteName === 'C' ) {
				octave++;
			}

			notesMap[frequency] = noteName + octave;
		}
	};

	var nearestNote = function(frequency) {

		var closestNote = null;
		var differenceToClosestFrequency = Number.MAX_VALUE;
		for ( var noteFrequency in notesMap ) {

			if ( notesMap.hasOwnProperty(noteFrequency) ) {

				var frequencyDifference = Math.abs(frequency - noteFrequency);
				if ( frequencyDifference < differenceToClosestFrequency ) {

					closestNote = notesMap[noteFrequency];
					differenceToClosestFrequency = frequencyDifference;
				}
			}
		}

		return closestNote;
	};

	initialiseNotesMap();
	console.log(nearestNote(137));

});