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
var timeText;
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
var healthLevel = 0;





var powerup = 100;
var poweruplevel = 0;






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
        
        // Hearts
        this.load.image('hearts-full', 'assets/icons/hearts-full.png');
        this.load.image('hearts-empty', 'assets/icons/hearts-empty.png');
        this.load.image('hearts-half', 'assets/icons/hearts-half.png');
        
        
        //powerups
        this.load.image('powerup-cup', 'assets/powerups/cup.png');
        this.load.image('powerup-potion', 'assets/powerups/potion.png');
        this.load.image('powerup-shield', 'assets/powerups/shield.png');
        
        // Misc.
        this.load.image("tiles","assets/tilesets/lab/lab.png");
        this.load.image("door","assets/maps/door.png");
        this.load.image("elevator","assets/tilesets/lab/elevator.png");
        this.load.image("button-up","assets/tilesets/lab/button.png");
        this.load.image("button-down","assets/tilesets/lab/buttondown.png");
        this.load.image("wrong","assets/icons/03.png");
        this.load.image("right","assets/icons/30.png");
        this.load.image("question","assets/icons/06.png");
        this.load.spritesheet('portal', 'assets/spritesheets/time.png',{frameWidth:100, frameHeight: 100});
        this.load.spritesheet('pumpkin-dude', 'assets/spritesheets/pumpkin spritesheet.png',{frameWidth:18, frameHeight: 34});
        this.load.spritesheet('scientist', 'assets/spritesheets/scientist.png',{frameWidth:190, frameHeight: 285});

        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
        
        // Tiles
        this.load.image("level1-tiles","assets/tilesets/custom/level1.png");
        this.load.image("level2-tiles","assets/tilesets/custom/level2.png");

        // Maps
        this.load.tilemapTiledJSON('level1-map',"assets/maps/level1.json");
        this.load.tilemapTiledJSON('level2-map',"assets/maps/level2.json");

        // Backgrounds
        this.load.image('level1-back', 'assets/maps/transparent.png');
		this.load.image('level1-middle', 'assets/maps/transparent.png');
		this.load.image('level1-front', 'assets/maps/transparent.png');
        this.load.image('level2-back', 'assets/maps/transparent.png');
        this.load.image('level1-background', 'assets/maps/Level1 Background.png');
		this.load.image('level2-middle', 'assets/maps/transparent.png');
		this.load.image('level2-front', 'assets/maps/transparent.png');
        this.load.image('level2-background', 'assets/maps/Level2 Background.png')
   
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
        
        
        
        //  Load the Google WebFont Loader script
                
        /*WebFontConfig = {

            active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

            google: {
            families: ['Revalia']
            }

        };*/

    }
    

    create() {

        // Remember, everything in the create() displays chronologically.

        // Map Structure and Map Array - ALL LOWERCASE.
        // The naming system is consistently enforced-
        // mapname-tiles, mapname-back, etc.
        class Map {
            constructor(name,offset1,offset2,offset3,scale, playerSpawnX, playerSpawnY) {
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
                this.playerSpawnX = (playerSpawnX === undefined) ? 0 : playerSpawnX;
                this.playerSpawnY = (playerSpawnY === undefined) ? 0 : playerSpawnY;
                this.back0 = name + "-background";
            }
        }
        const mapArray = [
            new Map("level1",400,600,600, 3, 600,600),
            new Map("level2",400,600,725, 3, 4200, 400)
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
        const strName = currentMap.name + '-background';
        console.log(strName);
        this.add.image(2400, 1250, strName).setScale(3,3);
        const map = this.make.tilemap({ key: currentMap.mapName});
        const tileset = map.addTilesetImage(currentMap.name,currentMap.tilesetName);
        const backMap = map.createLayer("Background", tileset, 0, 200);
        const foreMap = map.createLayer("Foreground", tileset, 0, 200);
        const solidMap = map.createLayer("Solid", tileset, 0, 200);
        const doorMap = map.createLayer("Door", tileset, 0, 200);
        const ladderMap = map.createLayer("Ladder", tileset, 0, 200);
        

        const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
        
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

        function onGround(collision) {
            // Detecting onGround for jumping
            if(!collision.bodyB.isSensor)
                player.onGround = true;
            // Detecting sensor ladder.
            else {
                if(rightInput.isDown() || leftInput.isDown())
                    player.allowGravity = true;
                if(jumpInput.isDown()) {
                    player.allowGravity = false;
                    player.setVelocityY(-5);
                }
            }
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
        
        player.x = currentMap.playerSpawnX;
        player.y = currentMap.playerSpawnY;


        player.setDepth(5);

        
        // FUTURE- These are VERY similar functions for getting objects.
        // Write a method to automatically do most of the work.

        this.doors = [];
        var doorArray = [];
        try {
            doorArray = map.getObjectLayer('Doors').objects;
        } catch (e) {
            console.log("No doors in this map.");
        }
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

        this.elevators = [];
        var elevatorArray = [];
        var elevatorInteracting = false;
        try {
            elevatorArray = map.getObjectLayer('Elevators').objects;
        } catch (e) {
            console.log("No elevators in this map.");
        }
        for(var i = 0; i < elevatorArray.length; i++) {
            var elevatorObject = this.matter.add.image(0,0, 'elevator').setScale(3,3);
            // Recreate door collider
            var { width: ew, height: eh } = elevatorObject;
            var mainBody = Bodies.rectangle(0,0, ew * 2, eh*0.9, {
                  chamfer: { radius: 10 },
            });
            var upperBody = Bodies.rectangle(0,-280, ew * 2, eh*0.5, {
                chamfer: { radius: 10 },
            });
            var interactBody = Bodies.rectangle(0,-50, ew * 0.5, eh*0.5, {
                isSensor: true
            });
            var cB = Body.create({
                  parts: [
                    mainBody,
                    upperBody,
                    interactBody
                  ],
                  frictionStatic: 0,
                  frictionAir: 0,
                  friction: 0,
                  // The offset here allows us to control where the sprite is placed relative to the
                  // matter body's x and y - here we want the sprite centered over the matter body.
                  // Overwritten by future setOrigin..
                  render: { sprite: { xOffset: 0.5, yOffset: 0.5 } }
            });
            elevatorObject.setExistingBody(cB).setFixedRotation();
            elevatorObject.x = elevatorArray[i].x*3;
            elevatorObject.y = elevatorArray[i].y*3 + 155 - elevatorArray[i].height;
            elevatorObject.setOrigin(0.5,0.6);
            elevatorObject.active = false;
            elevatorObject.body.allowGravity = false;
            elevatorObject.body.isStatic = true;
            console.log(elevatorObject);
            elevatorObject.target = elevatorObject.y - elevatorArray[i].properties[0].value;
            elevatorObject.down = false;
            elevatorObject.number = i;
            elevatorObject.setDepth(10);
            this.elevators.push(elevatorObject);
            if(elevatorArray[i].properties[0].value < 0) 
                elevatorObject.down = true;

            this.matterCollision.addOnCollideActive({
                objectA: player.bottom,
                objectB: elevatorObject,
                callback: elevatorInteract,
                context: this
              });

            this.matterCollision.addOnCollideEnd({
                objectA: player.bottom,
                objectB: elevatorObject,
                callback: elevatorLeave,
                context: this
              });

            this.elevators.push(elevatorObject);
        }

        function elevatorLeave() {
            scoreText.setVisible(false);
        }

        function elevatorInteract(collision) {
            if(elevatorInteracting)
                return;
            if(collision.gameObjectB.active) {
                scoreText.x = player.x - 100;
                scoreText.y = player.y + 50;
                scoreText.setVisible(true);
                if(EnterKey.isDown) {
                    if(!elevatorInteracting) {
                        elevatorMove(collision.gameObjectB);
                        scoreText.setVisible(false);
                        elevatorInteracting = true;
                    }
                    //collision.gameObjectB.setVelocityY(-5);
                }
            }
        }

        var chosenElevator;

        async function elevatorMove(elevatorObject){ 
            chosenElevator = elevatorObject;
        }    

        this.events.on("update", checkElevator, this);
        function checkElevator() {
            if(!elevatorInteracting)
                return;
            if(chosenElevator.down)
                if(chosenElevator.target > chosenElevator.y)
                    chosenElevator.y++;
                else {
                    elevatorInteracting = false;
                    console.log(chosenElevator.target);
                    console.log(chosenElevator.y);
                    chosenElevator.target = chosenElevator.y + elevatorArray[chosenElevator.number].properties[0].value;
                    chosenElevator.down = false;
                    console.log(chosenElevator);
                }
            else
                if(chosenElevator.target < chosenElevator.y)
                    chosenElevator.y--;
                else {
                    elevatorInteracting = false;
                    console.log(chosenElevator.target);
                    console.log(chosenElevator.y);
                    chosenElevator.target = chosenElevator.y - elevatorArray[chosenElevator.number].properties[0].value;
                    chosenElevator.down = true;
                    console.log(chosenElevator);
                }
        }


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
                var enemySprite = enemyArray[i].properties[0].value;
                var scale = enemyArray[i].properties[1].value;
                var enemy = this.matter.add.sprite(0,0,enemySprite).setScale(scale,scale);
                var { width: ew, height: eh } = enemy;
                const mainBody = Bodies.rectangle(0,0, ew * (scale * (0.66)), eh*(scale * 0.5), {
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
                enemy.enemySprite = enemySprite;

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

        
        solidMap.setCollisionByExclusion([-1]);
        ladderMap.setCollisionByExclusion([-1]);
        this.matter.world.convertTilemapLayer(ladderMap, {isSensor:true,isStatic:true});
        this.matter.world.convertTilemapLayer(solidMap);


        
        //display health
        //var txt = this.add.text(0, 0, '100');
        //txt.setScrollFactor(0);


        var healthbar = this.add.group();

        // Player starts with 3 hearts.
        // Each are evenly spaced apart, starting at 30,
        // with a width of 50. They are accessed by the hearts array.
        var hearts = Array();
        function createHeart() {

            var heart = healthbar.create(40 + hearts.length*60,30, 'hearts-full');

            heart.setScale(3.2, 3.2);
            hearts.push(heart);
            heart.setScrollFactor(0);
        };

        for (let i = 0; i < healthLevel + 3; i++) {
            createHeart();
        }
        
        
        
        
        
        
        
        
        var powerupbar = this.add.group();
                
        var powerups = [];
        var powerupArray = [];
        
        
        var cup = this.matter.add.image(500 + powerups.length*50, 30,'powerup-cup').setScale(3.2,3.2);
        var potion = this.matter.add.image(500 + powerups.length*50, 30, 'powerup-potion').setScale(3.2,3.2);
        var shield = this.matter.add.image(500 + powerups.length*50, 30, 'powerup-shield').setScale(3.2,3.2);  
        
        powerups.push(cup);
        powerups.push(potion);
        powerups.push(shield);

        cup.type = "powerup-cup";
        potion.type = "powerup-potion";
        shield.type = "powerup-shield";
        
        
        function createPowerUp(collision){
            
            //addPowerup(collision.gameObjectB.type);
            collision.gameObjectB.destroy();
            var powerup = powerupbar.create(750 - powerups.length*50, 30, collision.gameObjectB.type);
            console.log(collision.gameObjectB.type);
            powerup.setScale(3.2, 3.2);
            powerups.push(powerup);
            powerup.setScrollFactor(0);  
            
        };
        
        
        this.matterCollision.addOnCollideActive({
            objectA: player,
            objectB: powerups,
            callback: createPowerUp,
            context: this
        });
        
        
        


    
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        


        var SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        
        this.hitEntity = async function(collision){

            var entity = collision.gameObjectA;
            var attacker = collision.gameObjectB

            if (entity.getData('isHit'))
                return;

            entity.setData('isHit', Boolean(1));

                            
            if(entity.getData("Player")) {
                health-=10;
                //txt.text = health;

                // First, choose the right heart to act on-
                var divider = 100 / hearts.length;
                // Need to work this out to work with "bigger health hits".
                var chosenIndex = Math.floor(hearts.length * ((health + 10) / 100.0));
                // Math might be a little off- fix later
                if (chosenIndex >= hearts.length) chosenIndex = hearts.length - 1;

                if (health < chosenIndex * divider + divider / 2) {
                    hearts[chosenIndex].setTexture('hearts-half');
                }
                if (health <= chosenIndex * divider) {
                    hearts[chosenIndex].setTexture('hearts-empty');
                }


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
                this.cameras.main.midPoint.y = player.y + 300;
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
        var buttonDisplay;
        var answerCount = 0;
        var puzzleBeat = false;
        try {
        buttonArray = map.getObjectLayer('Buttons').objects;
        } catch(e) {
            console.log("No buttons in this map.");
        }
        for(var i = 0; i < buttonArray.length; i++) {
            if(Math.floor(buttonArray.length / 2) == i) {
                // Spawn button display
                console.log("spawned display");
                buttonDisplay = this.add.image(buttonArray[i].x*3, buttonArray[i].y*3 - 20 - buttonArray[i].height, 'question').setScale(3,3);
            }
            //console.log(buttonArray[0]);
            //var buttonObject = this.matter.add.image(buttonArray[i].x*3, buttonArray[i].y*3 + 200 - buttonArray[i].height, 'button-up').setScale(3,3);
            
            var button = this.matter.add.sprite(0,0,'button-up').setScale(3,3);
            var { width: ew, height: eh } = button;
            var mainBody = Bodies.rectangle(0,0, ew * (scale * (4.66)), eh*(scale * 4.5), {
              //chamfer: { radius: 10 }
            });
            var sideBody = Bodies.polygon(-20,3, 3, 10, {
                //chamfer: { radius: 10 }
              });
            var sideBody1 = Bodies.polygon(20,3, 3, -10, {
                //chamfer: { radius: 10 }
              });
            var cB = Body.create({
              parts: [
                mainBody,
                sideBody,
                sideBody1
              ],
              frictionStatic: 0,
              frictionAir: 0,
              friction: 0,
              // The offset here allows us to control where the sprite is placed relative to the
              // matter body's x and y - here we want the sprite centered over the matter body.
              // Overwritten by future setOrigin..
              render: { sprite: { xOffset: 0.5, yOffset: 0.5 } }
            });
            button.setExistingBody(cB).setFixedRotation();
            button.setOrigin(0.5,0.6);
            button.x = buttonArray[i].x*3;
            button.y = buttonArray[i].y*3 + 200 - buttonArray[i].height;
            button.body.isStatic = true;
            button.setDepth(1);
            this.buttons.push(button);
            //buttonObject.setSize(50,50);
            button.setData('order', buttonArray[i].properties[0].value);
            button.setData('isDown', false);
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
                
            if(answerCount >= buttonArray.length * buttonArray.length) {
                console.log("Puzzle solved");
                buttonDisplay.setTexture('right');
                // execute a win function- beware, it will execute multiple times here---
                if(!puzzleBeat) {
                    puzzleBeat = true;
                    // WON THE PUZZLE-
                    this.elevators[0].active = true;
                }
                return;
            } else 
                buttonDisplay.setTexture('question');
                
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
                            answerCount++;
                            //buttonDisplay.setTexture('question');
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
            answerCount = 0;
        }
        async function buttonReset(button) {
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        button.setSize(50,50);
                        button.setData('isDown', false);
                        button.setTexture('button-up');
                        buttonDisplay.setTexture('wrong');
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
        
        
        this.anims.create({
            key: 'portalPlay',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 60 }),
            frameRate: 100,
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
        scoreText = this.add.text(0, 0, 'Press Enter', { fontSize: '32px', fill: '#FFFFFF', font:'Revalia' });
        scoreText.setVisible(false);
        timeText = this.add.text(0, 0, 'Press B to go\nback in time...', { fontSize: '32px', fill: '#FFFFFF' });
        timeText.setVisible(false);

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
        ];

        animations.forEach(anim => { 
            addAnimation(anim)
        });

        // Create a start animation for our player.
        player.anims.play("stand");

        this.enemies.forEach(enemy => {
            // Grab enemy animation
            if(!enemy.anims.animationManager.anims.entries.hasOwnProperty(enemy.enemySprite))
                addAnimation(new Anim(enemy.enemySprite,10,-1,enemy.enemySprite,0,7));
        
            enemy.anims.play(enemy.enemySprite);
        });
                
        
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
        var tempCol;
        this.input.keyboard.on('keydown-G', function (event) {   
            // GOD-MODE
            godMode = !godMode;
            player.body.allowGravity = godMode;
            if(godMode)
                tempCol = player.body.collisionFilter;
            player.body.collisionFilter = (godMode ? {} : tempCol);
            console.log("Godmode has been " + (godMode ? "enabled" : "disabled") );
        });
        
        function backInTime() {
            health = 100;
            ref.scene.restart();
        }
        
        this.input.keyboard.on('keydown-B', function (event) {   
            backInTime();
        });

        this.input.keyboard.on('keydown-ESC', function (event) {   
            panel.setVisible(false);
        });

        savedCameraPos = this.cameras.main.scrollX;


        // MISC
        // Future- special map modifiers
        if(currentMap == mapArray[0]) {
            this.add.text(345, 875, 'Use the right and\nleft arrow keys\nto move.\n\nUse the up arrow\nkey to jump.', { fontSize: '32px', fill: '#FFFFFF', font: 'Revalia' });
            this.add.text(1135, 975, 'To Interact', { fontSize: '32px', fill: '#FFFFFF', font: 'Revalia' });
            this.add.text(3850, 2400, 'Press Space to attack.', { fontSize: '32px', fill: '#FFFFFF' , font: 'Revalia'});
            this.add.text(3550, 1990, 'Interact with the environment\n to solve puzzles.', { fontSize: '32px', fill: '#FFFFFF', font: 'Revalia' });
            this.add.text(495, 2150, 'You found the\ntime machine!', { fontSize: '32px', fill: '#FFFFFF', font: 'Revalia' });
            var portal = this.matter.add.sprite(290,1950, 'portal').setScale(2,2);
            portal.body.isSensor = true;
            portal.body.isStatic = true;
            //portal.body.setSize(100, 50, 50, 25);
            portal.setDepth(0);
            portal.anims.play("portalPlay");
            this.cameras.main.setBackgroundColor('0x808080');

            this.matterCollision.addOnCollideActive({
                objectA: player.bottom,
                objectB: portal.body,
                callback: portalEnter,
                context: this
            });
            function portalEnter() {
                currentMapNum = 1;
                // Scene reset variables
                health = 100;
                this.scene.restart();
            }
        }

        

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
        if(!player.onGround && !attackInput.isDown())
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
            player.anims.play('attack',true);
        }
        
        if(health <= 0) {
            // Scene reset variables
            timeText.x = player.x - 100;
            timeText.y = player.y + 50;
            timeText.setVisible(true);
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('stand');
        }
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
