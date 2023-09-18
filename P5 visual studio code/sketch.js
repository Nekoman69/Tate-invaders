let playerX = 0;
let playerY = 0;
let img;

let lasers = [];
let myAliens = [];
let invaderLives = 3; // spillerens mængde af liv bliver defineret her.
let lastShotTime = 1; // tiden af det sidste skud der blev skudt

function preload() {
  img = loadImage('Tate.png');
  img2 = loadImage('what color is your bugatti.png');
  img3 = loadImage('background.png');
  
}


function setup() {
  createCanvas(400, 400);
  playerY = height - 20;
  playerX = width / 2;
  rectMode(CENTER);

  for (let i = 0; i < 3; i++) {//her bliver aliens skubbet ned, samt mængden af aliens bliver defineret.
    for (let j = 0; j < 12; j++) {
      myAliens.push(new Alien(20 + 30 * j, 50 + 50 * i));
    }
  }
}

function draw() {
  background(0);
  image(img3, 0, 0, 400, 400)
  

  // I denne kode bliver der tjekket for kollision mellem lasere og aliens.
  for (let i = lasers.length - 1; i >= 0; i--) {
    let laser = lasers[i];
    for (let j = myAliens.length - 1; j >= 0; j--) {
      let alien = myAliens[j];

      if (
        laser.x + 5 > alien.x - 10 &&
        laser.x - 5 < alien.x + 10 &&
        laser.y + 10 > alien.y - 10 &&
        laser.y - 10 < alien.y + 10
      ) {
        if (!laser.firedByAlien) {
          lasers.splice(i, 1);
          myAliens.splice(j, 1);
          break;
        }
      }
    }
  }

  // her bliver der checket for kollision mellem spilleren og de lasere der er blevet skudt af aliens
  for (let i = lasers.length - 1; i >= 0; i--) {
    let laser = lasers[i];

    if (
      laser.x + 5 > playerX &&
      laser.x - 5 < playerX + 50 &&
      laser.y + 10 > playerY
    ) {
      if (laser.firedByAlien) {
        lasers.splice(i, 1);
        playerHit();
      }
    }
  }

  // her bliver aliens tegnet op på canvas, handleshooting bliver sat op her.
  for (let i = 0; i < myAliens.length; i++) {
    myAliens[i].draw();
    myAliens[i].handleShooting(playerX, playerY);
  }

  // laseren becæger sig og bliver tegnet
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].move();
    if (lasers[i].y > height) {
      lasers.splice(i, 1);
    }
  }

  // spillerens bevægelse bliver defineret her.
  if (keyIsDown(LEFT_ARROW)) {
    playerX -= 5;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    playerX += 5;
  }

  // her bliver spilleren tegnet (invader)
  image(img2,playerX, playerY-20, 50,50);

  // her bliver spillerens skud sat ned til at den kun kan skydee en gang i sekundet
  if (keyIsDown(SHIFT) && millis() - lastShotTime > 1000) {
    lastShotTime = millis();
    lasers.push(new Laser(playerX, playerY - 10, false));
  }

  // spillerens liv bliver lavet her
  for (let i = 0; i < invaderLives; i++) {
    fill(255, 0, 0);
    ellipse(30 + i * 40, 30, 20);
  }

  // check efter game over
  if (myAliens.length === 0 || invaderLives === 0) {
    gameOver();
  }
}

function gameOver() {
  textSize(32);
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  if (myAliens.length === 0) {
    text("You Win!", width / 2, height / 2);//hvis der er 0 aliens tilbage bliver der displayed (you win)
  } else {
    text("Game Over", width / 2, height / 2);//hvis spilleren løber tør for liv bliver der displayet (game over)
  }
  noLoop(); // Stop spillet
}

function playerHit() {
  invaderLives -= 1;
  if (invaderLives === 0) {
    gameOver();
  }
}

class Laser {
  constructor(x, y, firedByAlien) {//en class for lasere skudt af aliens bliver lavet her
    this.x = x;
    this.y = y;
    this.firedByAlien = firedByAlien || false;
    this.velocityY = firedByAlien ? 2 : -10;//fart af laseren bliver defineret her, både for spilleren og aliens
  }

  move() {
    this.y += this.velocityY; // juster hastigheden
    fill(255, 0, 0);
    noStroke();
    rect(this.x, this.y, 10, 20);
  }
}

class Alien {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = 1;
    this.lastShotTime = random(5000);
    this.canShoot = random() < 0.3; // her kan man justere sansynligheden for at aliens skyder
  }

  draw() {
    this.x += this.dx;//i denne kode bliver pladsen for aliens kan spawne valgt, i stedet for at der spawnes en af gangen bliver de alle spawnet af koden som en individuel alien.

    if (this.x < 5) {
      this.dx = 1;
      this.y += 20;
    }
    if (this.x > width - 5) {
      this.dx = -1;
      this.y += 20;
    } 

    image(img, this.x, this.y, 25, 25);
  }

  handleShooting(playerX, playerY) {
    // denne kode gør sådan så aliensne skyder 
    if (millis() - this.lastShotTime > 2000 && this.canShoot) {
      this.lastShotTime = millis();
      const angle = atan2(playerY - this.y, playerX - this.x);
      const velocityX = cos(angle) * 2;
      const velocityY = sin(angle) * 2; 
      lasers.push(new Laser(this.x, this.y + 10, true, velocityX, velocityY));
    }
  }
}