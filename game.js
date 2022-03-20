// Phaser Time Game,
// Made for CS329E: Elements of Game Development
// By Alyssa, Angela, and Ryan

import MultiKey from "./multikey.js";

// Global Variables
// TODO - Try to keep these to a minimum.







var player;
var cursors;

var vials;
var scoreText;
var vialsT;
var panel;
var savedCameraPos;
var enemy;
var numOfEnemies = 10;       
var enemies;
var health = 100;
var godMode = false;
var leftInput;
var rightInput;
var jumpInput;
var attackInput;

var currentMapNum = 0;

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
        this.load.image("door","assets/maps/door.png");
        this.load.image("button-up","assets/tilesets/lab/button.png");
        this.load.image("button-down","assets/tilesets/lab/buttondown.png");
        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
        this.load.spritesheet('skin', 'assets/spritesheets/skin.png', { frameWidth: 48, frameHeight: 48 })
        
        // Tiles
        this.load.image("lab-tiles","assets/tilesets/lab/lab.png");
        this.load.image("forest-tiles","assets/tilesets/forest/Tiles/TilesNonSliced.png");
        this.load.image("swamp-tiles","assets/tilesets/swamp/1 Tiles/Tileset.png");
        this.load.image("industrial-tiles","assets/tilesets/lab/industrial zone/industrial.png");
        this.load.image("level1-tiles","assets/tilesets/custom/level1.png");
        this.load.image("level2-tiles","assets/tilesets/custom/level2.png");

        // Maps
        this.load.tilemapTiledJSON('lab-map',"assets/maps/tilemap.json");
        this.load.tilemapTiledJSON('forest-map',"assets/maps/forest.json");
        this.load.tilemapTiledJSON('swamp-map',"assets/maps/swamp.json");
        this.load.tilemapTiledJSON('industrial-map',"assets/maps/industrial.json");
        this.load.tilemapTiledJSON('level1-map',"assets/maps/level1.json");
        this.load.tilemapTiledJSON('level2-map',"assets/maps/level2.json");

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
        this.load.image('level2-back', 'assets/maps/transparent.png');
		this.load.image('level2-middle', 'assets/maps/transparent.png');
		this.load.image('level2-front', 'assets/maps/Level2 Background.png');
   
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
        // Plugins
        this.load.scenePlugin('Slopes', 'phaser-slopes.min.js');

        cursors = this.input.keyboard.createCursorKeys();
            
        const { LEFT, RIGHT, UP, A, D, W, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        leftInput = new MultiKey(this, [LEFT, A]);
        rightInput = new MultiKey(this, [RIGHT, D]);
        jumpInput = new MultiKey(this, [UP, W]);
        attackInput = new MultiKey(this, [SPACE]);

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
            new Map("level1",400,600,600, 2.4),
            new Map("level2",400,600,825, 3)
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
        const foreMap = map.createLayer("Foreground", tileset, 0, 200);
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const doorMap = map.createLayer("Door", tileset, 0, 200);
        const ladderMap = map.createLayer("Ladder", tileset, 0, 200);
        
        this.doors = [];
        var doorArray = map.getObjectLayer('Doors').objects;
        for(var i = 0; i < doorArray.length; i++) {
            var doorObject = this.matter.add.image(doorArray[i].x*3, doorArray[i].y*3 + 155 - doorArray[i].height, 'door').setScale(3,3);
            doorObject.body.isSensor = true;
            doorObject.body.isStatic = true;
            this.doors.push(doorObject);
            // Attach door link
            if(i % 2 == 0 && i != doorArray.length-1) {
                doorObject.setData('teleport', [doorArray[i+1].x*3,doorArray[i+1].y*3 + 155]  );
            } else {
                doorObject.setData('teleport', [doorArray[i-1].x*3,doorArray[i-1].y*3 + 155]  );
            }
        }
        
        
        //vials = this.matter.add.staticGroup();
        //var cabinet = vials.create(430, 1065, 'vials').setScale(3,3);
        // For testing purposes, set the sprite alpha to 0-
        //cabinet.alpha = 0;

        // MAP SCALES, PLAYER, CAMERA, AND REFERENCE
        // DO NOT CHANGE.
        solidMap.setScale(3,3);
        backMap.setScale(3,3);
        foreMap.setScale(3,3);
        doorMap.setScale(3,3);
        ladderMap.setScale(3,3);
        solidMap.setSize(300,3);
        
        //Text
        this.add.text(345, 875, 'Use the right and\nleft arrow keys\nto move.\n\nUse the up arrow\nkey to jump.', { fontSize: '32px', fill: '#FFFFFF' });
        this.add.text(1135, 975, 'To Interact', { fontSize: '32px', fill: '#FFFFFF' });
        this.add.text(3850, 2400, 'Press Space to attack.', { fontSize: '32px', fill: '#FFFFFF' });
        


        player = this.matter.add.sprite(400, 900, 'player');
        console.log(player);

//        player = this.matter.add.sprite(400, 900, 'player');
        //player.body.offset.x = -20;
        //player.y = 100;
        player.setScale(3,3);
        
        panel = this.add.image(0, 0, 'window');
        panel.setVisible(false);
        player.setSize(16,16);
        player.setOrigin(0.5,0.28);
        player.body.centerOffset.y = 22;

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        const { width: w, height: h } = player;
        player.mainBody = Bodies.rectangle(0,0, w * 2, h*3, {
          chamfer: { radius: 10 }
        });
        player.bottom = Bodies.rectangle(0, 10, w * 1, h*2 + 20, { isSensor: true }),
        player.left = Bodies.rectangle(-w * 1.35, 1, 70, h * 1.5, { isSensor: true }),
        player.right = Bodies.rectangle(w * 1.35, 1, 70, h * 1.5, { isSensor: true })
        const compoundBody = Body.create({
          parts: [
            player.mainBody,
            player.bottom,
            player.left,
            player.right
          ],
          frictionStatic: 0,
          frictionAir: 0.02,
          friction: 0.1,
          // The offset here allows us to control where the sprite is placed relative to the
          // matter body's x and y - here we want the sprite centered over the matter body.
          render: { sprite: { xOffset: 0.5, yOffset: 0.6 } }
        });
        console.log(player.mainBody);
        player.onGround = false;

        function onGround() {
            player.onGround = true;
            //console.log("entered ground");
        }

        function resetTouching() {
            player.onGround = false;
        }

        this.matter.world.on("beforeupdate", resetTouching, this);

        console.log(player.bottom);

        this.matterCollision.addOnCollideStart({
            objectA: player.bottom,
            callback: onGround,
            context: this
          });
          this.matterCollision.addOnCollideActive({
            objectA: player.bottom,
            callback: onGround,
            context: this
          });


        player.setExistingBody(compoundBody).setFixedRotation();
        
        
        async function enemyrun(pumpkin){ 
                  
            //pumpkin.body.collideWorldBounds = true; 
            pumpkin.setVelocityX(Math.random()*(1.5)+2);          
            //pumpkin.body.velocity.x = Math.random()*1.5+100;       
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
            pumpkin.setVelocityX(Math.random()*(-1.5)-2);
                //pumpkin.body.velocity.x = Math.random()*(-1.5)-100;       
                pumpkin.body.velocity.y = Math.random()*5;
                
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
    
        
        //this.enemies = this.matter.add.group();
        this.enemies = [];
        var enemyArray = [];
        try {
            enemyArray = map.getObjectLayer('Enemies').objects;
        } catch (e) {
            console.log("No enemies in this map!");
        }
            for(var i = 0; i < enemyArray.length; i++) {
                //var enemy = this.matter.add.sprite(player.x + 50, player.y + 50,'pumpkin-dude').setScale(3,3);
                //enemyrun(enemy);
                var enemy = this.matter.add.sprite(0,0,'pumpkin-dude').setScale(3,3);
                var { width: ew, height: eh } = enemy;
                const mainBody = Bodies.rectangle(0,0, ew * 2, eh*1.5, {
                  chamfer: { radius: 10 }
                });
                var cB = Body.create({
                  parts: [
                    mainBody,
                  ],
                  frictionStatic: 0,
                  frictionAir: 0,
                  friction: 0,
                  // The offset here allows us to control where the sprite is placed relative to the
                  // matter body's x and y - here we want the sprite centered over the matter body.
                  // Overwritten by future setOrigin..
                  render: { sprite: { xOffset: 0.5, yOffset: 0.5 } }
                });
                enemy.setExistingBody(cB).setFixedRotation();
                enemy.x = enemyArray[i].x*3;
                enemy.y = enemyArray[i].y*3 + 155 - enemyArray[i].height;

                this.enemies.push(enemy);
                //console.log(enemy.x + " " + enemy.y);
                //console.log(player.x + " " + player.y);
                enemy.setOrigin(0.5,0.6);
                enemy.setSize(16,16);
                enemy.body.centerOffset.y = 15;
                //enemy.body.setPushable(false);
                enemy.setData('isHit', Boolean(0));      
                enemy.setData('health', 30);            
                enemyrun(enemy);      
        }
  
        
        player.setData('isHit', Boolean(0));
        player.setData('Player', Boolean(1));

        
        //this.matter.add.collider(this.enemies, solidMap);
        solidMap.setCollisionByExclusion([-1]);
        this.matter.world.convertTilemapLayer(solidMap);


       // this.matter.add.collider(this.enemies, player, hitEntity, null, this);
        
        //display health
        var txt = this.add.text(0, 0, '100');
        txt.setScrollFactor(0);
        
        var SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.hitEntity = async function(collision){

            var entity = collision.gameObjectA;
            var attacker = collision.gameObjectB

            if (entity.getData('isHit'))
                return;

            entity.setData('isHit', Boolean(1));

                            
            if(entity.getData("Player")) {
                health-=10;
                txt.text = health;

            } else {
                entity.setData("health",entity.getData("health")-10);
                if(entity.getData("health") <= 0) {
                    entity.destroy();
                    return;
                }
            }

            entity.setVelocityX((attacker.x-entity.x)*0.5);
            entity.setVelocityY(-10);
            
            
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

            this.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: this.enemies,
                callback: this.hitEntity,
                context: this
            });

            this.checkHitRight = function(collision) {
                if(attackInput.isDown()) {
                    if(!player.flipX) {
                        this.hitEntity(collision);
                    }
                }
            }
            this.checkHitLeft = function(collision) {
                if(attackInput.isDown()) {
                    if(player.flipX) {
                        this.hitEntity(collision);
                    }
                }
            }

            this.matterCollision.addOnCollideActive({
                objectA: this.enemies,
                objectB: player.left,
                callback: this.checkHitLeft,
                context: this
            });

            this.matterCollision.addOnCollideActive({
                objectA: this.enemies,
                objectB: player.right,
                callback: this.checkHitRight,
                context: this
            });


        // Player collider has been created- put all collisions here.
        this.matterCollision.addOnCollideActive({
            objectA: player.mainBody,
            objectB: this.doors,
            callback: doorOpen,
            context: this
        });

        this.matterCollision.addOnCollideEnd({
            objectA: player.mainBody,
            objectB: this.doors,
            callback: doorLeave,
            context: this
        });

        function doorLeave(collision) {
            scoreText.setVisible(false);
        }

        var EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        var usedDoor = false;
        // Each door is mapped to the next door down and up.
        function doorOpen(collision) {
            scoreText.x = player.x - 100;
            scoreText.y = player.y + 50;
            scoreText.setVisible(true);
            //console.log(collision);
            if(EnterKey.isDown && !usedDoor) {
                console.log("Using door!");
                usedDoor = true;
                player.x = collision.gameObjectB.getData('teleport')[0];
                player.y = collision.gameObjectB.getData('teleport')[1];
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
        this.buttons = [];
        var buttonArray = [];
        try {
        buttonArray = map.getObjectLayer('Buttons').objects;
        } catch(e) {
            console.log("No buttons in this map.");
        }
        for(var i = 0; i < buttonArray.length; i++) {
            //console.log(buttonArray[0]);
            var buttonObject = this.matter.add.image(buttonArray[i].x*3, buttonArray[i].y*3 + 200 - buttonArray[i].height, 'button-up').setScale(3,3);
            buttonObject.body.isStatic = true;
            this.buttons.push(buttonObject);
            buttonObject.setSize(50,50);
            buttonObject.setData('order', buttonArray[i].properties[0].value);
            buttonObject.setData('isDown', false);
            //console.log(buttonObject);
        }
        //this.matter.add.collider(player, this.buttons,buttonPress,null,this);
        this.matterCollision.addOnCollideActive({
            objectA: player.bottom,
            objectB: this.buttons,
            callback: buttonPress,
            context: this
        });

        // Each door is mapped to the next door down and up.
        function buttonPress(collision) {
            var button = collision.gameObjectB;
            //console.log(button);
            
                button.setSize(50,25);
                button.setTexture('button-down');
                //console.log("on botton");
                // Timed button up!
                if(!button.getData('isDown')) {
                    // Check if other buttons are pressed in correct order
                    //console.log(this.buttons);
                    var currentOrder = button.getData('order');
                    for(var i = 0; i < this.buttons.length; i++) {
                        var compareButton = this.buttons[i];
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
        function resetAllButtons() {
            for(var i = 0; i < ref.buttons.length; i++) {
                var compareButton = ref.buttons[i];
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
                        if(ref.matter.overlap(player, button)) {
                            player.setVelocityY(-20);
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
        //this.matter.add.collider(player,solidMap,onGround,null,this);
        /*this.matterCollision.addOnCollideStart({
            objectA: player,
            objectB: solidMap,
            callback: onGround,
            context: this
          });*/
        
        // Overlap
        scoreText = this.add.text(0, 0, 'Press Enter', { fontSize: '32px', fill: '#FFFFFF' });
        scoreText.setVisible(false);

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


        this.enemies.forEach(enemy => {
            enemy.anims.play("enemywalk");
        });
        //enemy.anims.play("enemywalk");
                
        
        /*this.input.keyboard.on('keydown-ENTER', function (event) {
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
        });*/
        
        this.input.keyboard.on('keydown-G', function (event) {   
            // GOD-MODE
            godMode = !godMode;
            player.body.allowGravity = godMode;
            console.log("Godmode has been " + (godMode ? "enabled" : "disabled") );
        });

        this.input.keyboard.on('keydown-ESC', function (event) {   
            panel.setVisible(false);
        });

        savedCameraPos = this.cameras.main.scrollX;

    }

    update() {

        // PARALLAX EFFECT
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


        // PLAYER MOVEMENT       
        if(!player.onGround)
            player.anims.play('jump',true);
        
        if(leftInput.isDown()) {
            player.flipX = true;
            player.setVelocityX(-5);
            if(player.onGround&& !attackInput.isDown())
            player.anims.play('walk',true);
        } else if(rightInput.isDown()) {
            player.flipX = false;
            player.setVelocityX(5);
            if(player.onGround&& !attackInput.isDown())
            player.anims.play('walk',true);
        } else {
            player.setVelocityX(0);
            if(player.onGround && !attackInput.isDown())
            player.anims.play('stand');
        }

        if(jumpInput.isDown() && player.onGround) {
            player.setVelocityY(-10);
            player.anims.play('jump', true);
        }

        if(attackInput.isDown()) {
            player.setSize(32, 16);
            player.anims.play('attack',true);
            // Attack
            //if(this.matter.overlap(this.enemies,player, this.hitEntity, null, this))
            //    console.log("WTHAT");
        } else {
            player.setSize(16, 16);
        }
        



        // FUTURE - Enemy movement.
        /*vialsT = this.matter.overlap(player, this.doors);
        if (vialsT){
            scoreText.setVisible(true);
            scoreText.x = player.x - 100;
            scoreText.y = player.y + 50;
        }
        else{
            scoreText.setVisible(false);
        }*/
        
        
        
        
        }

    }

// ACTUAL GAME START
// The previous classes have defined the scenes,
// and here, the game is actually loaded and started.
var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 570,
    pixelArt: true,
    physics: { default: "matter", 
    matter:{
        debug: {
            showBody: true,
            showStaticBody: true
        }
    }},
    plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin.default, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }
        ]
      },
    scene: [
        LoadAssets,
        InGame        
    ],
};

var game = new Phaser.Game(config);





    
