let count = 20;
let rBackground;
let gBackground;
let bBackground;
let rFlower;
let gFlower;
let bFlower;
let Jplanets;
let itms = [];
let xCollector;
let yCollector;
let radiusCenter;
let direction;
let mouseSelected;
let throwReady;
let itmNumber = 0;
let slFlowers;
let selectedItem = 1;
let stay;

function setup() {
  createCanvas(600, 600);
  
  cursor("grab");

  Jplanets = new Jplanet(width / 2, height / 2);
  rBackground = random(100, 255);
  gBackground = random(100, 255);
  bBackground = random(100, 255);

  for (let i = 0; i < count; i++) {
    itms.push(new Itm(width, height / 2));
  }

  slFlowers = new SlFlower(width / 2, height / 2);
}

function draw() {
  background(rBackground, gBackground, bBackground);

  if (itms.length < count) {
    itms.push(new Itm(width, height / 2));
  }

  for (let i = itms.length - 1; i >= 0; i--) {
    if (itms[i].isDone == true) {
      itms.splice(i, 1);
    }
  }

  slFlowers.update();
  slFlowers.display();

  Jplanets.update();
  Jplanets.speedup();
  Jplanets.display();

  mouseSelected = false;
  for (let i = 0; i < itms.length; i++) {
    itms[i].captured();
    itms[i].crazy();
    itms[i].update();
    itms[i].throw();
    itms[i].angry();
    itms[i].display();
  }
}

