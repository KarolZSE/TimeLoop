import "/style.css"
import __vite__cjsImport1_phaser from "/node_modules/.vite/deps/phaser.js?v=8fda692c";
const Phaser = __vite__cjsImport1_phaser.__esModule ? __vite__cjsImport1_phaser.default : __vite__cjsImport1_phaser;
const Scene = __vite__cjsImport1_phaser["Scene"]

// https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3

const sizes = {
    height: 700,
    width: 1300
}

var Timon = Date.now();
var input;
var movementData = [];
var session = 0;
var licznica = 0;
var liczba = 0;
var badguy = [];
var tempo = 0;
class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
    }

    create() {
        this.input.keyboard.once("keydown", () => {
            console.log("key pressed");
            this.scene.resume("scene-game");
            this.scene.stop();
        }
        )
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game")
        this.player
        this.enemy
        this.cursor
        this.playerSpeed = 100
        this.timedEvent
        this.remainingTime
        this.badguy
        this.licznica = 0;
    }
    preload() {
        this.load.image("bg", "background.png")
        this.enemy = this.load.image("enemy", "enemy2.png")
        this.player = this.load.image("player", "spaceship.png")
    }

    create() {
        this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(0.25);
        this.player = this.physics.add.image(500, 500, "player").setOrigin(0.5, 0.5).setScale(2);
        this.player.setCollideWorldBounds(false)
        this.enemy = this.physics.add.image(100, sizes.height - 100, "enemy").setOrigin(0.5, 0.5).setScale(2);
        input = this.input.activePointer;
        this.timedEvent = this.time.delayedCall(3000, console.log("Initalation"), [], this)
        this.playerSensor = this.physics.add.sprite(this.player.x, this.player.y, null).setOrigin(0.5).setSize(20, 20);
        this.playerSensor.visible = false;
        this.enemySensor = this.physics.add.sprite(this.enemy.x, this.enemy.y, null).setOrigin(0.5).setSize(20, 20);
        this.enemySensor.visible = false;
        this["badguy" + 0] = this.physics.add.image(1020, sizes.height - 100, "enemy").setOrigin(0.5, 0.5).setScale(2);
        this["badguy" + 1] = this.physics.add.image(1020, sizes.height - 100, "enemy").setOrigin(0.5, 0.5).setScale(2);
    }
    update(time, delta) {
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, input.x, input.y);
        // player will come back on the other side if he goes out of the screen
        this.physics.world.wrap(this.player, 32);
        //rotation cannon
        if (input.x !== this.lastX || input.y !== this.lastY) {
            this.player.setRotation(angle + Math.PI / 2);
            this.physics.moveTo(this.player, input.x, input.y, 500);
            this.physics.moveTo(this.playerSensor, input.x, input.y, 500);
            movementData.push({
                s: session,
                time: time,
                x: this.player.x,
                y: this.player.y,
                r: this.player.rotation
            });
            // console.log(movementData);
        }
        ;
        this.lastX = input.x;
        this.lastY = input.y;

        this.remainingTime = this.timedEvent.getRemainingSeconds()
        // console.log(this.remainingTime)

        if (4 <= this.remainingTime <= 5) {
            if (tempo = 1) {
                tempo = 1;
                session++;
            }
        }

        // if (this.remainingTime == 0) {
            // this.scene.launch("PauseScene");
            // this.scene.pause();
        const replay = () => {
            if (licznica >= movementData.length) return;
            if (movementData[licznica].s == 0) {
                this.physics.moveTo(this["badguy" + licznica], movementData[licznica].x, movementData[licznica].y, 500);
                // this.physics.moveTo(this.enemySensor, movementData[licznik].x, movementData[licznik].y, 500);
                this["badguy" + licznica].setRotation(movementData[licznica].r);

                const distance = Phaser.Math.Distance.Between(badguy.x, badguy.y, movementData[licznica].x, movementData[licznica].y);
                const duration = (distance / 500) * 1000;

                this.time.delayedCall(duration, () => {
                    licznica++;
                    replay();
                });
            }

            if (movementData[licznica].s == 1) {
                this.physics.moveTo(this["badguy" + licznica], movementData[licznica].x, movementData[licznica].y, 500);
                // this.physics.moveTo(this.enemySensor, movementData[licznik].x, movementData[licznik].y, 500);
                this["badguy" + licznica].setRotation(movementData[licznica].r);
                licznica += 1;
            }
        }

        if (time % 15 < delta) {
            this.trails = this.physics.add.group();

            let trail = this.add.rectangle(this.player.x + 0, this.player.y, 4, 4, 0x00ff00 // 0xff0000  
            ).setScale(2);

            this.tweens.add({
                targets: trail,
                alpha: 0,
                duration: 1000,
                onComplete: () => trail.destroy()
            });

            this.physics.add.existing(trail);
            this.trails.add(trail);
            this.physics.add.overlap(this.enemySensor, this.trails, (enemy, evil_trail) => {
                console.log("Enemy touched player");
                this.player.destroy();
            }
            , null, this);

            this.evil_trails = this.physics.add.group();

            let evil_trail = this.add.rectangle(this.enemy.x + 0, this.enemy.y, 4, 4, 0xff0000).setScale(2);
            this.physics.add.existing(evil_trail);
            this.evil_trails.add(evil_trail);

            this.physics.add.overlap(this.playerSensor, this.evil_trails, (player, trail) => {
                console.log("Player touched enemy");
                session.push(movementData.length);
                this.enemy.destroy();
            }
            , null, this);

            this.tweens.add({
                targets: evil_trail,
                alpha: 0,
                duration: 1000,
                onComplete: () => evil_trail.destroy()
            });
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    height: sizes.height,
    width: sizes.width,
    canvas: gameCanvas,
    scene: [GameScene, PauseScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            }
        }
    }
}
const game = new Phaser.Game(config)