/* ES5 syntax */
var mainGame = (function ($) {
  var canvas = document.getElementById("mainGameCanvas");
  var ctx = canvas.getContext("2d");
  var player = {};
  var fps = 20;
  var frameSpeed = 2; // player animation transition speed
  var pauseGameFlag = false;
  var backgroundSpeed = 0.3;
  var foregroundSpeed = 1;
  var pauseBackgroundFlag = false;

  /**
   * Type: Singleton function
   * Request Animation Polyfill
   * Ref: Paul Irish's Request Animation Polyfill
   */
  var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame;
  })();

  /**
   * Type = Singleton function
   * Asset pre-loader object. Loads all images and sounds
   */
  var assetLoader = (function() {
      var assetsParentPath = "/images/";
      // assets dictionary
      this.imgs = {
          "m_run" : assetsParentPath + "m_run_58x58.png",
          "m_shoot" : assetsParentPath + "m_shoot_hg_53x53.png",
          "m_thumbup" : assetsParentPath + "m_thumbup_58x58.png",
          "stage_1_fg" : assetsParentPath + "stage_1_fg_321x224.png",
          "stage_1_bg" : assetsParentPath + "stage_1_bg_353x224.png"
      }

      var assetsLoaded = 0;                           // how many assets have been loaded
      var numImgs = Object.keys(this.imgs).length;    // total number of image assets
      this.totalAssets = numImgs;                     // total number of assets

      /**
       * Ensure all assets are loaded before using them.
       * In "downloadAssets" function, we invoke the assetLoaded in this way :
       * >>> assetLoaded.call(_this, "imgs", img);
       * , and we assign the value of the dictionary like this :
       * >>> _this.imgs[img].status = "loading";
       * @param dic  - Dictionary name ('imgs')
       * @param name - Asset name in the dictionary
       */
       function assetLoaded(dic, name) {
          // don't count asset that have already loaded
          if (this[dic][name].status !== "loading" ) {
              return;
          }
          this[dic][name].status = "loaded";
          assetsLoaded++;
          // finished callback
          if (assetsLoaded === this.totalAssets && typeof this.finished === "function") {
              this.finished();
          }
       }

       /**
        * Create assets, set callback for asset loading, set asset source
        */
       this.downloadAssets = function() {
           var _this = this;
           var src;

           // loop every img asset defined in this.imgs dictionary
           for (var anImg in this.imgs) {
             // sanity check
             if (this.imgs.hasOwnProperty(anImg)) {
                 src = this.imgs[anImg];
                 // create a closure for event binding. This closure function is a singleton.
                 // It's because we're assigning a callback (assetLoaded function) that
                 // uses the img variable. If we don't wrap the closure as a singleton,
                 // the "onload" function callback will always pass the name of the last asset in
                 // the "imgs" object. This happens because we're dealing with an asynchronous call.
                 // To better understand this concept, check tag [async 1] in the JS_ES5_Notes.txt
                 (function(_this, anImg) {
                   // turn the img asset into an Image object
                   _this.imgs[anImg] = new Image();
                   _this.imgs[anImg].status = "loading";
                   _this.imgs[anImg].name = anImg;
                   // give the asset object the assetLoaded callback function
                   _this.imgs[anImg].onload = function() {
                                               // call the assetLoaded closure function
                                               // 1st param : _this => told the runtime what object to reference
                                               // as "this" while executing inside of function assetLoaded().
                                               // we do this so that assetLoaded will reference the "this" that
                                               // belongs to the AssetLoader class, not "this" of the global object.
                                               // 2nd param : "imgs" => the id of the dictionary which is the 1st param
                                               // of the assetLoaded function
                                               // 3rd param : img => the 2nd param of the function.
                                               assetLoaded.call(_this, "imgs", anImg);
                                            };
                   _this.imgs[anImg].src = src;
               })(_this, anImg);
             }
           }
       } // end this.downloadAssets function

       // return a dictionary that contains objects that we want to made accessible.
       return {
          imgs: this.imgs,
          totalAssets: this.totalAssets,
          downloadAssets: this.downloadAssets
       };
  })(); // end assetLoader function

  /**
   * Type : Private function
   * Creates a Spritesheet.
   * A frame is a sprite cell in a spritesheet. ensure that
   * a cell is a square (width == height) otherwise it will be
   * very difficult to compute.
   * @param {string} - Path to the image.
   * @param {number} - Width (in px) of each frame.
   * @param {number} - Height (in px) of each frame.
   */
  function SpriteSheet(path, frameWidth, frameHeight) {
      this.image = new Image();
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;

      // calculate the number of frames in a row after the image loads
      var _this = this;
      this.image.onload = function() {
        _this.framesPerRow = Math.floor(_this.image.width / _this.frameWidth);
      };

      this.image.src = path;
  }

  /**
   * Type : Singleton function
   * Create a parallax background
   */
  var parallaxBackground = (function() {
    var background = {};
    var foreground = {};

    /**
     * Draw the backgrounds to the screen at different speeds
     */
    this.drawAndUpdate = function() {
        if (!pauseBackgroundFlag) {
          // Pan background & foreground
          background.x -= background.speed;
          foreground.x -= foreground.speed;
        }

        // Draw images side by side for loop
        ctx.drawImage(assetLoader.imgs.stage_1_bg,
                      background.x, background.y);
        ctx.drawImage(assetLoader.imgs.stage_1_bg,
                      background.x + canvas.width, background.y);

        ctx.drawImage(assetLoader.imgs.stage_1_fg,
                      foreground.x, foreground.y);
        ctx.drawImage(assetLoader.imgs.stage_1_fg,
                      foreground.x + canvas.width, foreground.y);

        // If the image is scrolled offscreen, reset
        if (background.x + assetLoader.imgs.stage_1_bg.width <= 0)
          background.x = 0;
        if (foreground.x + assetLoader.imgs.stage_1_fg.width <= 0)
          foreground.x = 0;
    }
    /**
     * Reset background to zero
     */
    this.reset = function()  {
        background.speed = backgroundSpeed;
        background.x = 0;
        background.y = 0;
        foreground.speed = foregroundSpeed;
        foreground.x = 0;
        foreground.y = 0;
    }

    // using the IIFE pattern to create a singleton that exposes only the
    // draw & reset functions.
    return {
      drawAndUpdate: this.drawAndUpdate,
      reset: this.reset
    };
  })();

  /**
   * Type : Private function
   * Creates an animation from a spritesheet.
   * @param {SpriteSheet} - The spritesheet used to create the animation.
   * @param {number}      - Number of frames to wait for before transitioning the animation.
   * @param {array}       - Range or sequence of frame numbers for the animation.
   * @param {boolean}     - Repeat the animation once completed.
   */
   function Animation(spritesheet, frameSpeed, startFrame, endFrame) {
      var animationSequence = [];  // array holding the order of the animation
      var currentFrame = 0;        // the current frame to draw
      var counter = 0;             // keep track of frame rate
      // start and end range for frames
      for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
        animationSequence.push(frameNumber);
      /**
       * Update the animation
       */
      this.update = function() {
        // update to the next frame if it is time. Basically we'd like to set
        // the speed of the animation (frame transition). The larger the value
        // of the frameSpeed, the faster the animation will be.

        // Everytime the endframe has been reached, the current frame will
        // revert back to 0. Just like the logic of the counter below.
        if (counter == (frameSpeed - 1)) {
          currentFrame = (currentFrame + 1) % animationSequence.length;
        }
        // update the counter. The modulo operator below is to create continuous
        // loop. Assuming frameSpeed = 4,
        // 0 => 1, 1 => 2, 2 => 3, 3 => 0 ~ repeat the loop
        counter = (counter + 1) % frameSpeed;
      };
      /**
       * Draw the current frame
       * @param {integer} x - X position to draw
       * @param {integer} y - Y position to draw
       */
      this.draw = function(x, y) {
        // get the row and col of the frame
        var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
        var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
        ctx.drawImage(
          spritesheet.image,
          col * spritesheet.frameWidth, row * spritesheet.frameHeight,
          spritesheet.frameWidth, spritesheet.frameHeight,
          x, y,
          spritesheet.frameWidth, spritesheet.frameHeight);
      };
  } // end of the Animation function

  /**
   * Type : Private function
   * run the game - reset all variables and entities, spawn platforms and water.
   */
  function startGameAfterAssetsLoaded() {
      parallaxBackground.reset();
      this.playerWalkingAnimation();
      gameLoop();
  }

  /**
   * Type : private function
   * Game loop
   */
  function gameLoop() {
      if (!pauseGameFlag) {
          parallaxBackground.drawAndUpdate();

          player.anim.update();
          player.anim.draw(133, 129);

          // To manually set the framerate
          // Ref: http://creative.js/resources/requestanimationframe
          setTimeout(function() {
              requestAnimFrame( gameLoop );
          }, 1000/fps);
      }
  }

  this.playerWalkingAnimation = function() {
      if(pauseBackgroundFlag) {
        this.panBackground();
      }

      // setup the player - walking/running animation
      player.width  = 58;
      player.height = 58;
      player.speed  = 6;
      player.sheet  = new SpriteSheet("/images/m_run_58x58.png", player.width, player.height);
      player.anim   = new Animation(player.sheet, frameSpeed, 0, 11);
  }

  this.playerShootingAnimation = function() {
      if(!pauseBackgroundFlag) {
        this.stopBackground();
      }

      // setup the player - walking/running animation
      player.width  = 53;
      player.height = 53;
      player.speed  = 10;
      player.sheet  = new SpriteSheet("/images/m_shoot_hg_53x53.png", player.width, player.height);
      player.anim   = new Animation(player.sheet, frameSpeed, 0, 11);
  }

  this.playerThumbUpAnimation = function() {
      if(!pauseBackgroundFlag) {
        this.stopBackground();
      }

      // setup the player - thumbs up animation
      player.width  = 58;
      player.height = 58;
      player.speed  = 10;
      player.sheet  = new SpriteSheet("/images/m_thumbup_58x58.png", player.width, player.height);
      player.anim   = new Animation(player.sheet, frameSpeed, 0, 3);
  }

  this.stopBackground = function() {
      pauseBackgroundFlag = true;
  }

  this.panBackground = function() {
      pauseBackgroundFlag = false;
  }

  /*
   * Type: public function
   * Pause the game.
   */
  this.pauseGame = function() {
      pauseGameFlag = true;
  }

  /*
   * Type: public function
   * Call this function to run the game after it was paused.
   */
  this.runGame = function() {
      pauseGameFlag = false;
      gameLoop();
  }

  /*
   * Type: public function
   * The starter key
   */
  this.startGame = function() {
      pauseGameFlag = false;
      assetLoader.downloadAssets();
      assetLoader.finished = function() {
          startGameAfterAssetsLoaded();
      }
  }

  // return functions to be exposed to the outside world
  return {
    startGame : startGame,
    pauseGame : pauseGame,
    runGame : runGame,
    stopBackground : stopBackground,
    panBackground : panBackground,
    playerWalkingAnimation : playerWalkingAnimation,
    playerShootingAnimation : playerShootingAnimation,
    playerThumbUpAnimation : playerThumbUpAnimation
  };
})(jQuery);

// initial page load
mainGame.startGame();
//setTimeout(function() { mainGame.playerThumbUpAnimation(); }, 20000);
