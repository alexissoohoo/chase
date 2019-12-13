let backgroundImage;

function preload() {
  backgroundImage = loadImage(
    "https://cdn.shopify.com/s/files/1/0024/2810/8869/products/white-marble-1_800x.png?v=1570991560"
  );
}

const progressBar = document.querySelector("progress");

let scarecrowActive = 0;
let mouse = 1;
let teleportation = 1;

function randomColor() {
  const red = Math.floor(Math.random() * 20);
  const green = Math.floor(Math.random() * 30);
  const blue = Math.floor(Math.random() * 200);
  return `rgba(${red},${green},${blue},0.5)`;
}

class Sprite {
  constructor(x, y, color, diameter) {
    Object.assign(this, { x, y, color, diameter });
  }
  get radius() {
    return this.diameter / 2;
  }
}

class Player extends Sprite {
  constructor(speed) {
    super(0, 0, "white", 20);
    this.health = 100;
    this.speed = speed;
  }
  render() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }
  move() {
    this.x += this.speed * (mouseX - this.x);
    this.y += this.speed * (mouseY - this.y);
  }
  teleport() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
  }
  takeHit() {
    this.health -= 1;
    progressBar.value = this.health;
  }
}

class Enemy extends Sprite {
  constructor(x, y, speed) {
    super(x, y, randomColor(), 50);
    this.speed = speed;
  }
  render() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }
  move() {
    if (mouse) {
      this.x += this.speed * (mouseX - this.x);
      this.y += this.speed * (mouseY - this.y);
    } else {
      this.x += this.speed * (scarecrow.x - this.x);
      this.y += this.speed * (scarecrow.y - this.y);
    }
  }
}

class Scarecrow extends Sprite {
  constructor(x, y, speed) {
    super(x, y, randomColor(), 50);
    this.speed = speed;
  }
  render() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
  }
  move() {
    this.x += this.speed * (Math.random() * width - this.x);
    this.y += this.speed * (Math.random() * height - this.y);
  }
}

function collided(sprite1, sprite2) {
  const distanceBetween = Math.hypot(
    sprite1.x - sprite2.x,
    sprite1.y - sprite2.y
  );
  const sumOfRadii = sprite1.diameter / 2 + sprite2.diameter / 2;
  return distanceBetween < sumOfRadii;
}

function randomPointOnCanvas() {
  return [
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height)
  ];
}

let width = 800;
let height = 600;
let player = new Player(0.09);
let scarecrow = new Scarecrow(...randomPointOnCanvas(), 0.09);
let enemies = [
  new Enemy(...randomPointOnCanvas(), 0.05),
  new Enemy(...randomPointOnCanvas(), 0.03),
  new Enemy(...randomPointOnCanvas(), 0.01)
];

function setup() {
  createCanvas(width, height);
  noStroke();
}

function checkForDamage(enemy, player) {
  if (collided(player, enemy)) {
    player.takeHit();
  }
}

function adjustSprites() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function draw() {
  if (player.health > 0) {
    background(backgroundImage);
    player.render();
    player.move();
    if (scarecrowActive === 1) {
      scarecrow.render();
      scarecrow.move();
    }
    enemies.forEach(enemy => {
      enemy.render();
      checkForDamage(enemy, player);
      enemy.move();
    });
    adjustSprites();
  } else {
    background("red");
    textSize(32);
    text("YOU LOST!!!", height / 2, width / 2);
  }
  console.log(teleportation);
}

function mouseClicked() {
  if (scarecrowActive === 0) {
    scarecrowActive = 1;
    setTimeout(stopScarecrow, 5000);
    mouse = 0;
  }
}

function stopScarecrow() {
  scarecrowActive += 1;
  mouse = 1;
}

function keyTyped() {
  if (key === "t" && teleportation > 0) {
    console.log("wow");
    teleportation -= 1;
    player.teleport();
  }
}

