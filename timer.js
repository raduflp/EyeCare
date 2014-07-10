var Timer = function(){

  var thisObj;

  var time;
  var timerId = 0;
  var isRunning;

  this.init = function(seconds){
    thisObj = this;
    if (thisObj.isRunning){
      thisObj.stop();
    }
    thisObj.time = seconds;
    thisObj.isRunning = false;

    console.log("timer initialized with time ", thisObj.time)
  };

  this.start = function(){
    thisObj.isRunning = true;
    console.log("timer started at ", thisObj.time);

    if (thisObj.time > 0){
      thisObj.timerId = setInterval(
        function() { thisObj.tick(); },
        1000);
    } else {
      thisObj.stop();
    }
  }


  this.tick = function(){
    if (!thisObj.isRunning){
      console.log("ERROR: Cannot tick while stopped");
      return;
    }

    console.log("tick time = ", thisObj.time);

    thisObj.time--;
    if (thisObj.time <= 0) {
      thisObj.stop();
    }
  }


  this.stop = function(){
    thisObj.isRunning = false;
    thisObj.time = 0;
    clearInterval(thisObj.timerId);

    console.log("timer stopped");
  }


  this.pause = function(){
    thisObj.isRunning = false;
    clearInterval(thisObj.timerId);

    console.log("timer paused at ", thisObj.time);
  }

}
