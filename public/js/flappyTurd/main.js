var resizeTimeout;

//reload game when window resizes
window.addEventListener('resize', function(){
    clearTimeout(resizeTimeout);
    var resizeTimeout = setTimeout(function(){
        location.reload();
    }, 500)
});

var gameWidth,
    gameHeight,
    startGame = false;

if (navigator.userAgent.match(/(Mobile|iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
    //Mobile
    if (screen.width > screen.height) {
        alert('Please switch to Portrait orientation!');
    } else {
        gameWidth  = 500;
        gameHeight = 600;
        startGame = true;
    }
} else {
    //Desktop
    gameWidth  = 500;
    gameHeight = 600;
    startGame = true;
}

if (startGame) {
    // Create our 'main' state that will contain the game
    game = new Phaser.Game(gameWidth, gameHeight);
    var mainState = {
        preload: function() { 
            // This function will be executed at the beginning     
            // That's where we load the images and sounds 

            // Load the bird sprite
            game.load.image('background', 'assets/bg.png');
            game.load.image('turd', 'assets/turd.png');
            game.load.image('pipe', 'assets/toilet.png');
            game.load.image('wing', 'assets/wing.png');
            game.load.image('plunger', 'assets/plunger.png');
            game.load.audio('jump', 'assets/fart.wav');
            game.load.audio('jump2', 'assets/fart-2.wav');
            game.load.audio('jump3', 'assets/fart-3.wav');
            game.load.audio('jump4', 'assets/fart-4.wav');
            game.load.audio('toilet', 'assets/flush.wav');
            game.load.audio('horn', 'assets/horn.wav');
        },
        create: function() {
            //set global game variables
            this.isMouseDown = false;
            this.isGameOver  = false;

            // This function is called after the preload function     
            // Here we set up the game, display sprites, etc.
            // game.stage.backgroundColor = "#282828";
            this.panningBG1 = game.add.sprite(0,0, 'background');
            this.panningBG2 = game.add.sprite(736,0, 'background');

            //create empty group
            this.pipes = game.add.group();
            this.plungers = game.add.group();

            this.gameStarted = false;

            // Set the physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            // Display the bird at the position x=100 and y=245
            this.turd = game.add.sprite(100, 245, 'turd');
            this.turd.scale.setTo(1, 1);
            this.wing = this.turd.addChild(game.make.sprite(40,0, 'wing'));
            this.jumpSound = [game.add.audio('jump'), game.add.audio('jump2'), game.add.audio('jump3'), game.add.audio('jump4')];
            this.toiletSound = game.add.audio('toilet');
            this.hornSound = game.add.audio('horn');

            // Add physics to the bird
            // Needed for: movements, gravity, collisions, etc.
            game.physics.arcade.enable(this.turd);

            this.turd.body.gravity.y = 0;

            this.score = -1;
            this.labelScore = game.add.text(20, 20, "0", 
                { font: "30px Arial", fill: "#ffffff" }); 

            this.highScore = localStorage.getItem('highScore') || 0;

            //game title   
            this.gameTitle1 = game.add.text(200, 100, "Flappy", 
                { font: "40px Impact", fill: "#ffffff" }); 
            this.gameTitle2 = game.add.text(210, 140, "Turd", 
                { font: "40px Impact", fill: "#ffffff" }); 

            // Call the 'jump' function when the spacekey is hit
            var spaceKey = game.input.keyboard.addKey(
                           Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);

            this.turd.anchor.setTo(-0.2, 0.5); 
            this.wing.anchor.setTo(1, 1); 
        },
        startGame:function(){
            //creates pipes to show up every 2 seconds
            this.timer = game.time.events.loop(2000, 
                this.addRowOfPipes, this);

            //occasionally shows 'plunger' powerup
            this.plungerTimer = game.time.events.loop(11000,
                this.showPlunger, this);

            // Add gravity to the bird to make it fall
            this.turd.body.gravity.y = 1000;
        },
        showPlunger: function(){
            var plunger = game.add.sprite(500, Math.floor(Math.random() * 600) + 1, 'plunger');
            this.plungers.add(plunger);
            plunger.scale.x = .2;
            plunger.scale.y = .27;
            game.physics.arcade.enable(plunger);
            plunger.body.velocity.x = -200;
            plunger.checkWorldBounds = true; 
            plunger.outOfBoundsKill = true;
        },
        addOnePipe: function(x, y) {
            // Create a pipe at the position x and y
            var pipe = game.add.sprite(x, y, 'pipe');

            // Add the pipe to our previously created group
            this.pipes.add(pipe);

            // Enable physics on the pipe 
            game.physics.arcade.enable(pipe);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -200; 

            // Automatically kill the pipe when it's no longer visible 
            pipe.checkWorldBounds = true; 
            pipe.outOfBoundsKill = true;
        },
        addRowOfPipes: function() {
            // Randomly pick a number between 1 and 5
            // This will be the hole position
            var hole = Math.floor(Math.random() * 7) + 1;

            // Add the 6 pipes 
            // With one big hole at position 'hole' and 'hole + 1'
            for (var i = 0; i < 10; i++)
                if (i != hole && i != hole + 1) 
                    this.addOnePipe(500, i * 60 + 10); 

            //
            this.score ++;
            this.labelScore.text = this.score;   
        },
        update: function() {
            // This function is called 60 times per second    
            // It contains the game's logic   

            //move background
            if(this.panningBG2.x <= -1472) {
                this.panningBG1.x = 0;
                this.panningBG2.x = 736;
            } else {
                this.panningBG1.x -= .25;
                this.panningBG2.x -= .25;
            }

            // If the bird is out of the screen (too high or too low)
            // Call the 'endGame' function
            if (this.turd.y < 0 || this.turd.y > 600) {
                this.endGame();
                this.hitPipe();
            }

            if (this.turd.angle < 20) {
                this.turd.angle += 1;
                this.wing.angle += 1.5;
            }

            if(game.input.activePointer.isDown && !this.isMouseDown) {
                this.jump();
                this.isMouseDown = true;
                if (this.isGameOver)
                    this.restartGame();
            }

            if(game.input.activePointer.isUp)
                this.isMouseDown = false;


            game.physics.arcade.overlap(
                this.turd, this.pipes, this.hitPipe, null, this);
            game.physics.arcade.overlap(
                this.turd, this.plungers, this.powerUp, null, this);
        },
        // Make the bird jump 
        jump: function() {
            if(this.gameStarted) {
                if (this.turd.alive == false)
                    return; 
                // Add a vertical velocity to the bird
                this.turd.body.velocity.y = -350;
                var birdAnim = game.add.tween(this.turd).to({angle:-20}, 100).start();
                var windAnim = game.add.tween(this.wing).to({angle:-50}, 100).start();
                //grab fart sounds
                this.jumpSound[Math.floor(Math.random() * 4)].play();
            } else {
                this.gameStarted = true;
                var titleFade = game.add.tween(this.gameTitle1).to({alpha:0}, 1000).start().onComplete.add(this.removeObj, this);
                var titleFade2 = game.add.tween(this.gameTitle2).to({alpha:0}, 1000).start().onComplete.add(this.removeObj, this);
                this.startGame();
            }
        },
        removeObj:function(obj){
            obj.kill();
        },
        hitPipe: function() {
            // If the bird has already hit a pipe, do nothing
            // It means the bird is already falling off the screen
            if (this.turd.alive == false)
                return;

            // Set the alive property of the bird to false
            this.turd.alive = false;

            // Prevent new pipes from appearing
            game.time.events.remove(this.timer);
            game.time.events.remove(this.plungerTimer);

            this.plungers.forEach(function(p){
                p.body.velocity.x = 0;
            });

            // Go through all the pipes, and stop their movement
            this.pipes.forEach(function(p){
                p.body.velocity.x = 0;
            }, this);

            this.toiletSound.play();
        },
        powerUp:function(turd, plunger){
            plunger.kill();
            this.score += 5;
            this.labelScore.text = this.score;
            this.hornSound.play();
        },
        // Restart the game
        endGame: function() {
            //reset panning background
            this.panningBG1.x = 0;
            this.panningBG2.x = 736;

            this.isGameOver = true;
            // Start the 'main' state, which restarts the game
            if (this.score > this.highScore)
                localStorage.setItem('highScore', this.score);

            labelScore = game.add.text(200, 250, "Your Score: " + (this.score < 0 ? "0" : this.score), 
                { font: "25px Helvetica", fill: "#ffffff" });
            labelScore1 = game.add.text(200, 290, "High Score: " + localStorage.getItem('highScore'), 
                { font: "25px Helvetica", fill: "#ffffff" });

            var spaceKey = game.input.keyboard.addKey(
                           Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.restartGame, this);
        },
        restartGame:function(){
            game.state.start('main');
        }
    };

    // Add and start the 'main' state to start the game
    game.state.add('main', mainState);
    game.state.start('main');
}