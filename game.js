// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

// Global Variables
var player;
var cursors;

var vials;
var scoreText;
var vialsT;
var panel;
var playerSkin;

// Character Color Picker (uses JQUERY)
$("#colorChoice").change(function(){
   playerSkin.setTint("0x" + $(this).val().substring(1));
});


// This scene loads all game assets, and is never loaded again.
// This is due to Phaser repeatedly calling preload() methods
// for scene changes. So, everything is loaded once here.
class LoadAssets extends Phaser.Scene {
    constructor() {
        super("LoadAssets");
    }
    preload() {
        // Player
        this.load.spritesheet('player', 'assets/spritesheets/player.png', { frameWidth: 48, frameHeight: 48 })
        this.load.image('vials', 'assets/tilesets/lab/vials.png');
        this.load.image('window', 'assets/icons/Card X2/Card X2.png');
        this.load.image("tiles","assets/tilesets/lab/lab.png");
        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
        this.load.spritesheet('skin', 'assets/spritesheets/skin.png', { frameWidth: 48, frameHeight: 48 })
        // Spritesheets
        this.load.image("lab-tiles","assets/tilesets/lab/lab.png");
        // Maps
        this.load.tilemapTiledJSON('lab-map',"assets/maps/tilemap.json");
        // Backgrounds
        this.load.image('lab-back', 'assets/backgrounds/Scifi Lab/layers/back.png');
		this.load.image('lab-middle', 'assets/backgrounds/Scifi Lab/layers/middle.png');
		this.load.image('lab-front', 'assets/backgrounds/Scifi Lab/layers/front.png');
    }
    create () {
        this.scene.start("InGame");
    }
}

// FUTURE- A class to handle Main Menu, and Level Selection.

// This scene handles all In-Game activities, from displayin
// the current map, backgrounds, handling player movement,
// puzzle interactions, enemy spawns, and more. It has been
// organized accordingly to simplify the scale.
class InGame extends Phaser.Scene {

    constructor() {
        super("InGame");
    }

    preload() {
        cursors = this.input.keyboard.createCursorKeys();
    }

    create() {

        // Remember, everything in the create() displays chronologically.

        // Map Structure and Map Array - ALL LOWERCASE.
        // The naming system is consistently enforced-
        // mapname-tiles, mapname-back, etc.
        class Map {
            constructor(name) {
                this.name = name;
                this.back1 = name + "-back";
                this.back2 = name  + "-middle";
                this.back3 = name + "-front";
                this.tilesetName = name + "-tiles";
                this.mapName = name + "-map";
            }
        }
        const mapArray = [
            new Map("lab")
        ]
        var currentMap = mapArray[0];


        // BACKGROUNDS
        this.cameras.main.setBackgroundColor('0x697e96');

        this.backgroundBack = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back1);
        this.backgroundBack.y += 350;
        this.backgroundBack.tileScaleX = 3;
        this.backgroundBack.tileScaleY = 3;
        this.backgroundBack.scrollFactorX = 0;
        this.backgroundBack.scrollFactorY = 0.3;


