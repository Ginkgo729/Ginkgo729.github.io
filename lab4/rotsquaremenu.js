"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var delay = 200;

function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		 0,0,0,
		-0.4,0.6,0,
		0,1,0,
		0,0,0,
	    0,0.4,0,
		0.6,0.4,0,
		0,0,0,
		0.6,0.4,0,
		1,0,0,
		0,0,0,
		0.4,0,0,
		0.4,-0.6,0,
		0,0,0,
		0.4,-0.6,0,
		0,-1,0,
		0,0,0,
		0,-0.4,0,
		-0.6,-0.4,0,
		0,0,0,
		-0.6,-0.4,0,
		-1,0,0,
		0,0,0,
		-0.4,0,0,
		-0.4,0.6,0,
		
		-0.905,0.305,0,
		-0.895,0.295,0,
		-0.695,0.495,0,
		-0.705,0.505,0,
		-0.805,0.205,0,
		-0.795,0.195,0,
		-0.595,0.395,0,
		-0.605,0.405,0,
		
		0.905,-0.305,0,
		0.895,-0.295,0,
		0.695,-0.495,0,
		0.705,-0.505,0,
		0.805,-0.205,0,
		0.795,-0.195,0,
		0.595,-0.395,0,
		0.605,-0.405,0,
		
		0.195,0.795,0,
		0.205,0.805,0,
		0.405,0.605,0,
		0.395,0.595,0,
		0.305,0.905,0,
		0.295,0.895,0,
		0.495,0.695,0,
		0.505,0.705,0,
		
		-0.195,-0.795,0,
		-0.205,-0.805,0,
		-0.405,-0.605,0,
		-0.395,-0.595,0,
		-0.305,-0.905,0,
		-0.295,-0.895,0,
		-0.495,-0.695,0,
		-0.505,-0.705,0,
	
		
	];

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById( "controls" ).onclick = function( event ){
		switch( event.target.index ){
			case 0:
				direction *= -1;
				break;
			case 1:
				delay /= 2.0;
				break;
			case 2:
				delay *= 2.0;
				break;	
		}
	};

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	if( theta > 2 * Math.PI )
		theta -= (2 * Math.PI);
	else if( theta < -2 * Math.PI )
		theta += ( 2 * Math.PI );

	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 3, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 6, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 9, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 12, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 15, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 18, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 21, 3 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 24, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 28, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 32, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 36, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 40, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 44, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 48, 4 );
	gl.drawArrays( gl.TRIANGLE_STRIP, 52, 4 );
	

	// update and render
	setTimeout( function (){ requestAnimFrame( renderSquare ); }, delay );
}