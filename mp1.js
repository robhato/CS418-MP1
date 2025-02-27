
/**
 * @file A simple WebGL example drawing a triangle with colors
 * @author Eric Shaffer <shaffer1@eillinois.edu>  
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/** @global The WebGL buffer holding the triangle */
var vertexPositionBuffer;

/** @global The WebGL buffer holding the vertex colors */
var vertexColorBuffer;

/** @global Rotation angle for I */
var rotAngle = 0;

/** @global The ModelView matrix contains any modeling and viewing transformations */
var mvMatrix = glMatrix.mat4.create();

/** @global A second ModelView matrix contains any modeling and viewing transformations */
var mvMatrix2 = glMatrix.mat4.create();

/** @global Getting the current time in seconds */
var currTime;

/** @global Records time last time frame rendered */
var previousTime = 0;

/** @global time diff between previous time and now */
var deltaTime;

/**
 * Function for translating degrees to radians
 * @param {Number} degrees Degree input to function
 * @return {Number} Radians that correspond to degrees given 
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var context = null;
  context = canvas.getContext("webgl2");
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
    
  var shaderSource = shaderScript.text;
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMvMatrix");
  shaderProgram.mvMatrixUniform2 = gl.getUniformLocation(shaderProgram, "uMvMat2");
    
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
}

/**
 * Function to handle creation of buffers and animation for blockI i.e. the first animation
 */
function drawBlockI() {
  
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
        -0.6, 0.9, 0.0,
        -0.6, 0.6, 0.0,
        -0.2, 0.6, 0.0,
        -0.6, 0.9, 0.0,
        -0.2, 0.6, 0.0,
         0.6, 0.9, 0.0,
        -0.2, 0.6, 0.0,
         0.2, 0.6, 0.0,
         0.6, 0.9, 0.0,
        -0.2, 0.6, 0.0,
        -0.2, -0.6, 0.0,
         0.2, -0.6, 0.0,
        -0.2, 0.6, 0.0,
         0.2, 0.6, 0.0,
         0.2, -0.6, 0.0,
        -0.2, -0.6, 0.0,
        -0.6, -0.6, 0.0,
        -0.6, -0.9, 0.0,
         0.6, -0.9, 0.0,
         0.6, -0.6, 0.0,
         0.2, -0.6, 0.0,
         0.2, 0.6, 0.0,
         0.6, 0.6, 0.0,
         0.6, 0.9, 0.0,
        -0.6, -0.9, 0.0,
        -0.2, -0.6, 0.0,
         0.6, -0.9, 0.0,
        -0.2, -0.6, 0.0,
         0.2, -0.6, 0.0,
         0.6, -0.9, 0.0,
        -0.7,1.0, 0.0,
        -0.6,0.9, 0.0,
        -0.7,0.9, 0.0,
        -0.7,1.0, 0.0,
         0.7,1.0, 0.0,
        -0.6,0.9, 0.0,
        -0.6,0.9, 0.0,
         0.7, 0.9, 0.0,
         0.7, 1.0, 0.0,
         0.7, 1.0, 0.0,
         0.7, 0.9, 0.0,
         0.6, 0.9, 0.0,
        -0.7, 0.9, 0.0,
        -0.7, 0.6, 0.0,
        -0.6, 0.6, 0.0,
        -0.7, 0.9, 0.0,
        -0.6, 0.9, 0.0,
        -0.6, 0.6, 0.0,
        -0.7, 0.6, 0.0,
        -0.7, 0.5, 0.0,
        -0.6, 0.6, 0.0,
        -0.7, 0.5, 0.0,
        -0.6, 0.6, 0.0,
        -0.6, 0.5, 0.0,
        -0.6, 0.5, 0.0,
        -0.6, 0.6, 0.0,
        -0.2, 0.6, 0.0,
        -0.6, 0.5, 0.0,
        -0.2, 0.6, 0.0,
        -0.2, 0.5, 0.0,
        -0.3, 0.5, 0.0,
        -0.3, -0.6, 0.0,
        -0.2, -0.6, 0.0,
        -0.3, 0.5, 0.0,
        -0.2, 0.5, 0.0,
        -0.2, -0.6, 0.0,
        -0.3, -0.5, 0.0,
        -0.3, -0.6, 0.0,
        -0.7, -0.5, 0.0,
        -0.3, -0.6, 0.0,
        -0.7, -0.6, 0.0,
        -0.7, -0.5, 0.0,
        -0.7, -0.6, 0.0,
        -0.7, -1.0, 0.0,
        -0.6, -1.0, 0.0,
        -0.7, -0.6, 0.0,
        -0.6, -0.6, 0.0,
        -0.6, -1.0, 0.0,
        -0.6, -1.0, 0.0,
        -0.6, -0.9, 0.0,
         0.7, -0.9, 0.0,
        -0.6, -1.0, 0.0,
         0.7, -1.0, 0.0,
         0.7, -0.9, 0.0,
         0.7, -0.9, 0.0,
         0.6, -0.9, 0.0,
         0.7, -0.5, 0.0,
         0.7, -0.5, 0.0,
         0.6, -0.5, 0.0,
         0.6, -0.9, 0.0,
         0.6, -0.5, 0.0,
         0.6, -0.6, 0.0,
         0.2, -0.6, 0.0,
         0.6, -0.5, 0.0,
         0.2, -0.5, 0.0,
         0.2, -0.6, 0.0,
         0.2, -0.5, 0.0,
         0.3, -0.5, 0.0,
         0.2, 0.6, 0.0,
         0.2, 0.6, 0.0,
         0.3, 0.6, 0.0,
         0.3, -0.5, 0.0,
         0.3, 0.6, 0.0,
         0.7, 0.5, 0.0,
         0.3, 0.5, 0.0,
         0.3, 0.6, 0.0,
         0.7, 0.6, 0.0,
         0.7, 0.5, 0.0,
         0.7, 0.6, 0.0,
         0.7, 0.9, 0.0,
         0.6, 0.6, 0.0,
         0.6, 0.6, 0.0,
         0.7, 0.9, 0.0,
         0.6, 0.9, 0.0
                
  ];
  for (var i = 0; i < triangleVertices.length; i += 3) {
      if (currTime % 60 < 20) {
          triangleVertices[i] *= Math.cos(degToRad(document.getElementById("degrees").value));
          triangleVertices[i+1] *= 2;
      } else if (currTime % 60 > 20) {
          triangleVertices[i] *= 2;
          triangleVertices[i+1] *= Math.cos(degToRad(document.getElementById("degrees").value));
      } else {
          triangleVertices[i] *= 1;
      }
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 114;   
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.9, 0.29, 0.15, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,
        0.07, 0.16, 0.29, 1.0,   
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 114;  
    
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Send current ModelView matrix to vertex shader
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform2, false, mvMatrix2);
    
  // Render I
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);
    
  
  var scaler = document.getElementById("scale").value;
   // Scalar vector used for translation
  var scaleVec = glMatrix.vec3.fromValues(scaler, scaler, 0);

  
  // Update geometry to rotate speed degrees per second
  // Also Update Geometry to change scale of I
     
     glMatrix.mat4.fromScaling(mvMatrix2, scaleVec);
     glMatrix.mat4.fromZRotation(mvMatrix, degToRad(rotAngle));
}

