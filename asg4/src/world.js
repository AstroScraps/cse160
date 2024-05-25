// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main()
  {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position; // lighting stuff
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform vec3 u_lightColor; // change this to vec4
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightToggle;

  // samplers
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  
  // texture handling
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0); // normal
    }  else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor; // color
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0); // debug color
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // texture0
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // texture1
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV); // texture2
    } else {
      gl_FragColor = vec4(1, .2, .2, 1); // error color
    }

    // lighting
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    // gl_FragColor = vec4(vec3(gl_FragColor) / (r * r), 1);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N, L), 0.0);

    // reflection
    vec3 R = reflect(-L, N);
    
    // eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // specular
    float specular = pow(max(dot(R, E), 0.0), 50.0);

    // diffuse and ambient
    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7 * u_lightColor;
    vec3 ambient = vec3(gl_FragColor) * 0.5;

    if (u_lightToggle == true) {
      if(u_whichTexture != 1) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    } else {
      gl_FragColor = vec4(ambient, 1.0);
    }
  }`

// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_lightColor;
let u_lightPos;
let u_lightToggle;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_cameraPos
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_lightColor
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  // get the storage location of u_lightPos
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  // get the storage location of u_lightToggle
  u_lightToggle = gl.getUniformLocation(gl.program, 'u_lightToggle');
  if (!u_lightToggle) {
    console.log('Failed to get the storage location of u_lightToggle');
    return;
  }

  // get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the sotrage location of u_ModelMatrix');
    return;
  }

  // get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  // get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  // get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // set initial value for this matrix to identity
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  // set initial value for projection and view matrices
  var projectionMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);

  var viewMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ViewMatrix, false, projectionMatrix.elements);
}

// handle keydown events
function keydown(ev) {
  if (ev.key == "w") {
    g_camera.moveForward();
    console.log("forward!");
  }
  if (ev.key == "s") {
    g_camera.moveBackward();
  }
  if (ev.key == "a") {
    g_camera.moveLeft();
  }
  if (ev.key == "d") {
    g_camera.moveRight();
  }
  if (ev.key == "q") {
    g_camera.turnLeft();
  }
  if (ev.key == "e") {
    g_camera.turnRight();
  }
}

// globals for Assignment 2
// camera move
let g_globalAngleY = 0;
let g_globalAngleX = 0;
let g_shiftKeyActivated = true;
let g_lastX = null;
let g_lastY = null;
let sliderX;
let sliderY;
// other stuff
// limbs
let g_yellowAngle = 0;
let g_yellowAnimation = false;
let g_earAnimation = false;
let g_middleAnimation = false;
let g_earRotate = 0;
let g_middleRotate = 0;
let g_hatSpin = 0;
// lighting
let g_normalOn = false;
let g_lightPos = [0, 1, -2];
let g_lightToggle = true;
let g_lightColor = [1, 1, 1, 1];
// camera
var g_camera = new Camera();

// set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  // button events
  document.getElementById('nOn').onclick = function () { g_normalOn = true; };
  document.getElementById('nOff').onclick = function () { g_normalOn = false; };
  document.getElementById('animationYellowOnButton').onclick = function () { g_yellowAnimation = true; g_earAnimation = true; g_middleAnimation = true; };
  document.getElementById('animationYellowOffButton').onclick = function () { g_yellowAnimation = false; g_earAnimation = false; g_middleAnimation = false; };
  document.getElementById('lightToggle').onclick = function () { g_lightToggle = !g_lightToggle; };

  // slider events
  document.getElementById('lightSliderX').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[0] = this.value / 100;
      renderAllShapes();
    }
  });
  document.getElementById('lightSliderY').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[1] = this.value / 100;
      renderAllShapes();
    }
  });
  document.getElementById('lightSliderZ').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) {
      g_lightPos[2] = this.value / 100;
      renderAllShapes();
    }
  });
  
  // light color sliders
  document.getElementById('lightColorSliderR').addEventListener('mousemove', function (ev) { g_lightColor[0] = this.value });
  document.getElementById('lightColorSliderG').addEventListener('mousemove', function (ev) { g_lightColor[1] = this.value });
  document.getElementById('lightColorSliderB').addEventListener('mousemove', function (ev) { g_lightColor[2] = this.value });

  // movement events
  document.addEventListener('keydown', keydown)
  // credit for camera turn from 'Stanley the Flying Elephant - Nicholas Eastmond' (from the hall of fame)

  canvas.onmousedown = (ev) => {
    let [x, y] = convertCoordinatesToGL(ev);
    g_lastX = x;
    g_lastY = y;
    if (ev.shiftKey) {
      g_shiftKeyActivated = !g_shiftKeyActivated;
    }
  }
  canvas.onmousemove = function (ev) {
    let [x, y] = convertCoordinatesToGL(ev);
    if (ev.buttons == 1) {
      g_globalAngleY -= (x - g_lastX) * 50;
      g_globalAngleX -= (y - g_lastY) * 50;
      g_lastX = x;
      g_lastY = y;
    } else {
      g_lastX = x;
      g_lastY = y;
    }
  }
}

// initTextures
function initTextures(gl) {

  // inits
  var image0 = new Image(); // create the image object
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }

  var image1 = new Image(); // create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  
  var image2 = new Image(); // create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  
  // register the event handler to be called on loading an image
  image0.onload = function(){ sendTextureToTEXTURE0(image0); };
  // tell the browser to load an image
  image0.src = '../resources/obama.png';

  // register the event handler to be called on loading an image
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
  // tell the browser to load an image
  image1.src = '../resources/sky.jpg';

  // register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE2(image2); };
  // tell the browser to load an image
  image2.src = '../resources/soup!.png';

  return true;
}

// sendTextureToGLSL0
function sendTextureToTEXTURE0(image) {
  var texture0 = gl.createTexture(); // create a texture object
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y axis
  // enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture0);

  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  console.log("finished loadTexture0");
}

// sendTextureToGLSL1
function sendTextureToTEXTURE1(image) {
  var texture1 = gl.createTexture(); // create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y axis
  // enable texture unit1
  gl.activeTexture(gl.TEXTURE1);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler1, 1);

  console.log("finished loadTexture1");
}

// sendTextureToGLSL2
function sendTextureToTEXTURE2(image) {
  var texture2 = gl.createTexture(); // create a texture object
  if (!texture2) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y axis
  // enable texture unit1
  gl.activeTexture(gl.TEXTURE2);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // set the texture unit 1 to the sampler
  gl.uniform1i(u_Sampler2, 2);

  console.log("finished loadTexture2");
}

function main() {

  // set up canvas and GL variables
  setupWebGL();

  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // init textures
  initTextures(gl);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // render
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000;
// tick
function tick() {
  // update current time
  g_seconds = performance.now() / 500 - g_startTime;
  console.log(performance.now);

  // update animation angles
  updateAnimationAngles();

  // action
  renderAllShapes();

  // recurse..? sorta
  requestAnimationFrame(tick);
}

// update the angles of everything that is currently animated
function updateAnimationAngles() {
  // neck
  if (g_yellowAnimation == true) {
    g_yellowAngle = 16 * Math.sin(g_seconds);
  }
  // ears
  if (g_earAnimation == true) {
    g_earRotate = 6 * Math.sin(g_seconds) - 20;
  }
  if (g_middleAnimation == true) {
    g_middleRotate = 5 * Math.sin(g_seconds);
  }
  if (!g_shiftKeyActivated) {
    g_hatSpin = 90 * Math.sin(g_seconds);
  }
  // autoLight
  if( g_yellowAnimation == true) {
  g_lightPos[0] = Math.sin(g_seconds);
  }
}

// canvas stuff
function convertCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

// map function here:
var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

// function to draw the map
function drawMap() {
  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      if (g_map[y][x] == 1) {
        var bar1 = new Cube();
        bar1.color = [1, 0, 0, 1];
        bar1.matrix.translate(x-4, -.75, y-4);
        bar1.render();
        var bar2 = new Cube();
        bar2.color = [1, 0, 0, 1];
        bar2.matrix.translate(x-4, 1, y-4);
        bar2.render();
      }
    }
  }
}

// render function (the big one (big))

function renderAllShapes() {
  // track performance
  var renderStart = performance.now();
  
  // pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalAngleY, 0, 1, 0);
  globalRotMat.rotate(-g_globalAngleX, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // clear... other buffer?
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // environment setup
  // skybox
  var skybox = new Cube();
  skybox.color = [0.8, 0.8, 0.8, 1];
  skybox.textureNum = 1;
  if (g_normalOn) skybox.textureNum = -3;
  skybox.matrix.scale(-5, -5, -5);
  skybox.matrix.translate(-.5, -.5, -.5);
  skybox.render();

  // light

  // pass light to shader
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  // pass camera to shader
  gl.uniform3f(u_cameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  // pass light toggle to shader
  gl.uniform1i(u_lightToggle, g_lightToggle);

  // pass light color to shader
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  // light obj
  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.textureNum = -2;
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-.5, -.5, -.5);
  light.render();

  // floor
  var floor = new Cube();
  floor.color = [1, 0, 0, 1];
  floor.textureNum = 0;
  floor.matrix.translate(0, -1, 0);
  floor.matrix.scale(10, .01, 10);
  floor.matrix.translate(-.5, 0, -.5);
  //floor.render();

  // floor2
  var floor2 = new Cube();
  floor2.color = [1, 0, 0, 1];
  floor2.textureNum = 0;
  floor2.matrix.translate(0, 2.5, 0);
  floor2.matrix.scale(10, .01, 10);
  floor2.matrix.translate(-.5, 0, -.5);
  //floor2.render();
  // ceiling
  var ceiling = new Cube();
  ceiling.color = [1, 0, 0, 1];
  ceiling.textureNum = 2;
  ceiling.matrix.translate(0, 24.99, 0);
  ceiling.matrix.scale(50, .01, 50);
  ceiling.matrix.translate(-.5, 0, -.5);
  //ceiling.render();

  // sphere
  var sphere = new Sphere();
  sphere.color = [1.0, 1.0, 0.0, 1.0];
  sphere.textureNum = 2;
  if(g_normalOn) sphere.textureNum = -3;
  sphere.matrix.translate(1, 0, -0.5);
  sphere.matrix.scale(.5, .5, .5);
  sphere.render();

  // draw the slug
  // bottom
  var bottomseg = new Cube();
  bottomseg.color = [1.0, 1.0, 0.0, 1.0];
  bottomseg.textureNum = -2;
  bottomseg.matrix.translate(-.15, -.75, 0.0);
  var bottomCoordinatesMat = new Matrix4(bottomseg.matrix);
  bottomseg.matrix.translate(-.02, 0, 0);
  bottomseg.matrix.scale(.35, .35, .5);
  bottomseg.render();
  //neck
  var neck = new Cube();
  neck.color = [1, 1, 0, 1];
  neck.textureNum = -2;
  neck.matrix.translate(0, -.5, 0, 0);
  neck.matrix.rotate(-5, 1, 0, 0);
  // animation
  neck.matrix.rotate(g_yellowAngle, 1, 0, 0);
  // update matrix for attached limbs
  var neckCoordinatesMat = new Matrix4(neck.matrix);
  neck.matrix.scale(.25, .4, .3);
  neck.matrix.translate(-.5, 0, 0);
  neck.render();
  // head
  var head = new Cube();
  head.color = [.9, .9, 0, 1];
  head.textureNum = 0;
  head.matrix = neckCoordinatesMat;
  head.matrix.translate(0, .65, 0);
  var headCoordinatesMat = new Matrix4(head.matrix);
  head.matrix.rotate(0, 1, 0, 0);
  head.matrix.scale(.3, .3, .32);
  head.matrix.translate(-.5, -1.5, -0.001);
  head.render();
  // nose
  var nose = new Cube();
  nose.color = [.8, .8, 0, 1];
  nose.textureNum = -2;
  nose.matrix = new Matrix4(headCoordinatesMat);
  nose.matrix.rotate(-15, 1, 0, 0)
  nose.matrix.scale(.05, .05, .1);
  nose.matrix.translate(-.5, -7.5, -1.5)
  nose.render();
  // ear?? 1
  var ear1 = new Cube();
  ear1.color = [.8, .8, 0, 1];
  ear1.textureNum = -2;
  ear1.matrix = new Matrix4(headCoordinatesMat);
  ear1.matrix.rotate(g_earRotate, 1, 0, 0);
  ear1.matrix.rotate(-30, 1, 0, 0);
  ear1.matrix.translate(.05, -.3, -0.08);
  ear1.matrix.scale(.05, .3, 0.05);
  ear1.render();
  // ear?? 2
  var ear2 = new Cube();
  ear2.color = [.8, .8, 0, 1];
  ear2.textureNum = -2;
  ear2.matrix = new Matrix4(headCoordinatesMat);
  ear2.matrix.rotate(g_earRotate, 1, 0, 0);
  ear2.matrix.rotate(-30, 1, 0, 0);
  ear2.matrix.translate(-.1, -.3, -0.08);
  ear2.matrix.scale(.05, .3, 0.05);
  ear2.render();
  // segment middle
  var middle = new Cube();
  middle.color = [0.9, 0.9, 0, 1];
  middle.textureNum = -2;
  middle.matrix = bottomCoordinatesMat;
  middle.matrix.rotate(g_middleRotate, 0, 1, 0);
  middle.matrix.scale(.2, .2, .35);
  middle.matrix.translate(.78, 0, 1);
  middle.matrix.rotate(45, 0, 0, 1);
  var middleCoordinatesMat = new Matrix4(middle.matrix);
  middle.render();
  // segment tail
  var tail = new Cube();
  tail.matrix = middleCoordinatesMat;
  tail.color = [1, 1, 0, 1];
  tail.textureNum = -2;
  tail.matrix.translate(-0.09, -0.1, 1);
  var tailCoordinatesMat = new Matrix4(tail.matrix);
  tail.matrix.scale(1.3, 1.3, 1.3);
  tail.render();
  // segment tailend
  var tailend = new Cube();
  tailend.matrix = tailCoordinatesMat;
  tailend.color = [.85, .85, 0, 1];
  tailend.textureNum = -2;
  tailend.matrix.translate(0.3, 0.3, 1.1);
  tailend.matrix.scale(0.8, 0.8, 0.3);
  middle.matrix.rotate(-45, 0, 1, 0);
  tailend.render();

  // hat
  var hat = new Pyramid();
  hat.color = [1, 0, 0, 1];
  hat.textureNum = -2;
  hat.matrix = new Matrix4(headCoordinatesMat);
  hat.matrix.translate(0, -.15, .15);
  hat.matrix.scale(.3, .3, .3);
  hat.matrix.rotate(g_hatSpin, 0, 1, 0);
  hat.matrix.translate(-.5,0,-.38)
  //hat.render();

  // map
  //drawMap();

  // track performance (end)
  var duration = performance.now() - renderStart;
  sendTextToHTML("fps: " + Math.floor(10000/duration), "fps");
}

function sendTextToHTML(text, ID){
  var element = document.getElementById(ID);
  // check validity
  if (!element) {
    console.log("Failed to get " + ID + "from HTML");
    return;
  }
  // set text
  element.innerHTML = text;
}