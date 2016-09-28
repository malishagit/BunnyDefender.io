BunnyDefender.Game = function(game){
    //accounter for howmany bunnies should be generated into our state
    this.totalBunnies;
    //phaser's grouping mechanism in order to control the bunnies and allow us to perform collisions and things like that upon the entire group, instead of dealing with each one individually.
    this.bunnyGroup;
    
    this.totalSpacerocks;
    this.spacerockgroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
    
};

BunnyDefender.Game.prototype = {
    //phaser create function
    //runs only onces and we can set anything we want to in this state
    create: function(){
         this.gameover= false;
        this.secondsElapsed=0;
        //if we set this true then timer will run only onces but here it will run in recurring loop
        this.timer = this.time.create(false);
        this.timer.loop(1000,this.updateSeconds,this);
        this.totalBunnies = 20;
        this.totalSpacerocks=13;
        //add music
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);   //marker, position, volume, loop
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
      //this function helps to modularise our game  
         this.buildWorld();
        
    },
    updateSeconds: function(){
        this.secondsElapsed++;
    },
    
     buildWorld: function() {
         this.add.image(0,0,'sky');
         this.add.image(0,800,'hill');
         this.buildBunnies();
         this.buildSpaceRocks();
         this.buildEmitter();
         this.countdown = this.add.bitmapText(10,10,'eightbitwonder','Bunnies left' + this.totalBunnies,20);
         this.timer.start();
     }, 
    
    buildBunnies: function() {
        //this will create new group bunny group
        this.bunnygroup = this.add.group();
        //enableBody helps to interact with the other entities if we create.
        //it performs with phaser physics like collisions etc
        this.bunnygroup.enableBody = true;
        //this loop build individual bunny and add them to the group
        for(var i=0; i<this.totalBunnies; i++) {
            //this will create new bunny and bind it to our bunny group
            //first we pass the random interger number for that we have phaser's utility classes
            //between -10 and -50 sets bunny between those one side of the stage to another side of the stage. and same goes with height
            //identifier, Bunny0000, tells us where inside of the texture atlas we want to actually start bringing that out
            var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
            b.anchor.setTo(0.5, 0.5);
            //we will do it manually not by physics  automatically so setting it to false will allow us it manually
            b.body.moves = false;
            //now we are adding animations
            //one rest when bunny is sitting and it will need specific array of number which will correspond to frames within texture atlas and same way for when bunny is walking(hopping)
            b.animations.add('Rest', this.game.math.numberArray(1,58));
            b.animations.add('Walk', this.game.math.numberArray(68,107));
            b.animations.play('Rest', 24, true);
            this.assignBunnyMovement(b);
    }
},
    assignBunnyMovement: function(b) {
        //this numbers are not the bunnies are right now but its where bunnies want to go to 
        bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
        //bdelay help the bunnies to show that they are acting as their own will
        //this will make bunnies to move all deifferent time in milliseconds
        bdelay = this.rnd.integerInRange(2000, 6000);
        //logic for which direction bunny should go whenit starts moving
        //based upon the positions we gathered and the current position of this bunny instance 
        //here in this line we check if the bunny's position is less than its current position so bunny is right side of the stage and he wants to move to the left
        //same thing if the bunny is on the left side of the stage and wants to move to the right of the stage, then he should face the opposite direction
        if(bposition < b.x){
            //this will flip the bunny in one directions to other
            //this works becasue we anchor our bunny to(-0.5,0,5)
            b.scale.x = 1;
        }else{
            b.scale.x = -1;
        }
        
        //tween do actual movement for each of these bunnies pass b(bunny instance)
        //to function require we want to move a particular attribute to move along to x axis
        //how long this tween to be last
        //invoke Phaser dot easing quadratic in out which will do more natural movement
        //tween to autostart so set to true
        //and randomised bdelay
        t = this.add.tween(b).to({x:bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay); //properties, duration, ease, autoStart, delay
        //event listener and this is b which we pass in tween
        t.onStart.add(this.startBunny, this);
        t.onComplete.add(this.stopBunny, this);
},

startBunny: function(b) {
    //this will stop our animation
    b.animations.stop('Rest');
    //walk our animation 24 frames per seconds and auto loop to true
    b.animations.play('Walk', 24, true);
},

stopBunny: function(b) {
    b.animations.stop('Walk');
    b.animations.play('Rest', 24, true);
    this.assignBunnyMovement(b);
},
    buildSpaceRocks: function() {
        this.spacerockgroup = this.add.group();
        for(var i=0; i<this.totalSpacerocks; i++) {
            var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
            var scale = this.rnd.realInRange(0.3, 1.0);
            //this randomise roacks some small and some larger
            r.scale.x = scale;
            r.scale.y = scale;
            //automatically fall the rocks on the bunnies
            this.physics.enable(r, Phaser.Physics.ARCADE);
            r.enableBody = true;
            //velocity how fast the rock comes down
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
            r.animations.add('Fall');
            r.animations.play('Fall', 24, true);
            //once the rock leves our stage then it fires off  
            r.checkWorldBounds = true;
            r.events.onOutOfBounds.add(this.resetRock,this);
        }

},
    
    resetRock: function(r){
        if (r.y > this.world.height){
            this.respawnRock(r);
        }
    },
    respawnRock: function(r){
        if( this.gameover==false){
            r.reset(this.rnd.integerInRange(0,this.world.width),this.rnd.realInRange(-1500,0));

                r.body.velocity.y = this.rnd.integerInRange(200,400);
        }
    },
    
    buildEmitter:function() {
        //in this line emitter will have 0 to x axis and 0 to y axis and 80 particles 
        this.burst = this.add.emitter(0, 0, 80);
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        //after explsion effect we pass image of explosion
        this.burst.makeParticles('explosion');
        //this refers to input itself
        this.input.onDown.add(this.fireBurst, this);
},

fireBurst: function(pointer) {
    if( this.gameover==false){
        this.boom.play();
        this.boom.volume=0.2;
        this.burst.emitX = pointer.x;
        this.burst.emitY = pointer.y;
        //makes particle running
        this.burst.start(true, 2000, null, 20); //(explode, lifespan, frequency, quantity)
    }
},
    
    burstCollision: function(r,b){
        // this.respawnRock pass in the reference to the particular space rock instance that was touched by one of the burst particles
        this.respawnRock(r);
    },
    
    
    bunnyCollision: function(r,b){
        if(b.exists){
            this.ouch.play();
            this.respawnRock(r);
            this.makeGhost(b);
            //Kill is a phase or specific function that is used to basically kill a sprite
            //decrement its health to zero. We're going to remove it from the stage altogether
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
        }
        
    },
    
    checkBunniesLeft: function(){
        if(this.totalBunnies <= 0){
            this.gameover= true;
            this.music.stop();
            this.countdown.setText('Bunnies left 0');
            this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\n' + this.secondsElapsed, 42);
            this.overmessage.align = "center";
            this.overmessage.inputEnabled = true;
            this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
        }else{
            this.countdown.setText('Bunnies left '+ this.totalBunnies);
        }
    },
    
    quitGame: function(pointer){
         this.ding.play(); 
        this.state.start('StartMenu');
       
    },
    
    friendlyFire: function(b,e){
        if(b.exists){
             this.ouch.play();
            this.makeGhost(b);
            b.kill();
            this.totalBunnies--;
            this.checkBunniesLeft();
        }
    },
    
    makeGhost: function(b) {
        bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
        bunnyghost.anchor.setTo(0.5, 0.5);
        bunnyghost.scale.x = b.scale.x
        this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
        bunnyghost.enableBody = true;
        bunnyghost.checkWorldBounds = true;
        //for reverse gravity so going upwards
        bunnyghost.body.velocity.y = -800;
},


//-- bunnyCollision
//this.makeGhost(b);
//
//-- friendlyFire
//this.makeGhost(b);
    
    //phaser update function
    //runs constantly so here we can put logic and different checks 
    update: function(){
        //The first two are the two objects or groups that we need to test for collisions against..

        //Next we need to determine a function that's going to be called whenever a collision is detected. This is going to be called this.burstCollision. Next we'll pass through null. This is for our process callback which we're not using in this case. And finally, we'll pass through this. This is actually the callback context
        this.physics.arcade.overlap(this.spacerockgroup,this.burst,this.burstCollision,null,this);
        
        this.physics.arcade.overlap(this.spacerockgroup,this.bunnygroup,this.bunnyCollision,null,this);
        
        this.physics.arcade.overlap(this.bunnygroup,this.burst,this.friendlyFire,null,this);
    }
}