/**
 * Function to handle creation of buffers and animation
 */
function drawCustomAnimation() { 
    
  vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var triangleVertices = [
      0.0, 0.0, 0.0,
      -0.3, 1.0, 0.0,
      0.3, 1.0, 0.0,
      0.0, 0.0, 0.0,
      -0.3, -1.0, 0.0,
      -0.5, -0.8, 0.0,
      0.0, 0.0, 0.0,
      0.3, -1.0, 0.0,
      0.5, -0.8, 0.0,
      
  ];
    // Math operation to multiply vertex coordinates by sine value to reverse coordinates
  for (var i = 0; i < triangleVertices.length; i++) {
      triangleVertices[i] = triangleVertices[i] * Math.sin(degToRad(document.getElementById("degrees").value));
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 3;
  vertexPositionBuffer.numberOfItems = 9;
    
  vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  var colors = [
     0.07, 0.16, 0.29, 1.0,
     0.9, 0.29, 0.15, 1.0,
     0.69, 0.98, 0.01, 1.0,
     0.07, 0.16, 0.29, 1.0,
     0.9, 0.29, 0.15, 1.0,
     0.69, 0.98, 0.01, 1.0,
     0.07, 0.16, 0.29, 1.0,
     0.9, 0.29, 0.15, 1.0,
     0.69, 0.98, 0.01, 1.0,
    ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
  vertexColorBuffer.itemSize = 4;
  vertexColorBuffer.numItems = 9;  
    
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
                         vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                            vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
  // Send current ModelView matrix to vertex shader
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    
  // Render I
  gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numberOfItems);

  // Update geometry to rotate
  glMatrix.mat4.fromZRotation(mvMatrix, degToRad(rotAngle));
  
}

/**
 * Function that updates geometry and repeatedly renders frames.
 */
 function animate(now) {
     
      // Convert time to seconds
     var speed = document.getElementById("speed").value;
      now *= 0.001;
       // Subtract previous time from current time
      deltaTime = now - previousTime;
       // Remember current time for next frame
      previousTime = now;
      currTime = now;
     rotAngle += speed*deltaTime;
     if (rotAngle > 360.0) {
         rotAngle = 0.0;
     }
     if (document.getElementById("animationA").checked) {
         drawBlockI();
     } else {
         drawCustomAnimation();
     } 
     
     // ...next frame after
     requestAnimationFrame(animate);  
     
 }

/**
 * Startup function called from html code to start program.
 */
 function startup() {
  
  console.log("No bugs so far...");
  canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders(); 
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(animate);  
}
