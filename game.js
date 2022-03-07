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
var enemy;
var numOfEnemies = 10;       
var enemies;
var health = 100;

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
        this.load.image("door","assets/tilesets/lab/door.png");
        this.load.image("button-up","assets/tilesets/lab/button.png");
        this.load.image("button-down","assets/tilesets/lab/buttondown.png");
        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
        this.load.spritesheet('skin', 'assets/spritesheets/skin.png', { frameWidth: 48, frameHeight: 48 })
        // Spritesheets
        this.load.image("lab-tiles","assets/tilesets/lab/lab.png");
        this.load.image("forest-tiles","assets/tilesets/forest/Tiles/TilesNonSliced.png");
        this.load.image("swamp-tiles","assets/tilesets/swamp/1 Tiles/Tileset.png");
        this.load.image("industrial-tiles","assets/tilesets/lab/industrial zone/industrial.png");
        this.load.image("level1-tiles","assets/tilesets/custom/level1.png");

        // Maps
        this.load.tilemapTiledJSON('lab-map',"assets/maps/tilemap.json");
        this.load.tilemapTiledJSON('forest-map',"assets/maps/forest.json");
        this.load.tilemapTiledJSON('swamp-map',"assets/maps/swamp.json");
        this.load.tilemapTiledJSON('industrial-map',"assets/maps/industrial.json");
        this.load.tilemapTiledJSON('level1-map',"assets/maps/level1.json");

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
        this.load.spritesheet('pumpkin-dude', 'assets/spritesheets/pumpkin spritesheet.png',{frameWidth:18, frameHeight: 34})
        this.load.image('level1-back', 'assets/tilesets/lab/industrial zone/2 Background/2.png');
		this.load.image('level1-middle', 'assets/tilesets/lab/industrial zone/2 Background/3.png');
		this.load.image('level1-front', 'assets/tilesets/lab/industrial zone/2 Background/4.png');
   
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
            new Map("industrial",400,600,600, 2.4),
            new Map("level1",400,600,600, 2.4)
        ]
        var currentMap = mapArray[4];


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
        
        this.doors = this.physics.add.staticGroup();
        var doorArray = map.getObjectLayer('Doors').objects;
        for(var i = 0; i < doorArray.length; i++) {
            var doorObject = this.doors.create(doorArray[i].x*3, doorArray[i].y*3 + 155 - doorArray[i].height, 'door').setScale(3,3);
            // Attach door link
            if(i % 2 == 0 && i != doorArray.length-1) {
                doorObject.setData('teleport', [doorArray[i+1].x*3,doorArray[i+1].y*3 + 155]  );
            } else {
                doorObject.setData('teleport', [doorArray[i-1].x*3,doorArray[i-1].y*3 + 155]  );
            }
        }
        
        
        //vials = this.physics.add.staticGroup();
        //var cabinet = vials.create(430, 1065, 'vials').setScale(3,3);
        // For testing purposes, set the sprite alpha to 0-
        //cabinet.alpha = 0;

        // MAP SCALES, PLAYER, CAMERA, AND REFERENCE
        // DO NOT CHANGE.
        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        solidMap.setSize(300,3);
        
        //Text
        this.add.text(345, 875, 'Use the right and\nleft arrow keys\nto move.\n\nUse the up arrow\nkey to jump.', { fontSize: '32px', fill: '#FFFFFF' });
        this.add.text(1135, 975, 'To Interact', { fontSize: '32px', fill: '#FFFFFF' });
        this.add.text(3850, 2400, 'Press Space to attack.', { fontSize: '32px', fill: '#FFFFFF' });
        
        this.player = this.physics.add.group();

        player = this.player.create(400, 900, 'player');


