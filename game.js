// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

// Global Variables
var player;
var cursors;

class LoadAssets extends Phaser.Scene {
    // Load all assets for the first time, never again.
    constructor() {
        super("LoadAssets");
    }
    preload() {
        this.load.spritesheet('player', 'assets/spritesheets/player.png', { frameWidth: 48, frameHeight: 48 })
        this.load.image("tiles","assets/tilesets/lab.png");
        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
    }
    create () {
        this.scene.start("InGame");
    }
}

class InGame extends Phaser.Scene {

    constructor() {
        super("InGame");
    }
    preload() {
        
    }

    create() {
        const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16});
        const tileset = map.addTilesetImage("Lab","tiles");
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const backMap = map.createLayer("Background", tileset, 0, 200);

        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        
        player = this.physics.add.sprite(15, 250, 'player');
        player.body.offset.y = -10;
        player.y = 100;

        player.setScale(3,3);

        solidMap.setCollisionByExclusion([-1]);
        this.physics.add.collider(player, solidMap);

        this.cameras.main.startFollow(player);
        this.cameras.main.setDeadzone(100, 200);


        
        this.anims.create({
            key: 'stand',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player', { start: 16, end: 17 }),
            frameRate: 1,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
            if (cursors.left.isDown)
            {
                player.flipX = true;
                
                player.setVelocityX(-200);

                if(player.body.onFloor())
                    player.anims.play('left', true);
                else
                    player.anims.play('jump', true);

            }
            else if (cursors.right.isDown)
            {
                player.flipX = false;
                
                player.setVelocityX(200);

                if(player.body.onFloor())
                    player.anims.play('right', true);
                else
                    player.anims.play('jump', true);

            }
            else
            {
                player.setVelocityX(0);

                if(player.body.onFloor())
                    player.anims.play('stand');
                else
                    player.anims.play('jump', true);

            }
        
            if (cursors.up.isDown && player.body.onFloor())
            {
                player.setVelocityY(-200);
            }
        }
}


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
