var keyboard = {

	init: function(){
		document.onkeydown = function(evt){keyboard.keyPressed(evt, true);};
		document.onkeyup = function(evt){keyboard.keyPressed(evt, false);};
	},

	keyPressed: function(evt, pressed){
		var key = evt.keyCode;
		console.log('Key pressed', key);

		// TOOO: Map keys
		// r = 82
		if(evt.keyCode == 82){
			buttonPresses[2] = pressed;
		}
		// a = 65, 13
		if(evt.keyCode == 65){
			buttonPresses[13] = pressed;
		}
		// s = 83, 12
		if(evt.keyCode == 83){
			buttonPresses[12] = pressed;
		}
		// d = 68, 14
		if(evt.keyCode == 68){
			buttonPresses[14] = pressed;
		}
		// w = 87, 11
		if(evt.keyCode == 87){
			buttonPresses[11] = pressed;
		}
		// z = 90
		if(evt.keyCode == 90){
			buttonPresses[4] = pressed;
		}
		// x = 88
		if(evt.keyCode == 88){
			buttonPresses[5] = pressed;
		}
	}
};