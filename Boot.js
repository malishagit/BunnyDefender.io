var BunnyDefender = {};
//define Boot state on BunnyDefender and pass the game object
BunnyDefender.Boot = function(game){};

//define function to our Boot state with prototype
BunnyDefender.Boot.prototype = {
	//preload will do whatever we define to do before creation event happens
	preload: function() {
        this.load.image('preloaderBar','images/loader_bar.png');
        this.load.image('titleimage','images/TitleImage.png');
    },

    //creation event
	create: function() {
        //define pointer and set to one
        //'this' refers to actual game object
		this.input.maxPointers = 1;
		this.stage.disableVisibilityChange = false; // pause game on tab change
        //its gonna show everything defined in our stage itself
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //define our game how small it goes if we minimize our browser
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
        //center our game in browser view port
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
        //for mobile device
		this.stage.forcePortrait = true;  // force portrait mode
		this.scale.setScreenSize(true);  // true will force screen resize no matter what

		this.input.addPointer();
		this.stage.backgroundColor = '#171642';
        //launch our preloader
        this.state.start('Preloader');
	}
	
};