//        player = this.physics.add.sprite(400, 900, 'player');
        //player.body.offset.x = -20;
        //player.y = 100;
        player.setScale(3,3);
        
        panel = this.add.image(0, 0, 'window');
        panel.setVisible(false);
        playerSkin = this.physics.add.sprite(400, 900, 'skin');
        playerSkin.setScale(3,3);
        //playerSkin.body.offset.x = -20;
        //playerSkin.y = 100;
        player.setSize(16,16);
        playerSkin.setSize(16,16);
        player.setOrigin(0.5,0.5);
        player.body.offset.y = 22;
        playerSkin.body.offset.y = 22;

        
        
        
        
        async function enemyrun(pumpkin){ 
                  
            //pumpkin.body.collideWorldBounds = true;           
            pumpkin.body.velocity.x = Math.random()*1.5+100;       
            pumpkin.body.velocity.y = Math.random()*5;
            
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        enemyleftrun(pumpkin);

                    })(),
                (Math.random()*2000+1000)
            ))

        }    
        
        async function enemyleftrun(pumpkin){
            pumpkin.flipX = true;
                pumpkin.body.velocity.x = Math.random()*(-1.5)-100;       
                pumpkin.body.velocity.y = Math.random()*5;
                //console.log(pumpkin.body.velocity.x)
                
                await new Promise((r) =>
                    setTimeout(
                    () =>
                    new (function () {
                            pumpkin.flipX = false;
                            enemyrun(pumpkin);
                        })(),
                (Math.random()*2000+1000)
                    ))
            
            }
    

        this.enemies = this.physics.add.group();
            var enemyArray = map.getObjectLayer('Enemies').objects;
            for(var i = 0; i < enemyArray.length; i++) {
                //var enemy = this.enemies.create(player.x + 50, player.y + 50,'pumpkin-dude').setScale(3,3);
                //enemyrun(enemy);
                var enemy = this.enemies.create(enemyArray[i].x*3, enemyArray[i].y*3 + 155 - enemyArray[i].height,'pumpkin-dude').setScale(3,3);
                //console.log(enemy.x + " " + enemy.y);
                //console.log(player.x + " " + player.y);
                enemy.setOrigin(0.5,0.5);
                enemy.setSize(16,16);
                enemy.body.offset.y = 15;
                enemy.setPushable(false);
                enemy.setData('isHit', Boolean(0));      
                enemy.setData('health', 30);            
                enemyrun(enemy);      
        }
  
        
        player.setData('isHit', Boolean(0));
        player.setData('Player', Boolean(1));

        
        this.physics.add.collider(this.enemies, solidMap);
        this.physics.add.collider(this.enemies, player, hitEntity, null, this);
        this.physics.add.collider(this.enemies, playerSkin);
        
        //display health
        var txt = this.add.text(0, 0, '100');
        txt.setScrollFactor(0);
        
        var SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        async function hitEntity(entity, attacker){
    
            if(SpaceKey.isDown) {
                var temp = entity;
                entity = attacker;
                attacker = temp;
            }

            if (entity.getData('isHit'))
                return;

            entity.setData('isHit', Boolean(1));

                            
            if(entity.getData("Player")) {
                health-=10;
                txt.text = health;
            
                playerSkin.setVelocityX((attacker.x-entity.x)*5);
                playerSkin.setVelocityY(-100);

            } else {
                entity.setData("health",entity.getData("health")-10);
                if(entity.getData("health") <= 0) {
                    entity.destroy();
                    return;
                }
            }

            entity.setVelocityX((attacker.x-entity.x)*5);
            entity.setVelocityY(-100);
            
            
            entity.tint = 0xff0000;
            
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        entity.tint = 0xffffff;
                        entity.setData('isHit', Boolean(0));
                    })(),
                    500
                )
            );
            }

        // Player collider has been created- put all collisions here.

        this.physics.add.overlap(player, this.doors,doorOpen,null,this);

        var EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        var usedDoor = false;
        // Each door is mapped to the next door down and up.
        function doorOpen(player,door) {
            //console.log(door);
            if(EnterKey.isDown && !usedDoor) {
                usedDoor = true;
                player.x = door.getData('teleport')[0];
                player.y = door.getData('teleport')[1];
                playerSkin.x = door.getData('teleport')[0];
                playerSkin.y = door.getData('teleport')[1];
                this.cameras.main.startFollow(player);
                doorReset();
            }
        }
        async function doorReset() {
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        usedDoor = false;
                    })(),
                500
            )
        );
        }
            

        //BUTTON EVENT
        this.buttons = this.physics.add.staticGroup();
        var buttonArray = map.getObjectLayer('Buttons').objects;
        for(var i = 0; i < buttonArray.length; i++) {
            //console.log(buttonArray[0]);
            var buttonObject = this.buttons.create(buttonArray[i].x*3, buttonArray[i].y*3 + 200 - buttonArray[i].height, 'button-up').setScale(3,3);
            buttonObject.setSize(50,50);
            buttonObject.setData('order', buttonArray[i].properties[0].value);
            buttonObject.setData('isDown', false);
            //console.log(buttonObject);
        }
        this.physics.add.collider(player, this.buttons,buttonPress,null,this);
        this.physics.add.collider(playerSkin, this.buttons);
        // Each door is mapped to the next door down and up.
        function buttonPress(player,button) {
            //console.log(button);
            if(player.body.touching.down && button.body.touching.up) {
                button.setSize(50,25);
                button.setTexture('button-down');
                //console.log("on botton");
                // Timed button up!
                if(!button.getData('isDown')) {
                    // Check if other buttons are pressed in correct order
                    //console.log(this.buttons);
                    var currentOrder = button.getData('order');
                    for(var i = 0; i < this.buttons.children.entries.length; i++) {
                        var compareButton = this.buttons.children.entries[i];
                        //console.log(compareButton);
                        if(compareButton.getData('order') > currentOrder && compareButton.getData('isDown')) {
                            console.log("reset");
                            resetAllButtons();
                        } else {
                            console.log("You clicked the right button.");
                        }
                    }
                    button.setData('isDown', true);
                    //buttonReset(button);
                }
            }
        }
        function resetAllButtons() {
            for(var i = 0; i < ref.buttons.children.entries.length; i++) {
                var compareButton = ref.buttons.children.entries[i];
                buttonReset(compareButton);
            }
        }
        async function buttonReset(button) {
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        button.setSize(50,50);
                        button.setData('isDown', false);
                        button.setTexture('button-up');
                        if(ref.physics.overlap(player, button)) {
                            player.setVelocityY(-200);
                        } 
                    })(),
                1000
            )
        );
        }

        
        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pumpkin-dude', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'pumpkin-dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pumpkin-dude', { start: 5, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        
        
        
        

        this.cameras.main.startFollow(player);
        this.cameras.main.setDeadzone(100, 200);

        // Reference, used for nested functions
        var ref = this;

        // COLLISIONS
        //solidMap.setCollisionBetween(1, 999, true, 'Solid');
        solidMap.setCollisionByExclusion([-1]);
        this.physics.add.collider(player,solidMap,onGround,null,this);
        
        // Overlap
        scoreText = this.add.text(0, 0, 'Press Enter', { fontSize: '32px', fill: '#FFFFFF' });
        scoreText.setVisible(false);
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
            new Anim('attackSkin',10,0,'skin',12,15),
            new Anim('enemywalk',10,-1,'pumpkin-dude',0,7)
        ];

        animations.forEach(anim => { 
            addAnimation(anim)
        });

        // Create a start animation for our player.
        player.anims.play("stand");
        playerSkin.anims.play("standSkin");


        this.enemies.children.entries.forEach(enemy => {
            enemy.anims.play("enemywalk");
        });
        //enemy.anims.play("enemywalk");


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
                player.setSize(32, 16);
                playerSkin.setSize(32, 16);
                player.body.offset.y = 22;
                playerSkin.body.offset.y = 22;
                player.anims.play('attack');
                playerSkin.anims.play('attackSkin');
                // Attack
                if(ref.physics.overlap(ref.enemies,player, hitEntity, null, ref))
                    console.log("WTHAT");

        }); 
        this.input.keyboard.on('keyup-SPACE', function (event) {
                player.setSize(16, 16);
                playerSkin.setSize(16, 16);
                player.body.offset.y = 22;
                playerSkin.body.offset.y=22;
                }
        );
        
                
        
        this.input.keyboard.on('keydown-ENTER', function (event) {
            if(vialsT) {
                // FUTURE - Pop up UI. Initial setup here.
                scoreText.setVisible(false);
                panel.setVisible(true);
                panel.x = player.x;
                panel.y = player.y;
                // TESTING - Moving scenes using scene number interaction.
                currentMapNum = (currentMapNum >= mapArray.length-1) ? 0 : currentMapNum+1;
                //ref.scene.start('InGame');
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
        vialsT = this.physics.overlap(player, this.doors);
        if (vialsT){
            scoreText.setVisible(true);
            scoreText.x = player.x - 100;
            scoreText.y = player.y + 50;
        }
        else{
            scoreText.setVisible(false);
        }
        
        
        
        
    }}

// ACTUAL GAME START
// The previous classes have defined the scenes,
// and here, the game is actually loaded and started.
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 570,
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





    
