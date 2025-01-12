import "./style.css";
import Phaser, { RIGHT } from "phaser";

// RESPONSIVENESS: make a sizes object
const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target;
    this.points = 0; //for collisions
    this.textScore;
    this.timedEvent;
    this.remainingTime;
  }

  preload() {
    //backgound image
    this.load.image("bg", "/assets/bg.png");
    //basket image
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }
  create() {
    //references bg image
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    //this.add.image(x,y position), setOrigin(point of reference)
    this.player = this.physics.add // adds physics to player
      .image(sizes.width / 2 - 50, 400, "basket")
      .setOrigin(0, 0); // ^ makes this the player cnotrolled element
    this.player.depth = 100; // z-index
    this.player.setImmovable(true); //makes the player not affected by other sprites
    this.player.body.allowGravity = false; // stops the player from falling
    this.player.setCollideWorldBounds(true); // stops the player from going out of the screen
    this.player
      .setSize((this.playerWidth * 3) / 4, this.player.height / 6)
      .setOffset(this.player.width / 10, (this.player.height * 9) / 10); // sets hitbox;

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown); // sets max horizontal and vertical velocity

    this.physics.add.overlap(
      this.player,
      this.target,
      this.targetHit,
      null,
      this
    ); // checks for overlap between player and target

    this.cursor = this.input.keyboard.createCursorKeys(); //creates a cursor object
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#090a1f",
    });
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#090a1f",
    });
  }
  // runs continuously
  update() {
    const { left, right } = this.cursor; // destructures the cursor object to only move left right
    // pressing left and right settings
    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    //makes apple reset height
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }
  }
  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 20));
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText("Score: " + this.points);
  }

  gameOver() {
    console.log("GAME OVAAA");
  }
}

const config = {
  type: Phaser.WEBGL,
  /*dimension of your game window*/
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas /*id of your canvas*/,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  /* scene is the main game class */
  scene: [GameScene],
};

const game = new Phaser.Game(config);
