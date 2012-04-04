/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com
 Additional Authors: Dominik Göpel

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
 * 
 * Updated with ideas from Paul Irish and Erik Möller http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
(function(global)
{
  // requestAnimationFrame polyfill

  var vendors = ['webkit','moz','ms','o'];
  for(var x = 0; x < vendors.length && !global.requestAnimationFrame; ++x) {
      global.requestAnimationFrame = global[vendors[x]+'RequestAnimationFrame'];
      global.cancelAnimationFrame = global[vendors[x]+'CancelAnimationFrame'] 
        || global[vendors[x]+'CancelRequestAnimationFrame'];
  }
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
    var DESIRED_TIMEOUT=Math.floor(1000/TARGET_FPS);
    var pendingRequests = {};
    var rafHandle = 1;
    var timeoutHandle = null;
    var executeAnimationFrame=function(){
      var executionStart = now();
      var requestsToExecute = pendingRequests;
      var keys = getKeys(requestsToExecute);
      
      // Reset data structure before executing callbacks
      pendingRequests = {};
      
      // Process all callbacks
      for (var i=0, l=keys.length; i<l; i++) {
        requestsToExecute[keys[i]](executionStart);
      }
      
      // check if new requests have been queued 
      if(isEmpty(pendingRequests)){
        //no more requests, stop now
        timeoutHandle = null;
      } else {
        //additional requests, continue with timeout loop
        timeoutHandle = setTimeout(executeAnimationFrame, Math.max(0,DESIRED_TIMEOUT-(now()-executionStart)));
      }
    }
    
    //emulation
    global.requestAnimationFrame=function(callback, root){
      var callbackHandle = rafHandle++;
      
      // add callback to list of pending requests
      pendingRequests[callbackHandle] = callback;
      
      // start timeout loop if not running
      if (timeoutHandle === null) {
        timeoutHandle = setTimeout(executeAnimationFrame, 0);//use 0, we want the first frame to start asap
      }
      return callbackHandle;
    };
    
    global.cancelAnimationFrame=function(handle){
      delete pendingRequests[handle];
      
      // Stop loop if no more are pending
      if (isEmpty(pendingRequests)) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    };
  } 
})(this);