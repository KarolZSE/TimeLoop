import './style.css'
import Phaser, { Scene } from 'phaser'


// https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3
// https://www.youtube.com/watch?v=0qtg-9M3peI

const sizes = {
    height:700,
    width:1000
}

var input;
var movementData = [];
var session = [0];
var powtorzenia = 0;
var a = 0;
var temp = 0;
var b = 0;
var FirstLoop = 0;
var temporary = 0;
let textInput = "";
let keyisdown = 0;
let first_time = 0;
let eventlevel = 0;
var s1 = 0;
var eon = "Stable";
var nt = 10000;
const opponents = [];

class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
        this.video
    }

    preload(){
        this.load.video("bg", "background.mp4", "loadeddata", false, true) // Image by freepik
        this.load.image("tile", "tile.png")
    }

    create() {
        this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg")
        this.video.setDisplaySize(300, 300).setScale(3);
        this.video.play(true);
        this.video.setDepth(-1);
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            1300,
            700,
            0x424242,
            0.5 // alpha
        );
overlay.setDepth(0);
        this.add.image(this.cameras.main.centerX - 200, this.cameras.main.centerY - 300, "tile").setOrigin(0,0).setScale(1.5);
        const Start = this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 150, 'Continue...', { fontFamily: 'PressStart2P', fontSize: '22px', fontStyle: 'normal', color: '#2d4ee0ff'});
        if (eventlevel == 0) {
            this.add.text(20, 150, "Pilot you have \na new mission! \nYour target? \nEliminate all \nof the red \nplanes. How to \ndo it? You just \nhave to cut \ntheir trail in \na specified \namount of time, \nbut be careful \nyou will lose \nif they cut \nyours. That's \nall. Be brave! \nYou know what \nthey say the \nbiggest enemy \nis your past!", { fontFamily: 'PressStart2P', fontSize: '19px', fontStyle: 'normal', color: '#d8d8d8ff'});
            this.add.text(700, 150, "Pilot you have \na new mission! \nYour target? \nEliminate all \nof the red \nplanes. How to \ndo it? You just \nhave to cut \ntheir trail in \na specified \namount of time, \nbut be careful \nyou will lose \nif they cut \nyours. That's \nall. Be brave! \nYou know what \nthey say the \nbiggest enemy \nis your past!", { fontFamily: 'PressStart2P', fontSize: '19px', fontStyle: 'normal', color: '#d8d8d8ff'});
            this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY - 200, 'TimeLoop \n Aircrafts', { fontFamily: 'PressStart2P', fontSize: '22px', fontStyle: 'normal', color: '#000000ff'});
            this.Texto = this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY, 'Whats your \n  name?', { fontFamily: 'PressStart2P', fontSize: '22px', fontStyle: 'normal', color: '#000000ff'});
        }
        if (eventlevel == 1) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Congratulations \n You survived!\n A new mission \n  awaits you!', { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#0f7929ff'});
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (` You completed \n this mission \nin ${(nt).toFixed(0)} ms. So\nyou will recive \nthe same amount \nof time for the \n  next mission`), { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
        }
        if (eventlevel == 2) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Oh no! You died \n The enemy has\n destroyed you!', { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#c41818ff'});
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (`You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`), { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, (`For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue`), { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
            eon = "Expe";
        }

        if (eventlevel == 3) {
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 200, 'Oh no! You died \n Your time has\n    ran out!', { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#c41818ff'});
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, (`You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`), { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, (`For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue`), { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
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
        this.input.keyboard.once("keydown", (event) => {
            if (keyisdown == 0) {
                keyisdown = 1;
                if (event.key === 'Backspace') {
                    textInput = textInput.slice(0, -1);
                    this.Texto.setText(textInput);
                }
                if (/^[a-zA-Z]$/.test(event.key) || /^[0-9]$/.test(event.key) || /^[!@#$%^&*(){}\[\]:;"'<>,.?\/\\|~`+-=_]$/.test(event.key)) {
                    textInput += event.key;
                    this.Texto.setText(textInput);
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
        this.firstX
    }
    preload(){
        this.load.video("bg", "background.mp4", "loadeddata", false, true) // Image by freepik
        this.enemy = this.load.image("enemy", "enemy2.png")
        this.player = this.load.image("player", "spaceship.png")
    }

    create(){
        let txt = this.add.text(0, 0, "X", {
            fontFamily: "Arial",
            fontSize: "10px",
            color: "#ff0000ff"
        });

        // 2. Create a RenderTexture
        let rt = this.add.renderTexture(0, 0, txt.width, txt.height);

        // 3. Draw the text onto the render texture
        rt.draw(txt, 0, 0);

        // 4. Save it as a texture
        rt.saveTexture("spawn");

        // 5. Clean up temp objects
        txt.destroy();
        rt.destroy();
        this.TextTimer = this.add.text(this.cameras.main.centerX - 300, 10, "Please move around (with your mouse) \n   for about 10 sec. The enemy \n     will spawn around the X. \nThis text will change in to a timer.", { fontFamily: 'PressStart2P', fontSize: '16px', fontStyle: 'normal', color: '#000000ff'});
        this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg")
        this.video.setDisplaySize(300, 300).setScale(3);
        this.video.play(true);
        this.video.setDepth(-1);
        this.player = this.physics.add.image(500, 500,"player").setOrigin(0.5,0.5).setScale(2);
        this.firstX = this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(2);
        opponents.push({ x: this.player.x, y: this.player.y });
        input = this.input.activePointer;
        this.timedEvent = this.time.delayedCall(10000, console.log("Initalation"), [], this)
        this.player.setCollideWorldBounds(true)
        this.playerSensor = this.physics.add.sprite(this.player.x, this.player.y, null).setOrigin(0.5).setSize(30, 30);
        this.playerSensor.visible = false;
        this.badguysSensors = this.physics.add.group();
        this.spawns = this.add.group();
    }
    update(time, delta){
        let angle=Phaser.Math.Angle.Between(this.player.x,this.player.y,input.x,input.y);
        movementData.push({
                t: time, 
                x: this.player.x, 
                y: this.player.y, 
                r: this.player.rotation
        });

        // Player movement
        if (input.x !== this.lastX || input.y !== this.lastY) {
            this.player.setRotation(angle+Math.PI/2);
            this.physics.moveTo(this.player,input.x,input.y,400);
            this.playerSensor.x = this.player.x;
            this.playerSensor.y = this.player.y;
        }
        this.lastX = input.x;
        this.lastY = input.y; 
        this.remainingTime = this.timedEvent.getRemainingSeconds()

        function findBestSpawn(width, height, step, opponents) {
            let bestPoint = { x: 0, y: 0 };
            let bestDist = -1;
            for (let x = 0; x <= width; x += step) {
                for (let y = 0; y <= height; y += step) {
                    let minDist = Math.min(
                        ...opponents.map(o => Phaser.Math.Distance.Between(x, y, o.x, o.y))
                    );

                    if (minDist > bestDist) {
                        bestDist = minDist;
                        bestPoint = { x, y };
                    }
                }
            }
        return bestPoint;
        }

        if (this.remainingTime <= 0) {
            if (temp == 0) {
                session.push(movementData.length);
                temp = 1;
                this.trailTouched = 0;
            }

            while (a < session.length) {
                if (session[a] + powtorzenia < session[a + 1]) {
                    if (!this["badguy" + a]) {
                        this["badguy" + a] = this.physics.add.image(movementData[session[a] + powtorzenia].x, movementData[session[a] + powtorzenia].y,"enemy").setOrigin(0.5,0.5).setScale(2);
                        this["badguy" + a].setCollideWorldBounds(true)
                    }
                    if (!this["badguySensor" + a] && this["badguy" + a].visible == true) { 
                        let sensor = this["badguySensor" + a] = this.physics.add.sprite(this["badguy" + a].x, this["badguy" + a].y, null).setOrigin(0.5).setSize(20, 20);   
                        this["badguySensor" + a].visible = false;
                        this.badguysSensors.add(sensor);
                        this["badguy" + a].setCollideWorldBounds(true)
                    }
                    if (FirstLoop == 0) {
                        temporary = 0;
                        this.Home = this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5,0.5).setScale(2);
                        opponents.push({ x: this.player.x, y: this.player.y });
                        this.spawns.add(this.Home);
                        if (this.timedEvent2) {
                            this.timedEvent2.remove();
                        }
                        this.timedEvent2 = this.time.delayedCall(nt, () => {
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
                            const spawnvar = findBestSpawn(1300, 700, 20, opponents);
                            // Move the player away from the enemies
                            this.player.setPosition(spawnvar.x, spawnvar.y);
                            if (this.spawns) {
                                this.spawns.clear(true, true);
                            }
                            eventlevel = 3
                            nt = 10000;
                            DatabaseCall(1, textInput, s1 - 1, eon);
                            this.timedEvent2.remove();
                            this.scene.launch("PauseScene");
                            this.scene.bringToTop("PauseScene");
                            this.scene.pause();
                            this.timedEvent = this.time.delayedCall(500, () => {
                            })
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
            if (FirstLoop == 0) {
                nt = time;
            }
            FirstLoop = 1;
            powtorzenia++;
            this.remainingTime2 = this.timedEvent2.getRemainingSeconds();
        } 
        if (this.remainingTime2 > 0) {
            this.TextTimer.setText(this.remainingTime2.toFixed(4));
        }
        
        if (time % 40 < delta) {
            this.trails = this.physics.add.group();

            let trail = this.add.rectangle(
                this.player.x + 0, 
                this.player.y,
                4,
                4,
                0x00ff00
            ).setScale(2);

            this.tweens.add({
                targets:trail,
                alpha: 0,
                duration: 500,
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
                    const spawnvar = findBestSpawn(1300, 700, 20, opponents);
                    // Move the player away from the enemies
                    this.player.setPosition(spawnvar.x, spawnvar.y);
                    if (this.spawns) {
                        this.spawns.clear(true, true);
                    }
                    this.timedEvent2.remove();
                    eventlevel = 2;
                    nt = 10000;
                    DatabaseCall(1, textInput, s1 - 1, eon);
                    this.scene.launch("PauseScene");
                    this.scene.bringToTop("PauseScene");
                    this.scene.pause();
                    this.timedEvent = this.time.delayedCall(500, () => {
                        })
                    }
                }, null, this);


            this.evil_trails = this.physics.add.group();
            
        while (this["badguy" + b]) {
            if (this["badguy" + b].body.enable == true) {
                let evil_trail = this.add.rectangle(
                this["badguy" + b].x, 
                this["badguy" + b].y,
                4,
                4,
                0xff0000  
            ).setScale(2);
            this.physics.add.existing(evil_trail);

            evil_trail.badguy = this["badguy" + b];
            evil_trail.sensor = this["badguySensor" + b];
            
            this.evil_trails.add(evil_trail);

            this.tweens.add({
                targets:evil_trail,
                alpha: 0,
                duration: 1000,
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
                this.timedEvent = this.time.delayedCall(500, () => {
                        })
                eventlevel = 1;
                const spawnvar = findBestSpawn(1300, 700, 20, opponents);
                // Move the player away from the enemies
                this.player.setPosition(spawnvar.x, spawnvar.y);
                nt = time - nt + 1000;
                this.scene.launch("PauseScene");
                this.scene.bringToTop("PauseScene");
                this.scene.pause();
            }
        }, null, this);

        }
    }
}

const config = {
    type:Phaser.CANVAS,
    height:sizes.height,
    width:sizes.width,
    canvas:gameCanvas,
    scene:[PauseScene, GameScene],
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},
            fps: 30, 
            maxDelta: 100
        }
    }
}
const game = new Phaser.Game(config)
