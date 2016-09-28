BunnyDefender.StartMenu = function(game){
    //background
    this.startBG;
    //prompt
    this.startPrompt;
    //to create ding sound if someone select to play
    this.ding;
}

BunnyDefender.StartMenu.prototype = {
	
	create: function () {
        this.ding= this.add.audio('select_audio');
        //startBG which we declare up and x and y values at 0 and title 
		startBG = this.add.image(0, 0, 'titlescreen');
        //this will allow us for mouseclick and touches
		startBG.inputEnabled = true;
        //bind event handler to our background and pass start.game which is declare below and pass 'this' which is game object so it will be available to startgame function
		startBG.events.onInputDown.addOnce(this.startGame, this);
		
		startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+180, 'eightbitwonder', 'Touch to Start!', 24);
        
        
	},

	startGame: function (pointer) {
        this.ding.play();
		this.state.start('Game');
	}
};
