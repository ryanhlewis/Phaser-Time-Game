// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
        },
    },
    scene: [
        LoadAssets/*,
        InGame*/        
    ],
};

var game = new Phaser.Game(config);

// Global Variables
var player;

class LoadAssets extends Phaser.Scene {
    // Load all assets for the first time, never again.
    constructor() {
        super("LoadAssets");
    }
    preload() {
        this.load.image('lab', 'assets/lab.png')
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 })
    }
    create() {
        this.add.image(0, 0, 'lab').setOrigin(0, 0);
        player = this.physics.add.sprite(15, 250, 'player');
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
