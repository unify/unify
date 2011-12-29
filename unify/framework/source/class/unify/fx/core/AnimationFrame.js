/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * Use external requestAnimationFrame patches from zynga
 */
/*
 #ignore(requestAnimationFrame)
 #ignore(cancelAnimationFrame)
 */

qx.Class.define("unify.fx.core.AnimationFrame", {
  type: "static",

  statics: {
    /**
     * Request animation frame
     *
     * @param callback {Function} Callback function if animation frame is hitten
     * @param root {Object?} optional html element defining the area where the animation happens
     * @return {Object} request handle
     */
    request : function(callback,root) {
      return requestAnimationFrame(callback,root);//TODO check spec if root element is still there and if browsers support it
    },

    /**
     * cancels a pending animation frame step
     * 
     * @param handle {Object} the pending requests handle
     */
    cancel : function(handle) {
      return cancelAnimationFrame(handle);
    }
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BELOW BE DRAGONS                                                                                                                         proceed with caution...  //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*src/Raf.js */
/*
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
 * Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
 */
(function(global)
{
  // requestAnimationFrame polyfill
  global.requestAnimationFrame = global.requestAnimationFrame
      || global.webkitRequestAnimationFrame
      || global.mozRequestAnimationFrame
      || global.oRequestAnimationFrame
      || global.msRequestAnimationFrame;
  if(!global.requestAnimationFrame){
    // Custom implementation
    // Basic emulation of native methods for internal use
    var now = Date.now || function() {
      return new Date().getTime();
    };
    
    var getKeys = Object.keys || function(obj) {
      var keys = {};
      for (var key in obj) {
        keys[key] = true;
      }
      return keys;
    };
    
    var isEmpty = Object.empty || function(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    };
    
    //internal fields
    var TARGET_FPS = 60;
    var requests = {};
    var rafHandle = 1;
    var timeoutHandle = null;
    //emulation
    global.requestAnimationFrame=function(callback, root){
      var callbackHandle = rafHandle++;
      
      // Store callback
      requests[callbackHandle] = callback;
      
      // Create timeout at first request
      if (timeoutHandle === null)
      {
        timeoutHandle = setTimeout(function()
        {
          var time = now();
          var currentRequests = requests;
          var keys = getKeys(currentRequests);
          
          // Reset data structure before executing callbacks
          requests = {};
          timeoutHandle = null;
          
          // Process all callbacks
          for (var i=0, l=keys.length; i<l; i++) {
            currentRequests[keys[i]](time);
          }
        }, 1000 / TARGET_FPS);
      }
      
      return callbackHandle;
    };
    
    global.cancelAnimationFrame=function(handle){
      delete requests[handle];
      
      // Stop timeout if all where removed
      if (isEmpty(requests))
      {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  } else {
    global.cancelAnimationFrame = global.cancelAnimationFrame
        ||global.webkitCancelAnimationFrame
        ||global.mozCancelAnimationFrame
        ||global.oCancelAnimationFrame
        ||global.msCancelAnimationFrame
      //legacy support (cancelRequestAnimationFrame got renamed to cancelAnimationFrame)
        ||global.cancelRequestAnimationFrame
        ||global.webkitCancelRequestAnimationFrame
        ||global.mozCancelRequestAnimationFrame
        ||global.oCancelRequestAnimationFrame
        ||global.msCancelRequestAnimationFrame
  }
})(this);