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
var currentPowerups = [];
var block;
var blockT = false;
var tempMap;

        // Checkpoint, for any death function usage.
        var lastCheckpoint;



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
        this.load.image('powerup-keycard', 'assets/powerups/key_01c.png');
        this.load.image('powerup-coin', 'assets/powerups/coin_01d.png');
        
        // Misc.
        this.load.image("tiles","assets/tilesets/lab/lab.png");
        this.load.image("door","assets/maps/door.png");
        this.load.image("elevator","assets/tilesets/lab/elevator.png");
        this.load.image("button-up","assets/tilesets/lab/button.png");
        this.load.image("button-down","assets/tilesets/lab/buttondown.png");
        this.load.image("wrong","assets/icons/03.png");
        this.load.image("right","assets/icons/30.png");
        this.load.image("question","assets/icons/06.png");
        this.load.image("interact","assets/icons/interact.png");
        this.load.spritesheet('portal', 'assets/spritesheets/time.png',{frameWidth:100, frameHeight: 100});
        this.load.spritesheet('pumpkin-dude', 'assets/spritesheets/pumpkin spritesheet.png',{frameWidth:18, frameHeight: 34});
        this.load.spritesheet('scientist', 'assets/spritesheets/scientist.png',{frameWidth:190, frameHeight: 285});
        this.load.image('pillar', 'assets/maps/pillar.png')

        this.load.tilemapTiledJSON('map',"assets/maps/tilemap.json");
        
        // Tiles
        this.load.image("level1-tiles","assets/tilesets/custom/level1.png");
        this.load.image("level2-tiles","assets/tilesets/custom/level2.png");
        this.load.image("bosslevel-tiles","assets/tilesets/custom/bosslevel.png");


        // Maps
        this.load.tilemapTiledJSON('level1-map',"assets/maps/level1.json");
        this.load.tilemapTiledJSON('level2-map',"assets/maps/level2.json");
        this.load.tilemapTiledJSON('bosslevel-map',"assets/maps/bosslevel.json");


        // Backgrounds
        this.load.image('level1-back', 'assets/backgrounds/Scifi Lab/layers/back.png');
        this.load.image('level1-background', 'assets/maps/Level1 Background.png');
		this.load.image('level2-middle', 'assets/maps/transparent.png');
		this.load.image('level2-front', 'assets/maps/transparent.png');
        this.load.image('level2-back', 'assets/maps/Level2 Background.png');
        this.load.image('level1-background', 'assets/maps/Level1 Background.png');
		this.load.image('level2-middle', 'assets/maps/transparent.png');
		this.load.image('level2-front', 'assets/maps/transparent.png');
        this.load.image('level2-background', 'assets/maps/Level2 Background.png')

        
        this.load.image('block', 'assets/maps/overlap.png');   
        this.load.image("logo", "assets/title.png");
        this.load.image("play_button", "assets/play.png");
        this.load.image("options_button", "assets/options.png");
        this.load.image("hover", "assets/icons/10.png");
        
        
        
        
        
        
    
        
        this.load.image('bosslevel-back', 'assets/maps/transparent.png');
		this.load.image('bosslevel-middle', 'assets/maps/transparent.png');
		this.load.image('bosslevel-front', 'assets/maps/transparent.png');

   
    }
    create () {
        this.scene.start("MainMenu");
    }
}




class MainMenu extends Phaser.Scene{
	constructor(){
		super("MainMenu")
	};

	preload(){
        /*let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff // white
            }
        })
        
        this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height/2, this.game.renderer.width * percent);
            console.log(percent)
        })
        
        this.load.on("complete", ()=>{
            console.log("done")
        })*/
    }

    create(){
        
        var rref = this;
        
        rref.add.image(0, 0, "level1-back").setOrigin(0).setScale(4);
        
        rref.add.image(rref.sys.game.config.width/2, rref.sys.game.config.height/2-100, "logo");
        
        let playButton = rref.add.image(rref.sys.game.config.width/2, rref.sys.game.config.height/2+50, "play_button").setScale(0.25);
        
        var hoverSprite = rref.add.image(100, 100, "hover").setScale(2);
        hoverSprite.setVisible(0);
        
        
        playButton.setInteractive();
        
        playButton.on("pointerover", ()=>{
            hoverSprite.setVisible(1);
            hoverSprite.x = playButton.x - 150;
            hoverSprite.y = playButton.y;
        })
        
        playButton.on("pointerout", ()=>{
            hoverSprite.setVisible(0);
         }) 
        
        playButton.on("pointerdown", ()=>{
            rref.scene.start("InGame");
        })
	}

