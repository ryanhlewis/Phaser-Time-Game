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
    scene: [],
};

var game = new Phaser.Game(config);

class LoadAssets extends Phaser.Scene {
    // Load all assets for the first time, never again.
    constructor() {
        super("LoadAssets");
    }
    preload() {

    }
    create() {
        
    }
}

class InGame extends Phaser.Scene {

    constructor() {
        super("InGame");
    }
    preload() {
        
    }
    create(data) {

    }
    update(delta,time) {

    }
}
