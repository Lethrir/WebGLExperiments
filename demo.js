var gamepadActive = false;			 

var shaderProgram;
var squareXRotate = 0.0;
var squareYRotate = 0.0;
var squareZRotate = 0.0;
var lastSquareUpdateTime = null;

var squareXOffset = 0.0;  
var squareYOffset = 0.0;  
var squareZOffset = 0.0; 

var xIncValue = 0.2;  
var yIncValue = -0.4;  
var zIncValue = 0.3;

function start(){

	gamepad.init();
	keyboard.init();
	var canvas = document.getElementById("glcanvas");  

	initWebGL(canvas);      // Initialize the GL context  

		// Only continue if WebGL is available and working  
    
  	if (gl) {  
    	gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque  
    	gl.enable(gl.DEPTH_TEST);                               // Enable depth testing  
    	gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things  
    	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.  
	}
}

function initWebGL(canvas) {
	// Initialize the global variable gl to null.
	gl = null;

	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch(e) {}

	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}

	initShaders();
	initBuffers();
	setInterval(drawScene, 15);
}

function initShaders() {  
	var fragmentShader = getShader(gl, "shader-fs");  
	var vertexShader = getShader(gl, "shader-vs");  

	// Create the shader program  

	shaderProgram = gl.createProgram();  
	gl.attachShader(shaderProgram, vertexShader);  
	gl.attachShader(shaderProgram, fragmentShader);  
	gl.linkProgram(shaderProgram);  

	// If creating the shader program failed, alert  

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {  
	alert("Unable to initialize the shader program.");  
	}  

	gl.useProgram(shaderProgram);  

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");  
	gl.enableVertexAttribArray(vertexPositionAttribute);  

	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");  
	gl.enableVertexAttribArray(vertexColorAttribute); 
}

function getShader(gl, id) {  
    var shaderScript, theSource, currentChild, shader;  
      
    shaderScript = document.getElementById(id);  
      
    if (!shaderScript) {  
        return null;  
    }  
      
    theSource = "";  
    currentChild = shaderScript.firstChild;  
      
    while(currentChild) {  
        if (currentChild.nodeType == currentChild.TEXT_NODE) {  
            theSource += currentChild.textContent;  
        }  
          
        currentChild = currentChild.nextSibling;  
    } 

    if (shaderScript.type == "x-shader/x-fragment") {  
		shader = gl.createShader(gl.FRAGMENT_SHADER);  
	} else if (shaderScript.type == "x-shader/x-vertex") {  
		shader = gl.createShader(gl.VERTEX_SHADER);  
	} else {  
	 // Unknown shader type  
	 return null;  
	}

	gl.shaderSource(shader, theSource);  
	  
	// Compile the shader program  
	gl.compileShader(shader);    
	  
	// See if it compiled successfully  
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {    
	  alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));    
	  return null;    
	}

	return shader;  

}

var horizontalDimension = 720.0;
var verticalDimension = 450.0;
var horizAspect = verticalDimension/horizontalDimension;  

function initBuffers() {  
  	squareVerticesBuffer = gl.createBuffer();  
  	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);  
    
  /*	var vertices = [  
    	1.0,  1.0,  0.0,  
    	-1.0, 1.0,  0.0,  
    	1.0,  -1.0, 0.0,  
    	-1.0, -1.0, 0.0  
  	]; */

  	var vertices = [
        // Front face
         0.0,  1.0,  0.0,
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
        // Right face
         0.0,  1.0,  0.0,
         1.0, -1.0,  1.0,
         1.0, -1.0, -1.0,
        // Back face
         0.0,  1.0,  0.0,
         1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,
        // Left face
         0.0,  1.0,  0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0
    ]; 
    
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	/*var colors = [  
		1.0,  1.0,  1.0,  1.0,    // white  
		1.0,  0.0,  0.0,  1.0,    // red  
		0.0,  1.0,  0.0,  1.0,    // green  
		0.0,  0.0,  1.0,  1.0     // blue  
	];*/

	var colors = [
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0
	];  

	squareVerticesColorBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);  
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function drawScene() {  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  

	perspectiveMatrix = makePerspective(45, horizontalDimension/verticalDimension, 0.1, 100.0);

	loadIdentity();  
	mvTranslate([-0.0, 0.0, -6.0]);  
	mvPushMatrix();

	mvRotate(squareXRotate, [1, 0, 0]);
	mvRotate(squareYRotate, [0, 1, 0]);
	mvRotate(squareZRotate, [0, 0, 1]);

	mvTranslate([squareXOffset, squareYOffset, squareZOffset]);

	if(buttonPresses[2]){
		squareXRotate += 0.6;  
	}
	
	if(axisVals[3]>0.2 || axisVals[3]<-0.2){
		squareZRotate+=axisVals[3];
		console.log('rotate z', squareZRotate)
	}

	if(axisVals[2]>0.2 || axisVals[2]<-0.2){
		squareYRotate+=axisVals[2];
		console.log('rotate y', squareYRotate);
	}
	

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);  
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);  
	setMatrixUniforms();  
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);  
		gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

	mvPopMatrix();
	
	if(buttonPresses[13]){
		squareXOffset -= xIncValue * 0.6;
	}
	if(buttonPresses[14]){
		squareXOffset += xIncValue * 0.6;
	}

	if(buttonPresses[11]){
	    squareYOffset -= yIncValue * 0.6;  
	}
	if(buttonPresses[12]){
	    squareYOffset += yIncValue * 0.6;  
	}

    if(buttonPresses[4]){
    	squareZOffset -= zIncValue * 0.6;  
	}
	if(buttonPresses[5]){
    	squareZOffset += zIncValue * 0.6;  
	}

}

function goFullscreen(){
	var elem = document.getElementById('glcanvas');
	if (elem.requestFullScreen) {  
		elem.requestFullScreen();  
	} else if (elem.mozRequestFullScreen) {  
		elem.mozRequestFullScreen();  
	} else if (elem.webkitRequestFullScreen) {  
		elem.webkitRequestFullScreen();  
	}  

}