import './style.css'
import Phaser, { Scene } from 'phaser'


const sizes = {
    height:600,
    width:800
}

var input;
var movementData = [];
var session = [0];
var powtorzenia = 0;
var n = 0;
var a = 0;
var temp = 0;
var b = 0;
var FirstLoop = 0;
var c = 1;
var temporary = 0;
let textInput = "";
let keyisdown = 0;
let first_time = 0;
let eventlevel = 0;
var s1 = 0;
var eon = "Stable";
// Performance: throttle movementData sampling
const MOVEMENT_SAMPLE_INTERVAL = 30; // ms
let lastMovementSampleTime = 0;

class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
        // this.video // removed for performance
    }

    preload(){
        this.load.image("tile", "tile.png")
    }

    create() {
        this.add.image(this.cameras.main.centerX - 200, this.cameras.main.centerY - 300, "tile").setOrigin(0,0).setScale(1.2);
        const Start = this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 150, 'Continue...', { fontFamily: 'PressStart2P', fontSize: '18px', color: '#2d4ee0ff'});
        if (eventlevel == 0) {
            this.Texto = this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY, 'Whats your name?', { fontFamily: 'PressStart2P', fontSize: '18px', color: '#000000ff'});
        }
        if (eventlevel == 1) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Congratulations! New mission awaits!', { fontFamily: 'PressStart2P', fontSize: '14px', color: '#0f7929ff'});
        }
        if (eventlevel == 2) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'You died! The enemy destroyed you!', { fontFamily: 'PressStart2P', fontSize: '14px', color: '#c41818ff'});
        }
        if (eventlevel == 3) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'You died! Time ran out!', { fontFamily: 'PressStart2P', fontSize: '14px', color: '#c41818ff'});
        }
        Start.setInteractive();
        Start.on('pointerdown', () => {
            if (first_time == 0) {
                first_time = 1;
                this.scene.launch("scene-game");
            }
            this.scene.resume("scene-game");
            this.scene.stop();
        })
    }
    update() {
        this.input.keyboard.once("keydown", (event) => {
            if (keyisdown == 0) {
                keyisdown = 1;
                if (event.key === 'Backspace') {
                    textInput = textInput.slice(0, -1);
                    if (this.Texto) this.Texto.setText(textInput);
                }
                if (/^[a-zA-Z0-9]$/.test(event.key)) {
                    textInput += event.key;
                    if (this.Texto) this.Texto.setText(textInput);
                }
            }
        });
        this.input.keyboard.once("keyup", () => {
            keyisdown = 0 
        });
    }
}

