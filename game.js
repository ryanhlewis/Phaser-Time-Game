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
        this.load.image('lab', 'assets/lab.png')
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 48, frameHeight: 48 })
    }
    create() {
        var floor = this.physics.add.staticGroup();
        floor.create(50, 640, 'lab');
        
        player = this.physics.add.sprite(15, 250, 'player');
        this.physics.add.collider(player, floor);
        
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
        cursors = this.input.keyboard.createCursorKeys();
    }
    update() {
            if (cursors.left.isDown)
            {
                player.setVelocityX(-50);

                player.anims.play('left', true);
            }
            else if (cursors.right.isDown)
            {
                player.setVelocityX(50);

                player.anims.play('right', true);
            }
            else
            {
                player.setVelocityX(0);

                player.anims.play('stand');
            }
        
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.setVelocityY(-200);
            }
        }
}

/*class InGame extends Phaser.Scene {

    constructor() {
        super("InGame");
    }
    preload() {
        
    }
    create(data) {

    }
    update(delta,time) {

    }
}*/


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
        LoadAssets/*,
        InGame*/        
    ],
};

var game = new Phaser.Game(config);
