import './style.css'
import Phaser, { Scene } from 'phaser'

// Performance optimizations:
// - Reduced video quality and size
// - Object pooling for trails
// - Reduced trail creation frequency
// - Optimized collision detection
// - Better memory management

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

// Performance optimization: Trail pooling
class TrailPool {
    constructor(scene, maxSize = 50) {
        this.scene = scene;
        this.pool = [];
        this.activeTrails = [];
        this.maxSize = maxSize;
    }

    getTrail(x, y, color) {
        let trail;
        if (this.pool.length > 0) {
            trail = this.pool.pop();
            trail.setPosition(x, y);
            trail.setFillStyle(color);
            trail.setAlpha(1);
            trail.setActive(true);
            trail.setVisible(true);
        } else {
            trail = this.scene.add.rectangle(x, y, 4, 4, color).setScale(2);
            this.scene.physics.add.existing(trail);
        }
        
        this.activeTrails.push(trail);
        
        // Fade out trail
        this.scene.tweens.add({
            targets: trail,
            alpha: 0,
            duration: color === 0x00ff00 ? 400 : 1000,
            onComplete: () => this.returnTrail(trail)
        });
        
        return trail;
    }

    returnTrail(trail) {
        const index = this.activeTrails.indexOf(trail);
        if (index > -1) {
            this.activeTrails.splice(index, 1);
        }
        
        if (this.pool.length < this.maxSize) {
            trail.setActive(false);
            trail.setVisible(false);
            this.pool.push(trail);
        } else {
            trail.destroy();
        }
    }

    clear() {
        this.activeTrails.forEach(trail => {
            this.scene.tweens.killTweensOf(trail);
            trail.destroy();
        });
        this.pool.forEach(trail => trail.destroy());
        this.activeTrails = [];
        this.pool = [];
    }
}

class PauseScene extends Phaser.Scene {
    constructor() {
        super("PauseScene");
        this.video = null;
        this.backgroundGraphics = null;
    }

    preload() {
        // Optimized: Use smaller, lower quality video or fallback to static background
        this.load.video("bg", "background.mp4", "loadeddata", false, true);
        this.load.image("tile", "tile.png");
        
        // Fallback graphics if video fails
        this.load.on('loaderror', (fileObj) => {
            if (fileObj.key === 'bg') {
                console.warn('Video failed to load, using fallback background');
                this.useStaticBackground = true;
            }
        });
    }

    create() {
        // Performance optimization: Use static background on weaker systems or video fallback
        if (this.useStaticBackground || !this.cache.video.has('bg')) {
            this.createStaticBackground();
        } else {
            this.createVideoBackground();
        }

        this.add.image(this.cameras.main.centerX - 200, this.cameras.main.centerY - 300, "tile").setOrigin(0, 0).setScale(1.5);
        const Start = this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY + 150, 'Continue...', { 
            fontFamily: 'PressStart2P', 
            fontSize: '22px', 
            fontStyle: 'normal', 
            color: '#2d4ee0ff' 
        });

