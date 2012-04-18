/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * Animation class
 *
 * Based upon zynga scroller animation class
 *
 *
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 * 
 */
qx.Class.define("unify.fx.core.Animation", {
  extend: qx.core.Object,
  type: "singleton",
  
  construct : function() {
    this.base(arguments);
    
    this.__running = {};
    this.__percent = {};
    this.__counter = 1;
  },
  
  members : {
    __running : null,
    __counter : null,
    __percent : null,
    
    /**
     * Start animation flow
     *
     * @param stepCallback {Function} Callback for every step in animation flow
     * @param verifyCallback {Function} Callback that verifies that the step should be executed
     * @param completedCallback {Function} Callback that is called after animation is finished
     * @param duration {Integer} Duration of animation in milliseconds
     * @param easingMethod {Function} Function that calculates the easing method
     * @param startPosition {Float?0} Float value representing starting point (0.0 ... 1.0)
     * @param context {Object?null} Context of callbacks
     * @param repeat {Boolean?null} optional flag that signals if the animation should start over at its end (it must be stopped programmaticaly in this case!)(
     *
     * @return {Integer?null} ID of animation
     */
    start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, startPosition,context,repeat) {
      if (!startPosition) {
        startPosition = 0;
      }
      if (!context) {
        context = this;
      }
      
      var time = Date.now || function(){return new Date().getTime()};
      var running = this.__running;
      var desiredFrames = 60;
      var start = time();
      var lastFrame = start;
      var id = this.__counter++;
      var percent = this.__percent[id] = startPosition;
      var dropCounter = 0;
      var AnimationFrame = unify.fx.core.AnimationFrame;
      var root = qx.core.Init.getApplication().getRoot().getElement();
      var self = this;
      
      // Compacting running db automatically every few new animations
      if (id % 20 === 0) {
        var newRunning = {};
        var newPercent = {};
        var currentPercent=this.__percent;
        for (var usedId in running) {
          if(running[usedId]){
            newRunning[usedId] = true;
            newPercent[usedId] = currentPercent[usedId];
          }
        }
        running = this.__running = newRunning;
        this.__percent = newPercent;
      }

      // This is the internal step method which is called every few milliseconds
      var step = function(virtual) {
        //TODO for optimal performance, call requestAnimationFrame at the beginning of step
        // Normalize virtual value
        var render = virtual !== true;
  
        // Get current time
        var now = time();
  
        // Verification is executed before next animation step
        if (!running[id] || (verifyCallback && !verifyCallback.call(context,id))) {
  
          running[id] = null;
          completedCallback && completedCallback.call(context, desiredFrames - (dropCounter / ((now - start) / 1000)), id, false);
          return;
  
        }
        
        // For the current rendering to apply let's update omitted steps in memory.
        // This is important to bring internal state variables up-to-date with progress in time.
        if (render) {
  
          var droppedFrames = Math.round((now - lastFrame) / (1000 / desiredFrames)) - 1;
          //TODO why loop here? and why at most 4 times?
          for (var j = 0, jj = Math.min(droppedFrames, 4);j<jj; j++) {
            step(true);
            dropCounter++;
          }
  
        }
        
        // Compute percent value
        if (duration) {
          percent = self.__percent[id] = (now - start) / duration + startPosition;
          if (percent > 1) {
            percent = self.__percent[id] = 1;
          }
        }
        if(repeat && percent==1){
          percent= self.__percent[id] = 0;
          start = now;
        }
        
        // Execute step callback, then...
        var value = easingMethod ? easingMethod.call(context,percent) : percent;
        if ((stepCallback.call(context, value, now, render) === false || percent === 1) && render) {
          running[id] = null;
          completedCallback && completedCallback.call(context, desiredFrames - (dropCounter / ((now - start) / 1000)), id, percent === 1 || duration == null);
        } else if (render) {
          lastFrame = now;
          AnimationFrame.request(step, root);
        }
      };

      // Mark as running
      running[id] = true;

      // Init first step
      AnimationFrame.request(step, root);

      // Return unique animation ID
      return id;
    },
    
    /**
     * Stops animation flow
     *
     * @param id {Integer} ID of animation to stop
     * @return true if animation had to be stopped
     */
    stop: function(id) {
      var running = this.__running;
      
      var cleared = running[id] != null;
      if (cleared) {
        running[id] = null;
      }

      return cleared;
    },
    
    /**
     * Returns if animation is running
     *
     * @param id {Integer} ID of animation to stop
     * @return {Boolean} Animation is running
     */
    isRunning: function(id) {
      this.__running[id] != null;
    },
    
    /**
     * Returns position in percent of animation
     *
     * @param id {Integer} ID of animation to stop
     * @return {Float} Animation position (0.0 ... 1.0)
     */
    getPosition : function(id) {
      return this.__percent[id];
    }
  },
  
  destruct: function(){
    this.__running=this.__percent=null;
  }
});