        this.backgroundMiddle = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back2);
        this.backgroundMiddle.y += 500;
        this.backgroundMiddle.tileScaleX = 3;
        this.backgroundMiddle.tileScaleY = 3;
        this.backgroundMiddle.scrollFactorX = 0;
        this.backgroundMiddle.scrollFactorY = 0.3;


        this.backgroundFront = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back3);
        this.backgroundFront.y += 300;
        this.backgroundFront.tileScaleX = 3;
        this.backgroundFront.tileScaleY = 3;
        this.backgroundFront.scrollFactorX = 0;
        this.backgroundFront.scrollFactorY = 0.1;


        // MAP SECTION
        // Load the current map for the player.
        const map = this.make.tilemap({ key: currentMap.mapName, tileWidth: 16, tileHeight: 16});
        const tileset = map.addTilesetImage("Lab",currentMap.tilesetName);
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const backMap = map.createLayer("Background", tileset, 0, 200);
        
        
        vials = this.physics.add.staticGroup();
        vials.create(333, 435, 'vials').setScale(3,3);

        // MAP SCALES, PLAYER, CAMERA, AND REFERENCE
        // DO NOT CHANGE.
        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        
        player = this.physics.add.sprite(15, 250, 'player');
        player.body.offset.y = -10;
        player.y = 100;
        player.setScale(3,3);
        
        panel = this.add.image(0, 0, 'window');
        panel.setVisible(false);
        playerSkin = this.physics.add.sprite(15, 250, 'skin');
        playerSkin.setScale(3,3);
        playerSkin.body.offset.y = -10;
        playerSkin.y = 100;



        this.cameras.main.startFollow(player);
        this.cameras.main.setDeadzone(100, 200);

        // Reference, used for nested functions
        var ref = this;

        // COLLISIONS
        solidMap.setCollisionBetween(1, 999, true, 'Solid');
        this.physics.add.collider(player,solidMap,onGround,null,this);
        
        // Overlap
        //showText = this.physics.overlap(player, vials, puzzleSolved1, null, this);
        scoreText = this.add.text(0, 0, 'Press Enter to Interact', { fontSize: '32px', fill: '#FFFFFF' });
        //scoreText.setVisible(false);
        this.physics.add.collider(playerSkin,solidMap,onGround,null,this);

        // ANIMATIONS
        // To simplify this, we have created an addAnimation function,
        // which takes a key, framerate, start frame, and end frame,
        // as well as a spritesheet name to avoid multiple anims.create().
        class Anim {
            constructor(key,framerate,repeat,spritesheet,start,end) {
                this.key = key;
                this.framerate = framerate;
                this.repeat = repeat;
                this.spritesheet = spritesheet;
                this.start = start;
                this.end = end;
            }
        }

        function addAnimation(anim) {
            ref.anims.create({
                key: anim.key,
                frames: ref.anims.generateFrameNumbers(anim.spritesheet, { start: anim.start, end: anim.end }),
                frameRate: anim.framerate,
                repeat: anim.repeat
            });
        }

        // ANIMATION ARRAY
        // Add all animations here, under the following format:
        // new Anim ( 'key' , framerate, repeat value, 'spritesheet', start frame, end frame )
        var animations = [
            new Anim('stand',10,-1,'player',0,0),
            new Anim('walk',10,-1,'player',6,11),
            new Anim('jump',1,-1,'player',16,17),
            new Anim('attack',10,0,'player',12,15),
            new Anim('standSkin',1,-1,'skin',0,0),
            new Anim('walkSkin',10,-1,'skin',6,11),
            new Anim('jumpSkin',1,-1,'skin',16,17),
            new Anim('attackSkin',10,0,'skin',12,15)
        ];

        animations.forEach(anim => {
            addAnimation(anim)
        });

        // Create a start animation for our player.
        player.anims.play("stand");
        playerSkin.anims.play("standSkin");

        // INPUT EVENTS
        // Create different inputs for the player.
        // Controller support can be added here.
        this.input.keyboard.on('keydown-LEFT', function (event) {
            // Flip textures
            player.flipX = true;
            playerSkin.flipX = true;

            // Apply velocities
            player.setVelocityX(-200);
            playerSkin.setVelocityX(-200);

            // Apply animations
            if(player.body.onFloor()) {
            player.anims.play('walk');
            playerSkin.anims.play('walkSkin');
            }

        });

        this.input.keyboard.on('keydown-RIGHT', function (event) {
            player.flipX = false;
            playerSkin.flipX = false;
            player.setVelocityX(200);
            playerSkin.setVelocityX(200);

            if(player.body.onFloor()) {
            player.anims.play('walk');
            playerSkin.anims.play('walkSkin');
            }
        });

        this.input.keyboard.on('keyup-RIGHT', function (event) {
            // If the user isn't moving left-
            if(!cursors.left.isDown) {
                player.setVelocityX(0);
                playerSkin.setVelocityX(0);

                if(player.body.onFloor()) {
                    player.anims.play('stand');
                    playerSkin.anims.play("standSkin");
                }
            }
        });

        this.input.keyboard.on('keyup-LEFT', function (event) {
            // If the user isn't moving right-
            if(!cursors.right.isDown) {
                player.setVelocityX(0);
                playerSkin.setVelocityX(0);
                if(player.body.onFloor()) {
                    player.anims.play('stand');
                    playerSkin.anims.play("standSkin");
                }
            }
        });

        this.input.keyboard.on('keydown-UP', function (event) {
            if(player.body.onFloor()) {
                player.setVelocityY(-200);
                playerSkin.setVelocityY(-200);
                player.anims.play('jump', true);
                playerSkin.anims.play('jumpSkin', true);
            }
        });
        
        this.input.keyboard.on('keydown-SPACE', function (event) {
                player.anims.play('attack');
                playerSkin.anims.play('attackSkin');
        });
        
        this.input.keyboard.on('keydown-ENTER', function (event) {
            if(vialsT) {
                scoreText.setVisible(false);
                panel.setVisible(true);
                panel.x = player.x;
                panel.y = player.y;
            }
        });
        
        this.input.keyboard.on('keydown-ESC', function (event) {   
            panel.setVisible(false);
        });
        
        var lastAnim = "stand";
        // In a clever way, to avoid doing onFloor() in the Update() 
        // function, we have instead designated Floors as separate
        // layers in our levels, and trigger an OnCollide event.
        function onGround() {
            // Short circuit if player has not changed states
            if(player.anims.currentAnim.key == lastAnim || player.anims.currentAnim.key == "attack")
                return;

            if(cursors.right.isDown || cursors.left.isDown) {
                //console.log("playing walk anim")
                if(player.anims.currentAnim.key != "walk") {
                    player.anims.play('walk');
                    playerSkin.anims.play('walkSkin');
                    lastAnim = "walk";
                }
            }
            else {
                //console.log("playing stand anim")
                if(player.anims.currentAnim.key != "stand") {
                    player.anims.play('stand');
                    playerSkin.anims.play("standSkin");
                    lastAnim = "stand";
                }
            }
        }
    }

    update() {
        // All input events have been moved to INPUT EVENTS using Javascript Events
        // Here, if we are smart enough, we don't have to put anything.
        // Every single event should be a collision or a keypress.

        // PARALLAX EFFECT
        // Unless we can figure out how to move this map on player movement-
        // it will have to be in the Update() method
        if(player.anims.currentAnim.key == "walk" || player.anims.currentAnim.key == "jump")
            if(player.flipX) {
                this.backgroundBack.tilePositionX -= 0.05;
                this.backgroundMiddle.tilePositionX -=  0.1;
                this.backgroundFront.tilePositionX -=  0.3;
            } else{
                this.backgroundBack.tilePositionX += 0.05;
                this.backgroundMiddle.tilePositionX +=  0.1;
                this.backgroundFront.tilePositionX +=  0.3;     
            }


        // FUTURE - Enemy movement.
        vialsT = this.physics.overlap(player, vials);
        if (vialsT){
            scoreText.setVisible(true);
            scoreText.x = player.x - 200;
            scoreText.y = player.y + 50;
        }
        else{
            scoreText.setVisible(false);
        }
        
    }

}

// ACTUAL GAME START
// The previous classes have defined the scenes,
// and here, the game is actually loaded and started.
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: true
        },
    },
    scene: [
        LoadAssets,
        InGame        
    ],
};

var game = new Phaser.Game(config);