class Jplanet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isDone = false;

    // planet
    this.npoints = floor(random(6, 20));
    this.angle = TWO_PI / this.npoints;
    this.speed = 0.01;
    this.radius = random(150, 170);

    this.direction = [-1, 1];
    this.randomIndex1 = floor(random(this.direction.length));
    this.randomdirections = this.direction[this.randomIndex1];
    direction = this.randomdirections;

    // collector
    this.control = 1;
    radiusCenter = this.radius;

    // color
    this.r = random(127, 255);
    this.g = random(127, 255);
    this.b = random(127, 255);

    rFlower = this.r;
    gFlower = this.g;
    bFlower = this.b;
  }

  update() {}

  speedup() {
    if (keyIsPressed === true) {
      if (keyCode === SHIFT) {
        if (this.randomdirections == 1) {
          this.control -= 0.04;
        } else {
          this.control += 0.04;
        }
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    fill(0, 0, 0, 0);
    stroke(rFlower + 30, gFlower + 30, bFlower + 30);
    ellipse(0, 0, this.radius * 2.83);
    pop();

    // planet
    push();
    translate(this.x, this.y);
    rotate(frameCount * this.speed * this.randomdirections);
    fill(rFlower, gFlower, bFlower);
    noStroke();
    beginShape();
    for (let a = 0; a < TWO_PI; a += this.angle) {
      let sx = cos(a) * this.radius;
      let sy = sin(a) * this.radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    pop();

    // collector
    let a =
      frameCount * this.speed * this.randomdirections * -1 * 1.3 + this.control;
    xCollector = this.x + cos(a + radians(45)) * this.radius * 1.4;
    yCollector = this.y + sin(a + radians(45)) * this.radius * 1.4;
    push();
    translate(this.x, this.y);
    rotate(a);
    fill(rFlower, gFlower, bFlower);
    noStroke();
    beginShape();
    for (let ac = 0; ac < TWO_PI; ac += this.angle) {
      let sxc = this.radius + cos(ac) * this.radius * 0.05;
      let syc = this.radius + sin(ac) * this.radius * 0.05;
      vertex(sxc, syc);
    }
    endShape(CLOSE);
    pop();
  }
}
throwReady = false;

function mouseReleased() {
  if (mouseSelected) {
    throwReady = true;
  }
}

class Itm {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(10, 30);
    this.angle = random(360);
    this.speed = random(1, 3);

    this.x1 = width / 2 + ((cos(radians(this.angle)) * width) / 2) * 1.4;
    this.y1 = height / 2 + ((sin(radians(this.angle)) * height) / 2) * 1.4;

    this.dx = width / 2 - this.x1;
    this.dy = height / 2 - this.y1;
    this.len = dist(0, 0, this.dx, this.dy);

    this.dx = (this.speed * this.dx) / this.len;
    this.dy = (this.speed * this.dy) / this.len;

    // capture
    this.capture = false;

    // throw
    this.mouse = true;
    this.dis = false;
    this.mou = false;
    this.dmc = 1;
    this.speedt = 1;
    this.dm = 1;
    this.k = false;

    // angry
    this.radiuss = radiusCenter;
    this.red = false;

    // crazy
    this.mad = false;
  }

  captured() {
    let d = dist(this.x1, this.y1, xCollector, yCollector);
    if (d < 15) {
      this.capture = true;
      this.x1 = width / 2 + cos(radians(this.angle)) * radiusCenter;
      this.y1 = height / 2 + sin(radians(this.angle)) * radiusCenter;
      itmNumber++;
    }
  }

  angry() {
    if (itmNumber > 10 && this.capture && this.mou == false) {
      this.x1 =
        width / 2 +
        cos(radians(this.angle)) * (radiusCenter + random(2 + itmNumber - 10));
      this.y1 =
        height / 2 +
        sin(radians(this.angle)) * (radiusCenter + random(2 + itmNumber - 10));
      this.red = true;
    }
    if (itmNumber <= 10) {
      this.red = false;
    }
  }

  crazy() {
    if (itmNumber > 16) {
      this.x1 = this.x1 + this.dx * 5;
      this.y1 = this.y1 + this.dy * 5;
      this.capture = false;
    }
  }

  update() {
    if (this.capture == false) {
      this.x1 = this.x1 + this.dx;
      this.y1 = this.y1 + this.dy;
    }

    if (this.mou == false) {
      if (this.x1 < 0) {
        this.x1 = width;
      }
      if (this.x1 > width) {
        this.x1 = 0;
      }
      if (this.y1 < 0) {
        this.y1 = height;
      }
      if (this.y1 > height) {
        this.y1 = 0;
      }
    }
  }

  throw() {
    let x2 =
      width / 2 +
      cos(frameCount * 0.01 * direction + radians(this.angle)) * radiusCenter;
    let y2 =
      width / 2 +
      sin(frameCount * 0.01 * direction + radians(this.angle)) * radiusCenter;

    if (selectedItem == null) {
      this.dis = false;
    }

    this.dm = dist(mouseX, mouseY, x2, y2);

    if (this.dm < 15) {
      this.dis = true;
    }

    // this is true for more than one frame
    if (
      this.dis &&
      mouseIsPressed &&
      this.capture &&
      (selectedItem == 1 || selectedItem == this || selectedItem == null)
    ) {
      this.mouse = false;
      this.x1 = mouseX;
      this.y1 = mouseY;
      this.dis = true;
      this.mou = true;
      mouseSelected = true;
      selectedItem = this;
      cursor("grabbing");
    }
    if (mouseIsPressed && this.dis) {
      this.dmc = dist(mouseX, mouseY, width / 2, height / 2);
      this.speedt = map(this.dmc, 0, radiusCenter, 20, 0);
      if (this.speedt < 0) {
        this.speedt = 1;
      }
    }

    // this will only be true once, when we're throwing the item
    if (this.mou && throwReady && selectedItem == this) {
      this.k = true;
      this.x1 = this.x1 - this.dx * this.speedt;
      this.y1 = this.y1 - this.dy * this.speedt;
      this.dis = false;
      mouseSelected = false;
      throwReady = false;
      selectedItem = null;
      itmNumber--;
      cursor("grab");
    }

    if (this.k) {
      this.x1 = this.x1 - this.dx * this.speedt;
      this.y1 = this.y1 - this.dy * this.speedt;
    }

    if (
      this.x1 < -2 ||
      this.x1 > width + 2 ||
      this.y1 < -2 ||
      this.y1 > height + 2
    ) {
      this.isDone = true;
    }
  }

  display() {
    if (this.red) {
      push();
      fill(255, 0, 0, 10);
      noStroke();
      ellipse(width / 2, height / 2, this.radiuss);
      this.radiuss++;
      pop();
    }

    push();
    translate(width / 2, height / 2);
    if (this.capture == true && this.mouse) {
      rotate(frameCount * 0.01 * direction);
    }
    fill(255);
    noStroke();
    ellipse(this.x1 - width / 2, this.y1 - height / 2, this.radius);
    pop();
  }
}

stay = false;
function keyPressed() {
  if (key == "s") {
    slFlowers.startRotating();
    stay = true;
  }
}

class SlFlower {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.x1 = this.x;
    this.y1 = this.y;
    this.angle = random(360);

    // fruit
    this.xf = 0;
    this.yf = -65;
    this.radius = 0;
    this.grow = false;

    // bloom
    this.bloom1 = false;
    this.bloom2 = false;
    this.bloomx = 0;
    this.bloomy = -110;
    this.d = 0;

    //color
    this.r = random(180, 230);
    this.g = random(180, 230);
    this.b = random(180, 230);
    this.bloomIsDone = false;

    // rotation
    this.rotating = false;

    // grow back
    this.colorIsDone = false;
    this.growBack = false;
    this.time = 1;
  }

  update() {
    // body
    if (this.y1 > height / 2 - 100 && this.growBack == false) {
      this.y1--;
    }

    // fruit
    if (this.yf > -85) {
      this.yf--;
      this.radius++;
    } else {
      this.grow = true;
    }

    // bloom
    this.d = dist(
      mouseX,
      mouseY,
      this.x + cos(radians(this.angle - 90)) * (radiusCenter + 30),
      this.y + sin(radians(this.angle - 90)) * (radiusCenter + 30)
    );
    if (
      this.d < 20 &&
      this.grow &&
      (selectedItem == 1 || selectedItem == null)
    ) {
      this.bloom1 = true;
    }
    
    if(this.d<20){
      cursor("pointer");
    } else {
      cursor("grab");
    }

    if (this.d < 20 && mouseIsPressed && this.bloom1) {
      this.bloom2 = true;
    }
    if (this.bloom2) {
      if (this.bloomx > -20) {
        this.bloomx -= 0.5;
        this.bloomy += 0.3;
      } else {
        this.bloomIsDone = true;
      }
    }

    // change color
    if (
      this.bloomIsDone &&
      this.d < 15 &&
      mouseIsPressed &&
      (selectedItem == 1 || selectedItem == null)
    ) {
      rFlower = this.r;
      gFlower = this.g;
      bFlower = this.b;
      this.colorIsDone = true;
    }

    if (this.time < 1200) {
      if (this.colorIsDone) {
        this.time++;
      }
    } else {
      this.growBack = true;
    }

    if (this.growBack && stay == false) {
      if (this.y1 > height / 2 - 101 && this.y1 < height / 2) {
        this.y1++;
        console.log("goodbye");
      }
    }

    if (
      this.colorIsDone &&
      this.d < 15 &&
      mouseIsPressed &&
      (selectedItem == 1 || selectedItem == null)
    ) {
      if (this.r < 240 && this.g < 240 && this.b < 240) {
        this.r += 1;
        this.g += 1;
        this.b += 1;
      }
    }
  }

  startRotating() {
    if (!this.rotating) {
      this.rotating = true;
      this.startFrameCount = frameCount;
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    if (this.rotating) {
      rotate(
        radians(this.angle) +
          (frameCount - this.startFrameCount) * 0.01 * direction
      );
    } else {
      rotate(radians(this.angle));
    }
    /*
    if (key == "s" && this.bloom2) {
      rotate(frameCount * 0.01 * direction - radians(this.angle));
    }
    */

    push();
    translate(this.x1 - this.x, this.y1 - this.y);
    // body
    push();
    noStroke();
    fill(204, 140, 45);
    triangle(-10, 10, 10, 10, 0, -70);
    pop();
    // fruit
    push();
    fill(this.r, this.g, this.b);
    noStroke();
    ellipse(this.xf, this.yf, this.radius);
    pop();
    // petal
    push();
    stroke(204, 140, 45);
    strokeWeight(1);
    for (let i = 15; i > 0; i -= 2) {
      bezier(0, -70, -i * 1.3, -80, -i * 1.3, -90, this.bloomx, this.bloomy);
      bezier(0, -70, i * 1.3, -80, i * 1.3, -90, -this.bloomx, this.bloomy);
    }
    pop();
    pop();

    pop();
  }
}