        this.createEventTexts();
        this.setupStartButton(Start);
    }

    createVideoBackground() {
        try {
            this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
            // Reduced size for better performance
            this.video.setDisplaySize(200, 200);
            this.video.setDepth(-1);
            this.video.setTint(0x424242);
            
            // Lower quality settings
            if (this.video.video) {
                this.video.video.playbackRate = 0.8; // Slightly slower playback
            }
            
            this.video.play(true);
        } catch (error) {
            console.warn('Video playback failed, using static background');
            this.createStaticBackground();
        }
    }

    createStaticBackground() {
        // Create animated static background as fallback
        this.backgroundGraphics = this.add.graphics();
        this.backgroundGraphics.setDepth(-1);
        
        // Simple animated gradient background
        this.tweens.add({
            targets: { value: 0 },
            value: 360,
            duration: 10000,
            repeat: -1,
            onUpdate: (tween) => {
                const value = tween.getValue();
                this.backgroundGraphics.clear();
                
                // Create gradient effect
                for (let i = 0; i < 5; i++) {
                    const alpha = 0.1 + (Math.sin((value + i * 60) * Math.PI / 180) * 0.1);
                    const color = Phaser.Display.Color.HSVToRGB((value + i * 30) / 360, 0.3, 0.4);
                    this.backgroundGraphics.fillStyle(color.color, alpha);
                    this.backgroundGraphics.fillRect(
                        this.cameras.main.centerX - 100 + i * 40, 
                        this.cameras.main.centerY - 100, 
                        200, 200
                    );
                }
            }
        });
    }

    createEventTexts() {
        if (eventlevel == 0) {
            const instructionText = "Pilot you have \na new mission! \nYour target? \nEliminate all \nof the red \nplanes. How to \ndo it? You just \nhave to cut \ntheir trail in \na specified \namount of time, \nbut be careful \nyou will lose \nif they cut \nyours. That's \nall. Be brave! \nYou know what \nthey say the \nbiggest enemy \nis your past!";
            
            this.add.text(20, 150, instructionText, { 
                fontFamily: 'PressStart2P', 
                fontSize: '19px', 
                fontStyle: 'normal', 
                color: '#d8d8d8ff' 
            });
            this.add.text(700, 150, instructionText, { 
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
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, 
                `You completed \n this mission \nin ${(movementData[session[session.length - 1] - 1].t - movementData[session[session.length - 2]].t).toFixed(0)} ms. So\nyou will recive \nthe same amount \n  of time for \n  this mision`, { 
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
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, 
                `You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`, { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff' 
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, 
                'For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue', { 
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
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 100, 
                `You made it to \nthe round ${s1 - 1}.You \nwill respawn on \nthe first round.`, { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff' 
            });
            this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY, 
                'For stable game: \nReload the page \nExperimental:If \nyou want to \ncontinue the \ngame from round \n1 click Continue', { 
                fontFamily: 'PressStart2P', 
                fontSize: '16px', 
                fontStyle: 'normal', 
                color: '#000000ff' 
            });
            eon = "Expe";
        }
    }

    setupStartButton(Start) {
        Start.setInteractive();
        Start.on('pointerdown', () => {
            if (first_time == 0) {
                first_time = 1;
                this.scene.launch("scene-game");
            }
            this.scene.resume("scene-game");
            this.scene.stop();
        });
    }

    update() {
        // Optimized keyboard input handling
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

    destroy() {
        if (this.video) {
            this.video.destroy();
        }
        if (this.backgroundGraphics) {
            this.backgroundGraphics.destroy();
        }
        super.destroy();
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
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
        this.trailPool = null;
        this.lastTrailTime = 0;
        this.trailInterval = 30; // Reduced trail frequency for performance
        this.lastX = 0;
        this.lastY = 0;
        this.backgroundGraphics = null;
    }

    preload() {
        this.load.video("bg", "background.mp4", "loadeddata", false, true);
        this.load.image("enemy", "enemy2.png");
        this.load.image("player", "spaceship.png");
        this.load.image("spawn", "enemy1.png");
        
        // Fallback for video loading
        this.load.on('loaderror', (fileObj) => {
            if (fileObj.key === 'bg') {
                console.warn('Video failed to load, using fallback background');
                this.useStaticBackground = true;
            }
        });
    }

    create() {
        this.TextTimer = this.add.text(this.cameras.main.centerX - 300, 10, 
            "Please move around (with your mouse) \n   for about 10 sec. The enemy \n     will spawn around the X. \nThis text will change in to a timer.", { 
            fontFamily: 'PressStart2P', 
            fontSize: '16px', 
            fontStyle: 'normal', 
            color: '#000000ff' 
        });

        // Optimized background
        this.createBackground();

        this.player = this.physics.add.image(500, 500, "player").setOrigin(0.5, 0.5).setScale(2);
        this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5, 0.5).setScale(2);
        
        input = this.input.activePointer;
        this.timedEvent = this.time.delayedCall(10000, () => console.log("Initialization"), [], this);
        this.player.setCollideWorldBounds(true);
        
        this.playerSensor = this.physics.add.sprite(this.player.x, this.player.y, null).setOrigin(0.5).setSize(20, 20);
        this.playerSensor.visible = false;
        this.badguysSensors = this.physics.add.group();
        this.spawns = this.add.group();

        // Initialize trail pool
        this.trailPool = new TrailPool(this, 100);
        
        // Initialize physics groups for better performance
        this.trails = this.physics.add.group({
            maxSize: 50,
            runChildUpdate: false
        });
        this.evilTrails = this.physics.add.group({
            maxSize: 100,
            runChildUpdate: false
        });
    }

    createBackground() {
        if (this.useStaticBackground || !this.cache.video.has('bg')) {
            this.createStaticBackground();
        } else {
            this.createVideoBackground();
        }
    }

    createVideoBackground() {
        try {
            this.video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, "bg");
            // Much smaller video for better performance
            this.video.setDisplaySize(150, 150);
            this.video.play(true);
            this.video.setDepth(-1);
            
            // Lower playback rate for smoother performance
            if (this.video.video) {
                this.video.video.playbackRate = 0.7;
            }
        } catch (error) {
            console.warn('Video playback failed, using static background');
            this.createStaticBackground();
        }
    }

    createStaticBackground() {
        // Simple static pattern background
        this.backgroundGraphics = this.add.graphics();
        this.backgroundGraphics.setDepth(-1);
        this.backgroundGraphics.fillStyle(0x222222, 0.8);
        this.backgroundGraphics.fillRect(0, 0, sizes.width, sizes.height);
        
        // Add some simple pattern
        this.backgroundGraphics.lineStyle(1, 0x444444, 0.5);
        for (let i = 0; i < sizes.width; i += 50) {
            this.backgroundGraphics.lineBetween(i, 0, i, sizes.height);
        }
        for (let i = 0; i < sizes.height; i += 50) {
            this.backgroundGraphics.lineBetween(0, i, sizes.width, i);
        }
    }

    update(time, delta) {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, input.x, input.y);
        
        // Record movement data
        movementData.push({
            t: time,
            x: this.player.x,
            y: this.player.y,
            r: this.player.rotation
        });

        // Optimized movement check
        const mouseMoved = input.x !== this.lastX || input.y !== this.lastY;
        if (mouseMoved) {
            this.player.setRotation(angle + Math.PI / 2);
            this.physics.moveTo(this.player, input.x, input.y, 500);
            this.physics.moveTo(this.playerSensor, input.x, input.y, 500);
        }
        this.lastX = input.x;
        this.lastY = input.y;

        this.remainingTime = this.timedEvent.getRemainingSeconds();

        if (this.remainingTime <= 0) {
            this.handleGamePhase(time);
        }

        if (this.remainingTime2 > 0) {
            this.TextTimer.setText(this.remainingTime2.toFixed(4));
        }

        // Optimized trail creation - reduced frequency
        if (time - this.lastTrailTime > this.trailInterval) {
            this.createTrails();
            this.lastTrailTime = time;
        }
    }

    handleGamePhase(time) {
        if (temp == 0) {
            session.push(movementData.length);
            temp = 1;
            this.trailTouched = 0;
        }

        this.updateEnemies();
        this.remainingTime2 = this.timedEvent2 ? this.timedEvent2.getRemainingSeconds() : 0;
    }

    updateEnemies() {
        while (a < session.length) {
            if (session[a] + powtorzenia < session[a + 1]) {
                if (!this["badguy" + a]) {
                    this.createEnemy(a);
                }
                this.updateEnemyPosition(a);
            }
            a++;
        }
        a = 0;
        FirstLoop = 1;
        powtorzenia++;
    }

    createEnemy(index) {
        this["badguy" + index] = this.physics.add.image(
            movementData[session[index] + powtorzenia].x,
            movementData[session[index] + powtorzenia].y,
            "enemy"
        ).setOrigin(0.5, 0.5).setScale(2);
        this["badguy" + index].setCollideWorldBounds(true);

        if (this["badguy" + index].visible) {
            let sensor = this["badguySensor" + index] = this.physics.add.sprite(
                this["badguy" + index].x,
                this["badguy" + index].y,
                null
            ).setOrigin(0.5).setSize(20, 20);
            sensor.visible = false;
            this.badguysSensors.add(sensor);
        }

        if (FirstLoop == 0) {
            this.setupTimer(index);
        }
    }

    updateEnemyPosition(index) {
        const enemy = this["badguy" + index];
        const sensor = this["badguySensor" + index];
        const data = movementData[session[index] + powtorzenia];

        if (enemy && data) {
            enemy.setRotation(data.r);
            this.physics.moveTo(enemy, data.x, data.y, 500);
            if (sensor) {
                sensor.x = enemy.x;
                sensor.y = enemy.y;
            }
        }
    }

    setupTimer(index) {
        temporary = 0;
        this.Home = this.add.image(this.player.x, this.player.y, "spawn").setOrigin(0.5, 0.5).setScale(2);
        this.spawns.add(this.Home);

        if (this.timedEvent2) {
            this.timedEvent2.remove();
        }

        const timeLimit = movementData[session[session.length - 1] - 1].t - movementData[session[session.length - 2]].t + 2;
        this.timedEvent2 = this.time.delayedCall(timeLimit, () => this.handleTimeOut());
        this.TextTimer.x = this.cameras.main.centerX - 50;
    }

    createTrails() {
        // Player trail
        const playerTrail = this.trailPool.getTrail(this.player.x, this.player.y, 0x00ff00);
        this.trails.add(playerTrail);

        // Enemy trails
        for (let i = 0; i < session.length; i++) {
            const enemy = this["badguy" + i];
            if (enemy && enemy.body && enemy.body.enable) {
                const evilTrail = this.trailPool.getTrail(enemy.x, enemy.y, 0xff0000);
                evilTrail.badguy = enemy;
                evilTrail.sensor = this["badguySensor" + i];
                this.evilTrails.add(evilTrail);
            }
        }

        // Optimized collision detection
        this.setupCollisions();
    }

    setupCollisions() {
        // Player trail vs enemy sensors
        this.physics.add.overlap(this.badguysSensors, this.trails, () => {
            this.handlePlayerDeath();
        }, null, this);

        // Player sensor vs enemy trails
        this.physics.add.overlap(this.playerSensor, this.evilTrails, (player, trail) => {
            this.handleEnemyHit(trail);
        }, null, this);
    }

    handlePlayerDeath() {
        this.resetGame();
        eventlevel = 2;
        this.showPauseScene();
    }

    handleEnemyHit(trail) {
        if (trail.badguy && trail.badguy.body && trail.badguy.body.enable) {
            this.trailTouched = (this.trailTouched || 0) + 1;
            trail.badguy.body.enable = false;
            if (trail.sensor) {
                trail.sensor.setCollisionCategory(null);
            }
        }

        if (this.trailTouched >= session.length - 1) {
            console.log("Player touched enemy");
            session.push(movementData.length);
            this.trailTouched = 0;
            powtorzenia = 0;
            FirstLoop = 0;
            if (this.timedEvent2) {
                this.timedEvent2.remove();
            }
            eventlevel = 1;
            this.showPauseScene();
        }
    }

    handleTimeOut() {
        this.resetGame();
        eventlevel = 3;
        this.showPauseScene();
    }

    resetGame() {
        movementData.length = session[1];
        temp = 1;
        this.trailTouched = 0;
        powtorzenia = 0;
        FirstLoop = 0;

        // Clean up enemies
        for (let c = 1; c < session.length; c++) {
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
            if (this.timedEvent2) {
                this.timedEvent2.remove();
            }
        }
    }

    showPauseScene() {
        this.scene.launch("PauseScene");
        this.scene.bringToTop("PauseScene");
        this.scene.pause();
        this.timedEvent = this.time.delayedCall(500, () => {
            console.log("Game paused");
        });
    }

    destroy() {
        if (this.video) {
            this.video.destroy();
        }
        if (this.backgroundGraphics) {
            this.backgroundGraphics.destroy();
        }
        if (this.trailPool) {
            this.trailPool.clear();
        }
        super.destroy();
    }
}

// Optimized config with reduced physics iterations
const config = {
    type: Phaser.WEBGL,
    height: sizes.height,
    width: sizes.width,
    canvas: gameCanvas,
    scene: [PauseScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // Reduced physics iterations for better performance
            iterations: 4,
            overlapBias: 4,
            tileBias: 16
        }
    },
    // Performance optimizations
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    render: {
        pixelArt: false,
        antialias: true,
        antialiasGL: false,
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
        autoResize: true
    },
    // Reduce memory usage
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

const game = new Phaser.Game(config)