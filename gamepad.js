var xboxButtons = [];

var xboxAxis = [];

xboxButtons[0] = 'A';
xboxButtons[1] = 'B';
xboxButtons[2] = 'X';
xboxButtons[3] = 'Y';
xboxButtons[4] = 'BumperLeft';
xboxButtons[5] = 'BumperRight';
xboxButtons[6] = 'StickLeftPress';
xboxButtons[7] = 'StickRightPress';
xboxButtons[8] = 'Start';
xboxButtons[9] = 'Back';
xboxButtons[10] = 'Home';
xboxButtons[11] = 'DPadUp';
xboxButtons[12] = 'DPadDown';
xboxButtons[13] = 'DPadLeft';
xboxButtons[14] = 'DPadRight';

xboxAxis[0] = 'LeftStickHorizontal';
xboxAxis[1] = 'LeftStickVertical';
xboxAxis[2] = 'RightStickHorizontal';
xboxAxis[3] = 'RightStickVertical';
xboxAxis[4] = 'LeftTrigger';
xboxAxis[5] = 'RightTrigger';

var axisVals = [0,0,0,0,0,0];
var buttonPresses = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

var gamepad = {
	init: function(){
		window.addEventListener('MozGamepadConnected', gamepadConnected);
		window.addEventListener('MozGamepadDisconnected', gamepadDisconnected);
		window.addEventListener("MozGamepadButtonDown", function(evt) { gamepad.buttonPressed(evt, true); } );
		window.addEventListener("MozGamepadButtonUp", function(evt) { gamepad.buttonPressed(evt, false); } );
		window.addEventListener("MozGamepadAxisMove", gamepad.moveAnalogSticks);

	},

	buttonPressed: function (evt, pressed) {
		console.log(xboxButtons[evt.button], pressed);
		buttonPresses[evt.button] = pressed;
	},

	moveAnalogSticks:	function (evt) {
		if(evt.value > 0.1 || evt.value < -0.1){
			console.log(xboxAxis[evt.axis], evt.value);

			axisVals[evt.axis] = evt.value;
			/*xIncValue = -axisVals[2];  
	    	yIncValue = -axisVals[3];*/  
			//plotAxis(lsCtx, lsCanvas, axisVals[0], axisVals[1]);
			//plotAxis(rsCtx, rsCanvas, axisVals[2], axisVals[3]);
			//plotAxis(ltCtx, ltCanvas, 0, axisVals[4]);
			//plotAxis(rtCtx, rtCanvas, 0, axisVals[5]);
		}
	},

	/*

var currentTime = (new Date).getTime();  
				if (lastSquareUpdateTime) {  
				var delta = currentTime - lastSquareUpdateTime;  
				  
				squareRotation += (30 * delta) / 1000.0;  
				}

				lastSquareUpdateTime = currentTime; 

				squareXOffset += xIncValue * ((30 * delta) / 1000.0);  
			    squareYOffset += yIncValue * ((30 * delta) / 1000.0);  
			      
			    if (Math.abs(squareYOffset) > 2.5) {  
			      xIncValue = -xIncValue;  
			      yIncValue = -yIncValue;  
			      zIncValue = -zIncValue;  
			    } 

	*/

};

function gamepadConnected(evt)
{
	console.log(evt);
	gamepadActive = true;
}

function gamepadDisconnected(evt)
{
  console.log(evt);
  gamepadActive = false;
}


		