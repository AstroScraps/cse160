// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cvs');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Black canvas
  ctx.fillStyle = 'rgb(0 0 0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Fill a rectangle with the color
}

// clear canvas
function ctxclear()
{
  // Black canvas
  ctx.fillStyle = 'rgb(0 0 0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Fill a rectangle with the color
}

// draw vector function
function drawVector(v, color)
{
  // color
  ctx.strokeStyle = color;
  // find centers
  let center_x = canvas.width / 2;
  let center_y = canvas.height / 2;
  // draw
  ctx.beginPath();
  ctx.moveTo(center_x, center_y);
  ctx.lineTo(center_x + (v.elements[0] * 20), center_y + (-v.elements[1] * 20));
  ctx.stroke();
}

// handleDrawEvent draws vectors, given inputs
function handleDrawEvent(inputx, inputy, inputz, color)
{
  // set variables
  let v1x = inputx;
  let v1y = inputy;
  let v1z = inputz;
  // make vector
  let v1 = new Vector3([v1x, v1y, v1z]);
  // draw
  drawVector(v1, color)
}

// angleBetween finds angle between two
function angleBetween(v1, v2)
{
  // dot product
  let dotProduct = Vector3.dot(v1, v2);
  // magnitudes
  let magv1 = v1.magnitude();
  let magv2 = v2.magnitude();
  // put together
  let pre = dotProduct /  (magv1 * magv2)
  // arccos
  let pre2 = Math.acos(pre);
  // convert
  let angle = pre2 * (180 / Math.PI);
  // done
  return angle;
}

// operation function
function handleDrawOperationEvent()
{
  // clear
  ctxclear();
  // get the x and y for v1 and v2
  let v1x = document.getElementById('v1x').value;
  let v1y = document.getElementById('v1y').value;
  let v1z = 0;
  let v2x = document.getElementById('v2x').value;
  let v2y = document.getElementById('v2y').value;
  let v2z = 0;
  // this is gonna be a little UNOPTIMAL... but i need to make more vectors
  let v1 = new Vector3([v1x, v1y, v1z]);
  let v2 = new Vector3([v2x, v2y, v2z]);
  // draw original 2 lines
  drawVector(v1, 'red');
  drawVector(v2, 'blue')
  // op = operator
  let op = document.getElementById('operation').value;
  // check addition
  if(op == "add")
  {
    v1.add(v2);
    drawVector(v1, "green");
  }
  // check subtraction
  if(op == "subtract")
  {
    v1.sub(v2);
    drawVector(v1, "green");
  }
  // get scalar
  let scalar = document.getElementById('scalar').value;
  // check multiplication
  if(op == "multiply")
  {
    v1.mul(scalar);
    drawVector(v1, "green");
    v2.mul(scalar);
    drawVector(v2, "green");
  }
  // check division
  if(op == "divide")
  {
    v1.div(scalar);
    drawVector(v1, "green");
    v2.div(scalar);
    drawVector(v2, "green");
  }
  if(op == "magnitude")
  {
    console.log(v1.magnitude());
    console.log(v2.magnitude());
  }
  if(op == "normalize")
  {
    v1.normalize();
    drawVector(v1, "green");
    v2.normalize();
    drawVector(v2, "green");
  }
  if(op == "angle_between")
  {
    console.log("Angle: " + angleBetween(v1, v2));
  }
}