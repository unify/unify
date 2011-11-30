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
    
    start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, startPosition, context) {
      if (!startPosition) {
        startPosition = 0;
      }
      if (!context) {
        context = this;
      }
      
      var time = qx.lang.Date.now;
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
        for (var usedId in running) {
          newRunning[usedId] = true;
        }
        running = newRunning;
      }

      // This is the internal step method which is called every few milliseconds
      var step = function(virtual) {
  
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
          for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
            step(true);
            dropCounter++;
          }
  
        }
  
        // Compute percent value
        if (duration) {
          percent = self.__percent[id] = (now - start) / duration + startPosition;
          if (percent > 1) {
            percent = 1;
          }
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
    
    stop: function(id) {
      var running = this.__running;
      
      var cleared = running[id] != null;
      if (cleared) {
        running[id] = null;
      }

      return cleared;
    },
    
    isRunning: function(id) {
      this.__running[id] != null;
    },
    
    getPosition : function(id) {
      return this.__percent[id];
    }
  }
});