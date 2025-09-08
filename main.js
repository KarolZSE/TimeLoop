import './style.css'
import Phaser, { Scene } from 'phaser'

// Performance optimizations
const TRAIL_POOL_SIZE = 50;
const MOVEMENT_RECORD_INTERVAL = 32; // Record every 32ms instead of every frame
const TRAIL_SPAWN_INTERVAL = 5; // Spawn trails less frequently

const sizes = {
    height: 700,
    width: 1000
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

// Performance tracking
let lastMovementRecord = 0;
let frameCounter = 0;

class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
        this.video = null;
    }

    preload(){
        this.load.video("bg", "background.mp4", "loadeddata", false, true);
        this.load.image("tile", "tile.png");
    }

    create() {
        // Reduce video quality for better performance
        this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
        this.video.setDisplaySize(200, 200); // Smaller video size
        this.video.play(true);
        this.video.setDepth(-1);
        this.video.setTint(0x424242);
        this.video.setAlpha(0.7); // Reduce opacity to save rendering
        
        this.add.image(this.cameras.main.centerX - 200, this.cameras.main.centerY - 300, "tile").setOrigin(0,0).setScale(1.5);
        const Start = this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 150, 'Continue...', { 
            fontFamily: 'PressStart2P', 
            fontSize: '22px', 
            fontStyle: 'normal', 
            color: '#2d4ee0ff'
        });
        
        if (eventlevel == 0) {
            this.add.text(20, 150, "Pilot you have \na new mission! \nYour target? \nEliminate all \nof the red \nplanes. How to \ndo it? You just \nhave to cut \ntheir trail in \na specified \namount of time, \nbut be careful \nyou will lose \nif they cut \nyours. That's \nall. Be brave! \nYou know what \nthey say the \nbiggest enemy \nis your past!", { 
                fontFamily: 'PressStart2P', 
                fontSize: '19px', 
                fontStyle: 'normal', 
                color: '#d8d8d8ff'
            });
            this.add.text(700, 150, "Pilot you have \na new mission! \nYour target? \nEliminate all \nof the red \nplanes. How to \ndo it? You just \nhave to cut \ntheir trail in \na specified \namount of time, \nbut be careful \nyou will lose \nif they cut \nyours. That's \nall. Be brave! \nYou know what \nthey say the \nbiggest enemy \nis your past!", { 
                fontFamily: 'PressStart2P', 
                fontSize: '19px', 
                fontStyle: 'normal', 
                color: '#d8d8d8ff'
            });
            this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY - 200, 'TimeLoop \n Aircrafts', { 
                fontFamily: 'PressStart2P', 
                fontSize: '22px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
            this.Texto = this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY, 'Whats your \n  name?', { 
                fontFamily: 'PressStart2P', 
                fontSize: '22px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
        }
        
        if (eventlevel == 1) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Congratulations \n You survived!\n A new mission \n  awaits you!', { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#0f7929ff'
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (` You completed \n this mission \nin ${(movementData[session[session.length - 1] - 1].t - movementData[session[session.length - 2]].t).toFixed(0)} ms. So\nyou will recive \nthe same amount \n  of time for \n  this mision`), { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
        }
        
        if (eventlevel == 2) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Oh no! You died \n The enemy has\n destroyed you!', { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#c41818ff'
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (`You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`), { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, (`For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue`), { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
            eon = "Expe";
        }

        if (eventlevel == 3) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Oh no! You died \n Your time has\n    ran out!', { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#c41818ff'
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (`You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`), { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, (`For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue`), { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff'
            });
            eon = "Expe";
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
        // Optimize keyboard input handling
        if (eventlevel == 0 && this.Texto) {
            this.input.keyboard.once("keydown", (event) => {
                if (keyisdown == 0) {
                    keyisdown = 1;
                    if (event.key === 'Backspace') {
                        textInput = textInput.slice(0, -1);
                        this.Texto.setText(textInput);
                    }
                    if (/^[a-zA-Z0-9!@#$%^&*(){}\[\]:;"'<>,.?\/\\|~`+-=_]$/.test(event.key)) {
                        textInput += event.key;
                        this.Texto.setText(textInput);
                    }
                }
            });

            this.input.keyboard.once("keyup", () => {
                keyisdown = 0;
            });
        }
    }
}

class GameScene extends Phaser.Scene{
    constructor(){
        super("scene-game")
        this.player = null;
        this.enemy = null;
        this.timedEvent = null;
        this.timedEvent2 = null;
        this.remainingTime = 0;
        this.remainingTime2 = 0;
        this.badguy = null;
        this.temporary = 0;
        this.video = null;
        this.data3 = null;
        this.Home = null;
        
        // Object pools for performance
        this.trailPool = [];
        this.evilTrailPool = [];
        this.activeTrails = [];
        this.activeEvilTrails = [];
    }
    
    preload(){
        this.load.video("bg", "background.mp4", "loadeddata", false, true);
        this.enemy = this.load.image("enemy", "enemy2.png");
        this.player = this.load.image("player", "spaceship.png");
        this.spawnpoint = this.load.image("spawn", "enemy1.png");
    }

    create(){
        this.TextTimer = this.add.text(this.cameras.main.centerX - 300, 10, "Please move around (with your mouse) \n   for about 10 sec. The enemy \n     will spawn around the X. \nThis text will change in to a timer.", { 
            fontFamily: 'PressStart2P', 
            fontSize: '16px', 
            fontStyle: 'normal', 
            color: '#000000ff'
        });
        
        // Smaller, less intensive video
        this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
        this.video.setDisplaySize(200, 200);
        this.video.play(true);
        this.video.setDepth(-1);
        this.video.setAlpha(0.5); // Make it more transparent to save rendering
        
        this.player = this.physics.add.image(500, 500,"player").setOrigin(0.5,0.5).setScale(1.5); // Smaller scale
        this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(1.5);
        
        input = this.input.activePointer;
        this.timedEvent = this.time.delayedCall(10000, console.log("Initialization"), [], this);
        this.player.setCollideWorldBounds(true);
        
        this.playerSensor = this.physics.add.sprite(this.player.x, this.player.y, null).setOrigin(0.5).setSize(20, 20);
        this.playerSensor.visible = false;
        this.badguysSensors = this.physics.add.group();
        this.spawns = this.add.group();
        
        // Initialize object pools
        this.initializeTrailPools();
        
        // Performance optimizations
        this.lastPlayerX = this.player.x;
        this.lastPlayerY = this.player.y;
        this.movementThreshold = 5; // Only record movement if player moved more than 5 pixels
    }
    
    initializeTrailPools() {
        // Create trail pools to avoid constant object creation/destruction
        for (let i = 0; i < TRAIL_POOL_SIZE; i++) {
            let trail = this.add.rectangle(0, 0, 4, 4, 0x00ff00).setScale(1.5);
            trail.setVisible(false);
            this.physics.add.existing(trail);
            this.trailPool.push(trail);
            
            let evilTrail = this.add.rectangle(0, 0, 4, 4, 0xff0000).setScale(1.5);
            evilTrail.setVisible(false);
            this.physics.add.existing(evilTrail);
            this.evilTrailPool.push(evilTrail);
        }
    }
    
    getTrailFromPool() {
        let trail = this.trailPool.pop();
        if (!trail) {
            // Pool exhausted, create new one
            trail = this.add.rectangle(0, 0, 4, 4, 0x00ff00).setScale(1.5);
            this.physics.add.existing(trail);
        }
        return trail;
    }
    
    returnTrailToPool(trail) {
        trail.setVisible(false);
        trail.setAlpha(1);
        this.trailPool.push(trail);
    }
    
    getEvilTrailFromPool() {
        let trail = this.evilTrailPool.pop();
        if (!trail) {
            trail = this.add.rectangle(0, 0, 4, 4, 0xff0000).setScale(1.5);
            this.physics.add.existing(trail);
        }
        return trail;
    }
    
    returnEvilTrailToPool(trail) {
        trail.setVisible(false);
        trail.setAlpha(1);
        trail.badguy = null;
        trail.sensor = null;
        this.evilTrailPool.push(trail);
    }

    update(time, delta){
        frameCounter++;
        
        let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, input.x, input.y);
        
        // Only record movement periodically and if player moved significantly
        const playerMoved = Math.abs(this.player.x - this.lastPlayerX) > this.movementThreshold || 
                           Math.abs(this.player.y - this.lastPlayerY) > this.movementThreshold;
        
        if (time - lastMovementRecord > MOVEMENT_RECORD_INTERVAL && playerMoved) {
            movementData.push({
                t: time, 
                x: this.player.x, 
                y: this.player.y, 
                r: this.player.rotation
            });
            lastMovementRecord = time;
            this.lastPlayerX = this.player.x;
            this.lastPlayerY = this.player.y;
        }

        if (input.x !== this.lastX || input.y !== this.lastY) {
            this.player.setRotation(angle + Math.PI/2);
            this.physics.moveTo(this.player, input.x, input.y, 400); // Slightly slower movement
            this.physics.moveTo(this.playerSensor, input.x, input.y, 400);
        }
        this.lastX = input.x;
        this.lastY = input.y; 
        
        this.remainingTime = this.timedEvent.getRemainingSeconds();

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
                        this["badguy" + a].setCollideWorldBounds(true);
                    }
                    if (!this["badguySensor" + a] && this["badguy" + a].visible == true) { 
                        let sensor = this["badguySensor" + a] = this.physics.add.sprite(this["badguy" + a].x, this["badguy" + a].y, null).setOrigin(0.5).setSize(20, 20);   
                        this["badguySensor" + a].visible = false;
                        this.badguysSensors.add(sensor);
                        this["badguy" + a].setCollideWorldBounds(true);
                    }
                    if (FirstLoop == 0) {
                        temporary = 0;
                        this.Home = this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(1.5);
                        this.spawns.add(this.Home);
                        console.log(movementData[session[session.length - 1] - 1].t, movementData[session[session.length - 2]].t);
                        if (this.timedEvent2) {
                            this.timedEvent2.remove();
                        }
                        this.timedEvent2 = this.time.delayedCall(movementData[session[session.length - 1] - 1].t - movementData[session[session.length - 2]].t + 2, () => {
                            this.resetGame();
                        });
                        this.TextTimer.x = this.cameras.main.centerX - 50;
                        this["badguy" + a].body.enable = true;
                        this["badguy" + a].visible = true;
                        this["badguy" + a].x = movementData[session[a] + powtorzenia].x;
                        this["badguy" + a].y = movementData[session[a] + powtorzenia].y;
                        if (this["badguy" + a] && this["badguy" + a].visible == true) {
                            this["badguySensor" + a].setCollisionCategory(1);
                        }
                    }
                    this["badguy" + a].setRotation(movementData[session[a] + powtorzenia].r);
                    this.physics.moveTo(this["badguy" + a], movementData[session[a] + powtorzenia].x, movementData[session[a] + powtorzenia].y, 400);
                    this["badguySensor" + a].x = this["badguy" + a].x;
                    this["badguySensor" + a].y = this["badguy" + a].y;
                }
                a++;
            }
            a = 0;
            FirstLoop = 1;
            powtorzenia++;
            this.remainingTime2 = this.timedEvent2.getRemainingSeconds();
        } 
        
        if (this.remainingTime2 > 0) {
            this.TextTimer.setText(this.remainingTime2.toFixed(4));
        }
        
        // Optimized trail spawning - less frequent
        if (frameCounter % TRAIL_SPAWN_INTERVAL === 0) {
            this.spawnPlayerTrail();
            this.spawnEnemyTrails();
        }
    }
    
    spawnPlayerTrail() {
        let trail = this.getTrailFromPool();
        trail.setPosition(this.player.x, this.player.y);
        trail.setVisible(true);
        trail.setAlpha(1);
        
        this.activeTrails.push(trail);
        
        this.tweens.add({
            targets: trail,
            alpha: 0,
            duration: 300, // Shorter duration
            onComplete: () => {
                const index = this.activeTrails.indexOf(trail);
                if (index > -1) {
                    this.activeTrails.splice(index, 1);
                }
                this.returnTrailToPool(trail);
            }
        });
        
        // Set up collision detection for this trail
        this.physics.add.overlap(this.badguysSensors, [trail], () => {
            this.resetGame();
        }, null, this);
    }
    
    spawnEnemyTrails() {
        b = 0;
        while (this["badguy" + b]) {
            if (this["badguy" + b].body.enable == true) {
                let evilTrail = this.getEvilTrailFromPool();
                evilTrail.setPosition(this["badguy" + b].x, this["badguy" + b].y);
                evilTrail.setVisible(true);
                evilTrail.setAlpha(1);
                evilTrail.badguy = this["badguy" + b];
                evilTrail.sensor = this["badguySensor" + b];
                
                this.activeEvilTrails.push(evilTrail);

                this.tweens.add({
                    targets: evilTrail,
                    alpha: 0,
                    duration: 600, // Shorter duration
                    onComplete: () => {
                        const index = this.activeEvilTrails.indexOf(evilTrail);
                        if (index > -1) {
                            this.activeEvilTrails.splice(index, 1);
                        }
                        this.returnEvilTrailToPool(evilTrail);
                    }
                });
                
                // Set up collision for evil trail
                this.physics.add.overlap(this.playerSensor, [evilTrail], (player, trail) => {
                    if (trail.badguy && trail.badguy.body && trail.badguy.body.enable == true) {
                        this.trailTouched++;
                        trail.badguy.body.enable = false;
                        trail.sensor.setCollisionCategory(null);
                    }

                    if (this.trailTouched == session.length - 1) {
                        console.log("Player touched enemy");
                        session.push(movementData.length);
                        this.trailTouched = 0;
                        powtorzenia = 0;
                        FirstLoop = 0;
                        this.timedEvent2.remove();
                        this.timedEvent = this.time.delayedCall(500, () => {
                            console.log("Pick a boo!")
                        });
                        eventlevel = 1;
                        this.scene.launch("PauseScene");
                        this.scene.bringToTop("PauseScene");
                        this.scene.pause();
                    }
                }, null, this);
            }
            b++;
        }
        if (!this["badguy" + b] && this.remainingTime <= 0) {
            b = 0;
        }
    }
    
    resetGame() {
        movementData.length = session[1];
        console.log("I work again!");
        temp = 1;
        this.trailTouched = 0;
        powtorzenia = 0;
        FirstLoop = 0;
        
        // Clean up active trails
        this.activeTrails.forEach(trail => this.returnTrailToPool(trail));
        this.activeEvilTrails.forEach(trail => this.returnEvilTrailToPool(trail));
        this.activeTrails = [];
        this.activeEvilTrails = [];
        
        for (let c = 1; c < session.length; c++) {
            console.log("Plane", c);
            if (this["badguySensor" + c]) {
                this["badguy" + c].body.enable = false;
                this["badguySensor" + c].visible = false;
                this["badguySensor" + c].setCollisionCategory(null);
                this["badguy" + c].visible = false; 
            }
        }
        s1 = session.length;
        session.length = 2;
        if (temporary == 0) {
            temporary = 1;
            if (this.spawns) {
                this.spawns.clear(true, true);
            }
            eventlevel = 3;
            if (typeof DatabaseCall !== 'undefined') {
                DatabaseCall(1, textInput, s1 - 1, eon);
            }
            this.timedEvent2.remove();
            this.scene.launch("PauseScene");
            this.scene.bringToTop("PauseScene");
            this.scene.pause();
            this.timedEvent = this.time.delayedCall(500, () => {
                console.log("Pick a boo!")
            });
        }
    }
}

// Use CANVAS renderer for better VM compatibility
const config = {
    type: Phaser.CANVAS, // Changed from WEBGL to CANVAS for VM compatibility
    height: sizes.height,
    width: sizes.width,
    canvas: gameCanvas,
    scene: [PauseScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    // Performance optimizations
    fps: {
        target: 30,
        forceSetTimeOut: true
    },
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    }
}

const game = new Phaser.Game(config)