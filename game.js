// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

// Global Variables
var player;
var cursors;

// This scene loads all game assets, and is never loaded again.
// This is due to Phaser repeatedly calling preload() methods
// for scene changes. So, everything is loaded once here.
class LoadAssets extends Phaser.Scene {
    constructor() {
        super("LoadAssets");
    }
    preload() {
        this.load.spritesheet('player', 'assets/spritesheets/player.png', { frameWidth: 48, frameHeight: 48 })
        this.load.image("tiles","assets/tilesets/lab/lab.png");
        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
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
        // MAP SECTION
        // Load the current map for the player. This map will be stored in an
        // array, whereas the Player passes an index to select their current map.
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16});
        const tileset = map.addTilesetImage("Lab","tiles");
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const backMap = map.createLayer("Background", tileset, 0, 200);

        // MAP SCALES, PLAYER, CAMERA, AND REFERENCE
        // DO NOT CHANGE.
        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        
        player = this.physics.add.sprite(15, 250, 'player');
        player.body.offset.y = -10;
        player.y = 100;
        player.setScale(3,3);

        this.cameras.main.startFollow(player);
        this.cameras.main.setDeadzone(100, 200);

        // Reference, used for nested functions
        var ref = this;

        // COLLISIONS
        solidMap.setCollisionBetween(1, 999, true, 'Solid');
        this.physics.add.collider(player,solidMap,onGround,null,this);

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
            new Anim('attack',10,1,'player',12,15)
        ];

        animations.forEach(anim => {
            addAnimation(anim)
        });

        // Create a start animation for our player.
        player.anims.play("stand");


        // INPUT EVENTS
        // Create different inputs for the player.
        // Controller support can be added here.
        this.input.keyboard.on('keydown-LEFT', function (event) {
            player.flipX = true;
            player.setVelocityX(-200);
            if(player.body.onFloor())
            player.anims.play('walk');
        });

        this.input.keyboard.on('keydown-RIGHT', function (event) {
            player.flipX = false;
            player.setVelocityX(200);
            if(player.body.onFloor())
            player.anims.play('walk');
        });

        this.input.keyboard.on('keyup-RIGHT', function (event) {
            // If the user isn't moving left-
            if(!cursors.left.isDown) {
                player.setVelocityX(0);
                if(player.body.onFloor())
                    player.anims.play('stand');
            }
        });

        this.input.keyboard.on('keyup-LEFT', function (event) {
            // If the user isn't moving right-
            if(!cursors.right.isDown) {
                player.setVelocityX(0);
                if(player.body.onFloor())
                    player.anims.play('stand');
            }
        });

        this.input.keyboard.on('keydown-UP', function (event) {
            if(player.body.onFloor()) {
                player.setVelocityY(-200);
                player.anims.play('jump', true);
            }
        });
        
        this.input.keyboard.on('keydown-SPACE', function (event) {
                player.anims.play('attack');
        });
        
        this.input.keyboard.on('keyup-SPACE', function (event) {
                player.anims.play('stand');
        });

        var lastAnim = "stand";
        // In a clever way, to avoid doing onFloor() in the Update() 
        // function, we have instead designated Floors as separate
        // layers in our levels, and trigger an OnCollide event.
        function onGround() {
            // Short circuit if player has not changed states
            if(player.anims.currentAnim.key == lastAnim)
                return;

            if(cursors.right.isDown || cursors.left.isDown) {
                console.log("playing walk anim")
                if(player.anims.currentAnim.key != "walk") {
                    player.anims.play('walk');
                    lastAnim = "walk";
                }
            }
            else {
                console.log("playing stand anim")
                if(player.anims.currentAnim.key != "stand") {
                    player.anims.play('stand');
                    lastAnim = "stand";
                }
            }
        }

    }

    update() {
        // All input events have been moved to INPUT EVENTS using Javascript Events
        // Here, if we are smart enough, we don't have to put anything.
        // Every single event should be a collision or a keypress.

        // FUTURE - Enemy movement.
        
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
            debug: false
        },
    },
    scene: [
        LoadAssets,
        InGame        
    ],
};

var game = new Phaser.Game(config);