	update(){	
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
        
        
        //Fonts
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        
    }
    

    create() {

        
        
        
        
        
        
        // Reference, used for nested functions
        var ref = this;



        // Fonts

        WebFont.load({
            google: {
                families: [ 'Press Start 2P' ],
            },
        });

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
            new Map("level2",400,600,725, 3, 440, 2300),
            new Map("bosslevel",400,600,725, 3, 8000, 200),
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
        //const strName = currentMap.name + '-background';
        //console.log(strName);
        //this.add.image(2400, 1250, strName).setScale(3,3);
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
 

        //block = this.add.image(3050, 970, 'block').setScale(3, 3);
        block = Bodies.rectangle(3050, 970, 100, 100, {
              isStatic: true,
              isSensor: true
        });
        
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
            else if (collision.bodyB.isLadder) {
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


        // Checkpoint--
        if(lastCheckpoint !== undefined) {
            player.x = lastCheckpoint.x;
            player.y = lastCheckpoint.y;
        }
          

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
            createQuery(doorObject.x,doorObject.y);
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
            //scoreText.setVisible(false);
        }

        function elevatorInteract(collision) {
            if(elevatorInteracting)
                return;
            if(collision.gameObjectB.active) {
                scoreText.x = player.x - 100;
                scoreText.y = player.y + 50;
                //scoreText.setVisible(true);
                if(EnterKey.isDown) {
                    if(!elevatorInteracting) {
                        elevatorMove(collision.gameObjectB);
                        //scoreText.setVisible(false);
                        collision.gameObjectB.query.destroy();
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
                    chosenElevator.query = createQuery(chosenElevator.x,chosenElevator.y);
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
                    chosenElevator.query = createQuery(chosenElevator.x,chosenElevator.y);
                    console.log(chosenElevator);
                }
        }


        // Different Types of Enemy AIs

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

        async function enemyfollow(badGuy){
            var distance = badGuy.x - player.x;
            badGuy.flipX = distance > 0;
            badGuy.setVelocityX(Math.random()*(1.5) * (badGuy.flipX ? 1 : -1) + (badGuy.flipX ? -2 : 2));
            badGuy.body.velocity.y = Math.random()*5;
                
                await new Promise((r) =>
                    setTimeout(
                    () =>
                    new (function () {
                        // Be random or seek
                        enemyfollow(badGuy);
                        })(),
                (Math.random()*1000+1000)
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
                var detectionBody = Bodies.rectangle(0,0, ew * (scale * (6.66)), eh*(scale * 2.5), {
                    isSensor: true
                  });
                var cB = Body.create({
                  parts: [
                    mainBody
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

                // The type of Enemy AI is decided here-
                // EnemyRun is just a mindless back and forth script.
                // EnemyFollow will follow player until a cooldown, which will reset if they hit.
                if(enemyArray[i].properties[2].value == 0)
                    enemyrun(enemy);
                else 
                    enemyfollow(enemy);

        }
  
        
        player.setData('isHit', Boolean(0));
        player.setData('Player', Boolean(1));

        
        solidMap.setCollisionByExclusion([-1]);
        ladderMap.setCollisionByExclusion([-1]);
        this.matter.world.convertTilemapLayer(ladderMap, {isSensor:true,isStatic:true,isLadder:true});
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
        
        try {
            powerupArray = map.getObjectLayer('Powerups').objects;
        } catch (e) {
            console.log("No powerups in this map!");
        }
        for(var i = 0; i < powerupArray.length; i++) {
        
            var powerupName = powerupArray[i].properties[0].value;
            var powerup = this.matter.add.image(500 + powerups.length*50, 30,powerupName).setScale(3.2,3.2);
            powerups.push(powerup);
            powerup.type = powerupName;
            
            
            
            //potion powerup
            if (powerup.type == "powerup-potion"){
                this.matterCollision.addOnCollideStart({
                    objectA: player.mainBody,
                    objectB: powerups,
                    callback: health+=50,
                    context: this
                });
                
            }
            
            
            
            

            powerup.x = powerupArray[i].x*3;
            powerup.y = powerupArray[i].y*3 + 155 - powerupArray[i].height;

        }

        // Between levels
        for(var i = 0; i < currentPowerups.length; i++) {
            var powerup = powerupbar.create(610 - i*50, 30, currentPowerups[i]);
            powerup.setScale(3.2, 3.2);
            powerup.setScrollFactor(0);  
        }
        
        
        function createPowerUp(collision){
            
            //addPowerup(collision.gameObjectB.type);
            collision.gameObjectB.destroy();
            var powerup = powerupbar.create(610 - currentPowerups.length*50, 30, collision.gameObjectB.type);
            console.log(collision.gameObjectB.type);
            powerup.setScale(3.2, 3.2);
            console.log(collision.gameObjectB.type);
            currentPowerups.push(collision.gameObjectB.type);
            powerup.setScrollFactor(0);  
            
        };
        
        
        this.matterCollision.addOnCollideActive({
            objectA: player,
            objectB: powerups,
            callback: createPowerUp,
            context: this
        });
        
        
        
        
        
        
        
        
        
        
        
        
        /*
        Useful sometimes- a small timed event that functions like an Update Loop

        var timedEvent

        if(timedEvent == null)
        timedEvent = ref.time.addEvent({ delay: 1000, callback: executing, callbackScope: this, loop: true });
        
        if(timedEvent != null)
        timedEvent.destroy();
        */

    
        function createQuery(x,y) {

            var query = ref.matter.add.image(x, y, 'interact').setScale(2.2,2.2);
            query.body.isStatic = true;
            query.body.isSensor = true;

            var mainBody = Bodies.rectangle(x,y, 700, 400, {
                isSensor:true,
                isStatic:true
            });
            var cB = Body.create({
            parts: [
                mainBody,
            ],
            });
            query.setExistingBody(cB).setFixedRotation();
            query.body.isStatic = true;
            query.body.isSensor = true;
            query.alpha = 0;
            
            function executing(collision) {
                var distance = Math.abs(collision.gameObjectA.x - collision.gameObjectB.x);
                collision.gameObjectB.alpha = 1 - 0.75 * (distance / 100);
            }
    
            ref.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: query,
                callback: executing,
                context: this
            });

            return query;
            
        }
        
        
        
        
        
        
        
        
        
        


        var SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        
        this.hitEntity = async function(collision){

            var entity = collision.gameObjectA;
            var attacker = collision.gameObjectB

            if (entity.getData('isHit'))
                return;

            entity.setData('isHit', Boolean(1));

                            
            if(entity.getData("Player")) {
                health-=10;
                
                
                
                //shield powerup
                if ("powerup-shield" in currentPowerups){
                    health+=3
                };
                
                
                
                
                
                
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

            entity.setVelocityX((attacker.x-entity.x)*-0.05);
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

            this.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: block,
                callback: this.blockOverlap,
                context: this
            });
            this.matterCollision.addOnCollideEnd({
                objectA: this.block,
                objectB: player.mainBody,
                callback: this.blockOverlapEnd,
                context: this
            });
        
            
            var xB = 0;
            var yB = 0;
            if(currentMapNum == 0){
                xB = 3050;
                yB = 950;
            } else if(currentMapNum == 1){
                xB = 3125;
                yB = 2300;
            }
            var doorPrompt = this.matter.add.image(xB, yB, 'block').setScale(2,2);
            doorPrompt.body.isStatic = true;
            doorPrompt.body.isSensor = true;

            this.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: doorPrompt,
                callback: doorPromptFunction,
                context: this
            });
            
            this.matterCollision.addOnCollideEnd({
                objectA: player.mainBody,
                objectB: doorPrompt,
                callback: falseBool,
                context: this
            });

            function doorPromptFunction() {
                blockT = true;
                var textB = '';
                if(textB == ''){
                    if(currentMapNum == 0){
                        textB = this.add.text(3150, 800, 'You need\na key!', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
                    }
                }
                var power = 'powerup-keycard';
                if(currentMapNum == 1){
                    power = 'powerup-coin';
                }
                if(currentPowerups.includes(power)) {
                    doorPrompt.destroy();
                    //textB.setText('');
                    blockT = false;
                };
            }
            
            function falseBool() {
                blockT = false;
            }
        
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
            //scoreText.setVisible(false);
        }

        var EnterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        var usedDoor = false;
        // Each door is mapped to the next door down and up.
        function doorOpen(collision) {
            //scoreText.x = player.x - 100;
            //scoreText.y = player.y + 50;
            //scoreText.setVisible(true);
            //console.log(collision);
            if(EnterKey.isDown && !usedDoor && !blockT) {
                console.log("Using door!");
                //this.cameras.main.fadeOut(100);
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
                        //ref.cameras.main.fadeIn(100);
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
                    if(currentMapNum == 0) {
                        this.elevators[0].active = true;
                        this.elevators[0].query = createQuery(this.elevators[0].x,this.elevators[0].y);
                    } else if(currentMapNum == 2) {
                        console.log(tempMap);

                        var tempCol = player.body.collisionFilter;
                        player.body.collisionFilter =  {};

                        resetCol(tempCol);


                        this.buttons[0].destroy();
                    }
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
                        if(ref.matter.overlap(player.mainBody, button)) {
                            player.setVelocityY(-20);
                        } 
                    })(),
                1000
            )
        );
        }


        async function resetCol(button) {
            await new Promise((r) =>
            setTimeout(
                () =>
                    new (function () {
                        player.body.collisionFilter = button;
                    })(),
                2000
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
            this.add.text(345, 875, 'Use the right and\nleft arrow keys\nto move.\n\nUse the up arrow\nkey to jump.', { fontSize: '32px', fill: '#FFFFFF' , fontFamily: 'Press-Start-2P' });
            this.add.text(1135, 975, 'To Interact', { fontSize: '32px', fill: '#FFFFFF', fontFamily: 'Press-Start-2P'});
            this.add.text(3850, 2400, 'Press Space to attack.', { fontSize: '32px', fill: '#FFFFFF' , fontFamily: 'Press-Start-2P'});
            this.add.text(3550, 1990, 'Interact with the environment\n to solve puzzles.', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
            this.add.text(495, 2150, 'You found the\ntime machine!', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
            var portal = this.matter.add.sprite(290,1950, 'portal').setScale(2,2);

            var mainBody = Bodies.rectangle(290,1950, 50, 50, {
              //chamfer: { radius: 10 }
              isStatic: true,
              isSensor: true
            });
            var cB = Body.create({
              parts: [
                mainBody
              ],
            });
            portal.setExistingBody(cB).setFixedRotation();
            portal.body.isSensor = true;
            portal.body.isStatic = true;

            this.backgroundBack.width = 640*10;
            this.backgroundBack.height = 640*10;
            this.backgroundBack.y = 50;

            //portal.body.setSize(100, 50, 50, 25);
            portal.setDepth(0);
            portal.anims.play("portalPlay");
            this.cameras.main.setBackgroundColor('0x808080');

            this.matterCollision.addOnCollideStart({
                objectA: player.mainBody,
                objectB: portal,
                callback: portalEnter,
                context: this
            });
            function portalEnter() {
                currentMapNum = 1;
                // Scene reset variables
                health = 100;
                this.scene.restart();
            }
            //falseDoor(3100, 800);
        } else if (currentMapNum == 1) {
            this.cameras.main.setBackgroundColor('0x90cfdb');
            
            this.add.text(300, 2425, 'You can always press\nB to go back in time.', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
            
            this.add.text(4260, 1250, 'Go make a wish...', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
            
            this.add.text(2180, 1300, 'Find the hidden door...', { fontSize: '32px', fill: '#FFFFFF',fontFamily: 'Press-Start-2P' });
            
            var pillar = this.matter.add.image(1150, 1400, 'pillar').setScale(3,3);
            pillar.body.isStatic = true;
            pillar.body.isSensor = true;
            
            function pillarDestroy(){
                pillar.destroy();
            }
            
            this.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: pillar,
                callback: pillarDestroy,
                context: this
            });
            
            

        
            createQuery(4170, 450);



            var portal = this.matter.add.sprite(4150,500, 'door').setScale(7,7);
            portal.body.isSensor = true;
            portal.body.isStatic = true;

            this.matterCollision.addOnCollideActive({
                objectA: player.mainBody,
                objectB: portal,
                callback: portalEnter,
                context: this
            });
            function portalEnter() {
                if(EnterKey.isDown) {
                    currentMapNum = 2;
                    // Scene reset variables
                    health = 100;
                    this.scene.restart();
                }
            }



        } else if(currentMapNum == 2) {

            tempMap = map.createLayer("TempSolid", tileset, 0, 200);
            tempMap.setScale(3,3);
            tempMap.setSize(300,3);

            tempMap.setCollisionByExclusion([-1]);
            this.matter.world.convertTilemapLayer(tempMap);
    

            // Essentials
            var bossHealth = this.add.text(270, 530, 'BOSS HEALTH', { fontSize: '15px', fill: '#FFFFFF' , fontFamily: 'Press-Start-2P' });
            bossHealth.setScrollFactor(0);

            let healthBar=makeBar(140,100,0xe74c3c);
            setValue(healthBar,100);

            var textView = this.add.text(200, 100, '', { fontSize: '32px', fill: '#FFFFFF' , fontFamily: 'Press-Start-2P' });
            textView.x =  ( this.sys.canvas.width) * .5;
            textView.setScrollFactor(0);

            // The first checkpoint puts the player past this starter text--

            // I could easily check for a checkpoint array, but it's always fun to try something (new!)
            if(player.x < 500) {
                textView.text = 'You should not be here.';

                this.cameras.main.shake(1000);

                changeText("Leave. Now.", 2000);
                changeText("Fine. Then die.", 5000);

                runFunction(function() {
                    
                    ref.cameras.main.shake(50);

                }, 5000);

                changeText("", 10000);
            } else if(player.x > 500 && player.x < 5000) {
                textView.text = "Reset from Checkpoint 1";
                changeText("", 5000);
            }


            // Set listeners for boss health at certain amounts--




        }

        // Boss script
        async function changeText(newString,ms) {
            await new Promise((r) =>
                setTimeout(
                    () =>
                        new (function () {
                            textView.text = newString;
                        })(),
                    ms
                )
            );
        }
        // Some functional programming to help async tasks
        async function runFunction(func,ms) {
            await new Promise((r) =>
                setTimeout(
                    () =>
                        new (function () {
                            func();
                        })(),
                    ms
                )
            );
        }


        
        // Checkpoint Code
        var checkpointArray = [];
        try {
            checkpointArray = map.getObjectLayer('Checkpoints').objects;
        } catch (e) {
            console.log("No checkpoints in this map.");
        }
        for(var i = 0; i < checkpointArray.length; i++) {
            var checkpoint = this.matter.add.image(checkpointArray[i].x*3, checkpointArray[i].y*3 + 85 - checkpointArray[i].height, 'door').setScale(5,5);
            checkpoint.body.isSensor = true;
            checkpoint.body.isStatic = true;

            ref.matterCollision.addOnCollideStart({
                objectA: player.mainBody,
                objectB: checkpoint,
                callback: checkpointReached,
                context: this
            });

            function checkpointReached(collision) {
                console.log("Reached checkpoint");
                lastCheckpoint = {};
                lastCheckpoint.x = collision.gameObjectB.x;
                lastCheckpoint.y = collision.gameObjectB.y;

            }
            // Used from create function underneath player POS, check if CHECKPOINT is null.
            // If using checkpoints for anything OTHER than position storage, like 
            // point in dialogue, MAKE SURE to check for it!

        }


        // Healthbar code
        function makeBar(x, y,color) {
            //draw the bar
            let bar = ref.add.graphics();
            bar.setScrollFactor(0);
    
            //color the bar
            bar.fillStyle(color, 1);
    
            //fill the bar with a rectangle
            bar.fillRect(-70, 450, 500, 10);
            
            //position the bar
            bar.x = x;
            bar.y = y;
    
            //return the bar
            return bar;
        }
        function setValue(bar,percentage) {
            //scale the bar
            bar.scaleX = percentage/100;
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
            console.log(player.x);
            console.log(player.y);
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
            showBody: false,
            showStaticBody: false
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
      fps: {
        // FIXES Refresh Rate BUG, where players move depending on the speed of their monitor.
        target: 70,
        forceSetTimeOut: true
      },
    scene: [
        LoadAssets,
        MainMenu,
        InGame        
    ],
};

var game = new Phaser.Game(config);    
