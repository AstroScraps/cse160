// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main()
  {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

// global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the sotrage location of u_Size');
    return;
  }
}

// consts
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// globals related to UI elements
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10
let g_drunkMode = false;

// set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  // button events (clear)
  document.getElementById('clearButton').onclick = function() { g_shapesList = []; renderAllShapes(); };
  // button events (shape type)
  document.getElementById('pointButton').onclick = function() { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function() { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function() { g_selectedType = CIRCLE };
  // DRUNK DRIVER BY NIGHT
  document.getElementById('drunkToggle').onclick = function() {
    g_drunkMode = !g_drunkMode;
    // check if on or off
    // for cursor
    var truckAudio = document.getElementById("truckin");
    if(g_drunkMode == true)
    {
      document.body.style.cursor = "url('TRUCK.png'), auto";
      truckAudio.play();
    }
    else
    {
      document.body.style.cursor = "auto";
      truckAudio.pause();
      truckAudio.currentTime = 0;
    }
  };
  // color slider events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });
  // size slider events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
  document.getElementById('circleSegSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value; });
}

function main() {

  // set up canvas and GL variables
  setupWebGL();

  // set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {
  // extract event coords and convert to webGL coords
  let [x, y] = convertCoordinatesToGL(ev);

  // brush type selection
  let point;
  if (g_selectedType == POINT)
  {
    point = new Point();
  }
  else if (g_selectedType == TRIANGLE)
  {
    point = new Triangle();
  }
  else if (g_selectedType == CIRCLE)
  {
    point = new Circle();
  }
  point.position = [x, y];
  // I WONT STOP TRUCKIN
  if(g_drunkMode == true)
  {
    // BECAUSE IM ON
    let x_offset = (Math.floor(Math.random() * (4 - (-6) + 1)) + (-6)) / 100;
    let y_offset = (Math.floor(Math.random() * (5 - (-7) + 1)) + (-7)) / 100;
    point.position = [x + x_offset, -y + y_offset];
  }
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  // circle specific
  if (g_selectedType == CIRCLE)
  {
    point.segments = g_selectedSegments;
  }
  g_shapesList.push(point);

  // draw all shapes that should be on the canvas
  renderAllShapes();
}

function convertCoordinatesToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  
  return ([x, y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}