/*
An attempt at Chaikin curves
*/


let radii = [];

var settings = {
  vertices: 5,
  max_verts: 20,
  res: 3
  // first_ratio:0.25,
  // last_ratio:0.75
};

function gui() {
  var g = new dat.GUI();
  g.add(settings, "vertices", 3, settings.max_verts).step(1);
  g.add(settings, "res", 1, 6).step(1);
}

gui();

function chaikin(p, qd = 0.25, rd = 0.75) {
  let control_points = [];
  for (let i = 0; i < p.length; i++) {
    let j = (i + 1) % p.length;
    let sp = p[i];
    let ep = p[j];
    let dx = ep.x - sp.x;
    let dy = ep.y - sp.y;
    let q = { x: sp.x + dx * qd, y: sp.y + dy * qd };
    let r = { x: sp.x + dx * rd, y: sp.y + dy * rd };

    control_points.push({ sp: sp, qp: q, rp: r, ep: ep });
  }
  let new_polygon = [];
  for (edge of control_points) {
    new_polygon.push(edge.qp);
    new_polygon.push(edge.rp);
  }
  // console.log("chaikin executed");
  return new_polygon;
}

function chaikin2(p, n) {
  let np = p;
  for (let i = 0; i < n; i++) {
    np = chaikin(np, settings.first_ratio, settings.last_ratio);
  }
  return np;
}

function setup() {
  createCanvas(400, 400);
  // colorMode(HSB, 360, 100, 100);
  background(255, 247, 230);

  //create array of random radii
  for (let i = 0; i < settings.max_verts; i++) {
    radii.push(random() * (width / 2 - width / 3) + width / 3);
  }
}

function draw() {
  background(255, 247, 230);
  let a = 0;
  let s = settings.vertices;
  let polygon = [];
  for (let i = 0; i < s; i++) {
    let x = width / 2 + radii[i] * Math.cos(a);
    let y = height / 2 + radii[i] * Math.sin(a);
    polygon.push({ x: x, y: y });
    a += TWO_PI / s;
  }

 

  let chai = chaikin2(polygon, settings.res);

  //draw control polygon
  stroke(255,0,0);
  strokeWeight(1);
  for (let i = 0; i < polygon.length; i++) {
    let j = (i + 1) % polygon.length;
    line(polygon[i].x, polygon[i].y, polygon[j].x, polygon[j].y);
  }

  //draw curve
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < chai.length; i++) {
    let j = (i + 1) % chai.length;
    line(chai[i].x, chai[i].y, chai[j].x, chai[j].y);
  }

  noLoop();
  
 
}
