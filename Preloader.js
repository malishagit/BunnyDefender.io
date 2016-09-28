BunnyDefender.Preloader = function(game){
    this.preloadBar = null;
    this.titleText = null;
    //boolean for check everything is preloade and ready to run or not
    this.ready = false;
};

BunnyDefender.Preloader.prototype = {
	
	preload: function () {
        //center preloadBar in x axis and y axis in center of the screen
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
        //here we set preloadeBar on load attributes and pass ref to preloadBar
        //this going to assign our sprite we creted on preloader mechanism
        this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		this.titleText.anchor.setTo(0.5, 0.5);
        
        this.load.image('titlescreen','images/TitleBG.png');
        //we load font and we pass type of font and font image and we have to bind the data it has been created for us 
        //.fnt is data file
        this.load.bitmapFont('eightbitwonder','fonts/eightbitwonder.png','fonts/eightbitwonder.fnt')
        
        
        this.load.image('hill','images/hill.png');
        this.load.image('sky','images/sky.png');
        //bunny is identifier and spreadsheet PNG file, followed by a reference to the spritesheet data file.
        this.load.atlasXML('bunny','images/spritesheets/bunny.png','images/spritesheets/bunny.xml');
        
        this.load.atlasXML('spacerock','images/spritesheets/SpaceRock.png','images/spritesheets/SpaceRock.xml');
        
        this.load.image('explosion','images/explosion.png');
        
        this.load.image('ghost','images/ghost.png');
        //for audio 
        this.load.audio('explosion_audio', 'audio/explosion.mp3');
        this.load.audio('hurt_audio', 'audio/hurt.mp3');
        this.load.audio('select_audio', 'audio/select.mp3');
        this.load.audio('game_audio', 'audio/bgm.mp3');
	},

	create: function () {
		this.preloadBar.cropEnabled = false; //force show the whole thing
	},
    //this function constantly run after create function has created
	update: function () {
        //check sound is not only loading but decoded
        if(this.cache.isSoundDecoded('game_audio')&& this.ready==false){
            this.ready = true;
            this.state.start('StartMenu');
        }
	}
};