class GameScene extends Phaser.Scene{
    constructor(){
        super("scene-game")
        this.player
        this.enemy
        this.timedEvent
        this.timedEvent2
        this.remainingTime
        this.remainingTime2
        this.badguy
        this.temporary = 0
        this.video
        this.data3
        this.Home
        // Performance: cache groups
        this.trails = null;
        this.evil_trails = null;
    }
    preload(){
        this.enemy = this.load.image("enemy", "enemy2.png")
        this.player = this.load.image("player", "spaceship.png")
        this.spawnpoint = this.load.image("spawn", "enemy1.png")
    }
    create(){
        this.TextTimer = this.add.text(this.cameras.main.centerX - 200, 10, "Move mouse for 10 sec. Enemy spawns at X.", { fontFamily: 'PressStart2P', fontSize: '12px', color: '#000000ff'});
        this.player = this.physics.add.image(400, 400,"player").setOrigin(0.5,0.5).setScale(1.5);
        this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(1.5);
        input = this.input.activePointer;
        this.timedEvent = this.time.delayedCall(10000, () => {}, [], this)
        this.player.setCollideWorldBounds(true)
        this.playerSensor = this.physics.add.sprite(this.player.x, this.player.y, null).setOrigin(0.5).setSize(16, 16);
        this.playerSensor.visible = false;
        this.badguysSensors = this.physics.add.group();
        this.spawns = this.add.group();
        this.trails = this.physics.add.group();
        this.evil_trails = this.physics.add.group();
    }
    update(time, delta){
        let angle=Phaser.Math.Angle.Between(this.player.x,this.player.y,input.x,input.y);
        // Performance: throttle movementData sampling
        if (!this.lastMovementSampleTime) this.lastMovementSampleTime = time;
        if (time - this.lastMovementSampleTime >= MOVEMENT_SAMPLE_INTERVAL) {
            movementData.push({
                t: time, 
                x: this.player.x, 
                y: this.player.y, 
                r: this.player.rotation
            });
            this.lastMovementSampleTime = time;
        }
        // player will come back on the other side if he goes out of the screen
        //rotation cannon
        if (input.x !== this.lastX || input.y !== this.lastY) {
            this.player.setRotation(angle+Math.PI/2);
            this.physics.moveTo(this.player,input.x,input.y,400);
            this.physics.moveTo(this.playerSensor,input.x,input.y,400);
        }
        this.lastX = input.x;
        this.lastY = input.y; 
        this.remainingTime = this.timedEvent.getRemainingSeconds()
        // console.log(this.remainingTime.toFixed(2))

        /*
        if (this.remainingTime < 10.03 && this.remainingTime > 10.01) {
            session.push(movementData.length);
        }
        */
        if (this.remainingTime <= 0) {
            if (temp == 0) {
                session.push(movementData.length);
                temp = 1;
                this.trailTouched = 0;
            }

            while (a < session.length) {
                if (session[a] + powtorzenia < session[a + 1]) {
                    if (!this["badguy" + a]) {
                        this["badguy" + a] = this.physics.add.image(movementData[session[a] + powtorzenia].x, movementData[session[a] + powtorzenia].y,"enemy").setOrigin(0.5,0.5).setScale(1.5);
                        this["badguy" + a].setCollideWorldBounds(true)
                    }
                    if (!this["badguySensor" + a] && this["badguy" + a].visible == true) { 
                        let sensor = this["badguySensor" + a] = this.physics.add.sprite(this["badguy" + a].x, this["badguy" + a].y, null).setOrigin(0.5).setSize(16, 16);   
                        this["badguySensor" + a].visible = false;
                        this.badguysSensors.add(sensor);
                        this["badguy" + a].setCollideWorldBounds(true)
                    }
                    if (FirstLoop == 0) {
                        temporary = 0;
                        this.Home = this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(1.5);
                        this.spawns.add(this.Home);
                        if (this.timedEvent2) {
                            this.timedEvent2.remove();
                        }
                        this.timedEvent2 = this.time.delayedCall(movementData[session[session.length - 1] - 1].t - movementData[session[session.length - 2]].t + 2, () => {
                            movementData.length = session[1];
                            temp = 1;
                            this.trailTouched = 0;
                            powtorzenia = 0;
                            FirstLoop = 0;
                            for (let c = 1; c < session.length; c++) {
                                if (this["badguySensor" + c]) {
                                    this["badguy" + c].body.enable = false;
                                    this["badguySensor" + c].visible = false;
                                    this["badguySensor" + c].setCollisionCategory(null);
                                    this["badguy" + c].visible = false; 
                                }
                            }
                            s1 = session.length
                            session.length = 2;
                            if (temporary == 0) {
                                temporary = 1
                                if (this.spawns) {
                                    this.spawns.clear(true, true);
                                }
                                eventlevel = 3
                                DatabaseCall(1, textInput, s1 - 1, eon);
                                this.timedEvent2.remove();
                                this.scene.launch("PauseScene");
                                this.scene.bringToTop("PauseScene");
                                this.scene.pause();
                                this.timedEvent = this.time.delayedCall(500, () => {})
                            }
                        })
                        this.TextTimer.x = this.cameras.main.centerX - 50;
                        this["badguy" + a].body.enable = true;
                        this["badguy" + a].visible = true;
                        this["badguy" + a].x = movementData[session[a] + powtorzenia].x
                        this["badguy" + a].y = movementData[session[a] + powtorzenia].y
                        if (this["badguy" + a] && this["badguy" + a].visible == true) {
                            this["badguySensor" + a].setCollisionCategory(1)
                        }
                    }
                    this["badguy" + a].setRotation(movementData[session[a] + powtorzenia].r);
                    this.physics.moveTo(this["badguy" + a], movementData[session[a] + powtorzenia].x, movementData[session[a] + powtorzenia].y, 400);
                    this["badguySensor" + a].x = this["badguy" + a].x
                    this["badguySensor" + a].y = this["badguy" + a].y
                }
                a++;
            }
            a = 0;
            FirstLoop = 1;
            powtorzenia++;
            this.remainingTime2 = this.timedEvent2.getRemainingSeconds();
        } 
        if (this.remainingTime2 > 0) {
            this.TextTimer.setText(this.remainingTime2.toFixed(2));
        }
        if (time % 20 < delta) {
            if (this.trails.getLength() > 50) {
                let oldest = this.trails.getFirstAlive();
                if (oldest) oldest.destroy();
            }
            let trail = this.add.rectangle(
                this.player.x,
                this.player.y,
                2,
                2,
                0x00ff00
            ).setScale(1.2);
            this.tweens.add({
                targets:trail,
                alpha: 0,
                duration: 200,
                onComplete: () => trail.destroy()
            });
            this.physics.add.existing(trail);
            this.trails.add(trail);
            this.physics.add.overlap(this.badguysSensors, this.trails, () => {
                movementData.length = session[1];
                temp = 1;
                this.trailTouched = 0;
                powtorzenia = 0;
                FirstLoop = 0;
                for (let c = 1; c < session.length; c++) {
                    if (this["badguySensor" + c]) {
                        this["badguy" + c].body.enable = false;
                        this["badguySensor" + c].visible = false;
                        this["badguySensor" + c].setCollisionCategory(null);
                        this["badguy" + c].visible = false; 
                    }
                }
                s1 = session.length
                session.length = 2;
                if (temporary == 0) {
                    temporary = 1
                    if (this.spawns) {
                        this.spawns.clear(true, true);
                    }
                    this.timedEvent2.remove();
                    eventlevel = 2;
                    DatabaseCall(1, textInput, s1 - 1, eon);
                    this.scene.launch("PauseScene");
                    this.scene.bringToTop("PauseScene");
                    this.scene.pause();
                    this.timedEvent = this.time.delayedCall(500, () => {})
                }
            }, null, this);
            while (this["badguy" + b]) {
                if (this["badguy" + b].body.enable == true) {
                    if (this.evil_trails.getLength() > 50) {
                        let oldest = this.evil_trails.getFirstAlive();
                        if (oldest) oldest.destroy();
                    }
                    let evil_trail = this.add.rectangle(
                        this["badguy" + b].x, 
                        this["badguy" + b].y,
                        2,
                        2,
                        0xff0000  
                    ).setScale(1.2);
                    this.physics.add.existing(evil_trail);
                    evil_trail.badguy = this["badguy" + b];
                    evil_trail.sensor = this["badguySensor" + b];
                    this.evil_trails.add(evil_trail);
                    this.tweens.add({
                        targets:evil_trail,
                        alpha: 0,
                        duration: 400,
                        onComplete: () => evil_trail.destroy()
                    });
                }
                b++;
            };
            if (!this["badguy" + b] && this.remainingTime <= 0) {
                b = 0
            }
            this.physics.add.overlap(this.playerSensor, this.evil_trails, (player, trail) => {
                if (trail.badguy && trail.badguy.body) {
                    if (trail.badguy.body.enable == true) {
                        this.trailTouched++;
                        trail.badguy.body.enable = false;
                        trail.sensor.setCollisionCategory(null)
                    }
                }
                if (this.trailTouched == session.length - 1) {
                    session.push(movementData.length);
                    this.trailTouched = 0;
                    powtorzenia = 0;
                    FirstLoop = 0;
                    this.timedEvent2.remove();
                    this.timedEvent = this.time.delayedCall(500, () => {})
                    eventlevel = 1;
                    this.scene.launch("PauseScene");
                    this.scene.bringToTop("PauseScene");
                    this.scene.pause();
                }
            }, null, this);
        }
    }
}

const config = {
    type:Phaser.WEBGL,
    height:sizes.height,
    width:sizes.width,
    canvas:gameCanvas,
    scene:[PauseScene, GameScene],
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},
            fps: 30
        }
    }
}
const game = new Phaser.Game(config)
