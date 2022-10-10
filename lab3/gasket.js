"use strict";
const { vec3 } = glMatrix;
var canvas;
var gl;
var points = [];
var numTimesToSubdivide;
function changeL(){
	numTimesToSubdivide = parseInt(myInput.count.value);
	if(numTimesToSubdivide<0||numTimesToSubdivide>7){
		document.getElementById("Triangle").innerHTML="数据不合法，请重新输入！";
		return ;
	}
	// <canvas id="gl-canvas" width="512" height="512">你的浏览器不支持HTML5 canvas元素</canvas>
	document.getElementById("Triangle").innerHTML = "<canvas id=\"gl-canvas\" style=\"border:none;\" width=\"512\" height=\"512\" onclick=\"initTriangles("+numTimesToSubdivide+")\"></canvas>";
	console.log("<canvas id=\"gl-canvas\" style=\"border:none;\" width=\"500\" height=\"500\" onclick=\"initTriangles("+numTimesToSubdivide+")\"></canvas>");
		(() => {
			// 兼容IE
			if (document.all) {
				document.getElementById("gl-canvas").click();
			}
			// 兼容其它浏览器
			else {
				var e = document.createEvent("MouseEvents");
				e.initEvent("click", true, true);
				document.getElementById("gl-canvas").dispatchEvent(e);
			}
		})();
}
function initTriangles(num){
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// initialise data for Sierpinski gasket

	// first, initialise the corners of the gasket with three points.
	var vertices = [
		-1, -1,  0,
		 0,  1,  0,
		 1, -1,  0
	];

	// var u = vec3.create();
	// vec3.set( u, -1, -1, 0 );
	var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
	// var v = vec3.create();
	// vec3.set( v, 0, 1, 0 );
	var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
	// var w = vec3.create();
	// vec3.set( w, 1, -1, 0 );
	var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
    // configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	divideTriangle( u, v, w, num );
	// load shaders and initialise attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// load data into gpu
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

	// associate out shader variables with data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	renderTriangles();
};

function triangle( a, b, c ){
	//var k;
	points.push( a[0], a[1], a[2], b[0], b[1], b[2]);
	points.push( b[0], b[1], b[2], c[0], c[1], c[2]);
	points.push( c[0], c[1], c[2], a[0], a[1], a[2]);
	console.log(points);
	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );
}

function divideTriangle( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle( a, b, c );
		return;
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;
		// three new triangles
		divideTriangle( a, ab, ca, count );
		divideTriangle( b, bc, ab, count );
		divideTriangle( c, ca, bc, count );
		divideTriangle( ab, ca, bc, count);
	}
}

function renderTriangles(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINES, 0, points.length/3);
}