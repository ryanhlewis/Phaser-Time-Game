// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

// Global Variables
// TODO - Try to keep these to a minimum.
var player;
var cursors;

var vials;
var scoreText;
var vialsT;
var panel;
var playerSkin;
var savedCameraPos;

var currentMapNum = 0;

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
        this.load.tilemapTiledJSON('map',"assets/level1.json");
        this.load.spritesheet('skin', 'assets/spritesheets/skin.png', { frameWidth: 48, frameHeight: 48 })
        // Spritesheets
        this.load.image("lab-tiles","assets/tilesets/lab/lab.png");
        this.load.image("forest-tiles","assets/tilesets/forest/Tiles/TilesNonSliced.png");
        this.load.image("swamp-tiles","assets/tilesets/swamp/1 Tiles/Tileset.png");
        this.load.image("industrial-tiles","assets/tilesets/lab/industrial zone/industrial.png");
        // Maps
        this.load.tilemapTiledJSON('lab-map',"assets/level1.json");
        this.load.tilemapTiledJSON('forest-map',"assets/maps/forest.json");
        this.load.tilemapTiledJSON('swamp-map',"assets/maps/swamp.json");
        this.load.tilemapTiledJSON('industrial-map',"assets/maps/industrial.json");
        // Backgrounds
        this.load.image('lab-back', 'assets/backgrounds/Scifi Lab/layers/back.png');
		this.load.image('lab-middle', 'assets/backgrounds/Scifi Lab/layers/middle.png');
		this.load.image('lab-front', 'assets/backgrounds/Scifi Lab/layers/front.png');
        this.load.image('forest-back', 'assets/tilesets/forest/BG/2.png');
		this.load.image('forest-middle', 'assets/tilesets/forest/BG/3.png');
		this.load.image('forest-front', 'assets/tilesets/forest/BG/4.png');
        this.load.image('swamp-back', 'assets/tilesets/space background/layers/1.png');
		this.load.image('swamp-middle', 'assets/tilesets/space background/layers/2.png');
		this.load.image('swamp-front', 'assets/tilesets/space background/layers/3.png');
        this.load.image('industrial-back', 'assets/tilesets/lab/industrial zone/2 Background/2.png');
		this.load.image('industrial-middle', 'assets/tilesets/lab/industrial zone/2 Background/3.png');
		this.load.image('industrial-front', 'assets/tilesets/lab/industrial zone/2 Background/4.png');
        this.load.image('industrial-front', 'assets/tilesets/lab/industrial zone/2 Background/4.png');
        this.load.image('bulkhead-walls-back', 'assets/tilesets/lab/bulkhead-walls-back.png');
        this.load.image('Background', 'assets/tilesets/lab/industrial zone/2 Background/Background.png');
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
        /*class Map {
            constructor(name,offset1,offset2,offset3,scale) {
                this.name = name;
                this.back1 = name + "-back";
                this.back2 = name  + "-middle";
                this.back3 = name + "-front";
                this.tilesetName = name + "-tiles";
                this.mapName = name + "-map";
                this.offset1 = offset1;
                this.offset2 = offset2;
                this.offset3 = offset3;
                this.scale = scale;
            }
        }
        const mapArray = [
            new Map("lab",350,500,300, 3),
            new Map("forest",500,500,600, 4),
            new Map("swamp",-20,200,700, 4),
            new Map("industrial",400,600,600, 2.4)
        ]
        var currentMap = mapArray[currentMapNum];


        // BACKGROUNDS
        this.cameras.main.setBackgroundColor('0x697e96');

        this.backgroundBack = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back1);
        this.backgroundBack.y += currentMap.offset1;
        this.backgroundBack.tileScaleX = currentMap.scale;
        this.backgroundBack.tileScaleY = currentMap.scale;
        this.backgroundBack.scrollFactorX = 0;
        this.backgroundBack.scrollFactorY = 0.99;


        this.backgroundMiddle = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back2);
        this.backgroundMiddle.y += currentMap.offset2;
        this.backgroundMiddle.tileScaleX = currentMap.scale;
        this.backgroundMiddle.tileScaleY = currentMap.scale;
        this.backgroundMiddle.scrollFactorX = 0;
        this.backgroundMiddle.scrollFactorY = 0.99;


        this.backgroundFront = this.add.tileSprite(0, 0, 640*2, 640*2, currentMap.back3);
        this.backgroundFront.y += currentMap.offset3;
        this.backgroundFront.tileScaleX = currentMap.scale;
        this.backgroundFront.tileScaleY = currentMap.scale;
        this.backgroundFront.scrollFactorX = 0;
        this.backgroundFront.scrollFactorY = 0.99;


        // MAP SECTION
        // Load the current map for the player.
        const map = this.make.tilemap({ key: currentMap.mapName});
        const tileset = map.addTilesetImage(currentMap.name,currentMap.tilesetName);
        const backMap = map.createLayer("Background", tileset, 0, 200);
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        
        
        vials = this.physics.add.staticGroup();
        var cabinet = vials.create(430, 465, 'vials').setScale(3,3);
        // For testing purposes, set the sprite alpha to 0-
        cabinet.alpha = 0;

        // MAP SCALES, PLAYER, CAMERA, AND REFERENCE
        // DO NOT CHANGE.
        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        solidMap.setSize(300,3);*/
        
        const map = this.make.tilemap({ key: 'lab-map'});
        const tileset = map.addTilesetImage('lab', 'lab-tiles');
        //const backMap = map.createLayer("Background", tileset, 0, 200);
        //const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const platforms = map.createStaticLayer('platforms', tileset, 0, 200);
        
        player = this.physics.add.sprite(15, 250, 'player');
        //player.body.offset.x = -20;
        player.y = 100;
        player.setScale(3,3);
        
        panel = this.add.image(0, 0, 'window');
        panel.setVisible(false);
        playerSkin = this.physics.add.sprite(0, 200, 'skin');
        playerSkin.setScale(3,3);
        //playerSkin.body.offset.x = -20;
        playerSkin.y = 100;
        player.setSize(16,16);
        playerSkin.setSize(16,16);
        player.setOrigin(0.5,0.5);
        player.body.offset.y = 22;
        playerSkin.body.offset.y = 22;




        this.cameras.main.startFollow(player);
        this.cameras.main.setDeadzone(100, 200);

        // Reference, used for nested functions
        var ref = this;

        // COLLISIONS
        solidMap.setCollisionBetween(1, 999, true, 'Solid');
        //solidMap.setCollisionByExclusion([-1]);
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
                // FUTURE - Pop up UI. Initial setup here.
                scoreText.setVisible(false);
                panel.setVisible(true);
                panel.x = player.x;
                panel.y = player.y;
                // TESTING - Moving scenes using scene number interaction.
                currentMapNum = (currentMapNum >= mapArray.length-1) ? 0 : currentMapNum+1;
                ref.scene.start('InGame');
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

        savedCameraPos = this.cameras.main.scrollX;

    }

    update() {
        // All input events have been moved to INPUT EVENTS using Javascript Events
        // Here, if we are smart enough, we don't have to put anything.
        // Every single event should be a collision or a keypress.

        // PARALLAX EFFECT
        // Unless we can figure out how to move this map on player movement-
        // it will have to be in the Update() method
        if((player.anims.currentAnim.key == "walk" || player.anims.currentAnim.key == "jump") && savedCameraPos != this.cameras.main.scrollX) {
            if(player.flipX) {
                this.backgroundBack.tilePositionX -= 0.05;
                this.backgroundMiddle.tilePositionX -=  0.1;
                this.backgroundFront.tilePositionX -=  0.3;
            } else{
                this.backgroundBack.tilePositionX += 0.05;
                this.backgroundMiddle.tilePositionX +=  0.1;
                this.backgroundFront.tilePositionX +=  0.3;     
            }
            savedCameraPos = this.cameras.main.scrollX;
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
