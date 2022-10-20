
/*
** Chaikin Curves
* Camilo Cruz Gambardella, October 2022
* Example based on the blogpost by Steve Marx.
* https://smarx.com/posts/2020/08/chaikin-curves-a-beautifully-simple-algorithm/
* 
* Chaikin's "corner-cutting" algorithm is a simple way to smooth out jagged poly-
* lines or paths.
*
* How it works:
* For each pair of neighbouting vertices A and B in a path:
*   - Define point C located 25% of the way between A and B
*   - Define point D located 75% of the way between A and B
*   - Form a new path by connecting all the C and D points
* Iterate over these steps to increase smoothness.
*
*
* 
*/

var settings = {
  vertices: 5,
  max_verts: 20,
  res: 3
  // first_ratio:0.25,
  // last_ratio:0.75
};

function gui() {
  var g = new dat.GUI();
  g.width = 150;
  g.add(settings, "vertices", 3, settings.max_verts).step(1);
  g.add(settings, "res", 1, 6).step(1);
}



// GENERATIVE FUNCTIONS

// Chaikin curve function
function chaikin(points) {

  // let control_points = [];
  let new_polygon = [];
  for (let i = 0; i < points.length; i++) {
    // get index for next vertex
    let j = (i + 1) % points.length;

    // get vertices A and B
    let a = points[i];
    let b = points[j];

    // measure distance between A and B
    let dist_x = b.x - a.x;
    let dist_y = b.y - a.y;

    // define vertives C and D
    let c = { x: a.x + dist_x * .25, y: a.y + dist_y * .25 };
    let d = { x: a.x + dist_x * .75, y: a.y + dist_y * .75 };

    new_polygon.push(c);
    new_polygon.push(d);
    // control_points.push({ sp: a, qp: c, rp: d, ep: b });
  }
  

  return new_polygon;
}

// iterative chaikin function
// resolution determines the number of iterations
function chaikin2(polygon, resolution) {
  let np = polygon;
  for (let i = 0; i < resolution; i++) {
    np = chaikin(np);
  }
  return np;
}

// global variables
let radii = []; // an array to store the positions of the polygon's vertices

// start the gui
gui();

function setup() {
  createCanvas(400, 400);
  background(255, 247, 230);

  // polygon generated using polar coordinates
  // radii stores the distance between each vertex and the centre of the canvas
  for (let i = 0; i < settings.max_verts; i++) {
    radii.push(random() * (width / 2 - width / 3) + width / 3);
  }
}

function draw() {

  // refresh background
  background(255, 247, 230);

  // create vertices
  let a = 0; // angle of first vertex
  let s = settings.vertices; // number of vertices
  let polygon = []; // array to contain polygon vertices

  // create polygon
  for (let i = 0; i < s; i++) {
    let x = width / 2 + radii[i] * Math.cos(a);
    let y = height / 2 + radii[i] * Math.sin(a);
    polygon.push({ x: x, y: y });
    a += TWO_PI / s; // update angle
  }

  // create smooth polygon
  let chai = chaikin2(polygon, settings.res);

  //draw control polygon
  stroke(255,0,0);
  strokeWeight(1);
  for (let i = 0; i < polygon.length; i++) {
    let j = (i + 1) % polygon.length;
    line(polygon[i].x, polygon[i].y, polygon[j].x, polygon[j].y);
  }

  //draw smooth polygon
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < chai.length; i++) {
    let j = (i + 1) % chai.length;
    line(chai[i].x, chai[i].y, chai[j].x, chai[j].y);
  }

  // noLoop();
  
 
}
