/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Implementation of iOS style animations
 */
qx.Class.define("unify.view.animation.IOSAnimationManager", {
  extend: qx.core.Object,
  implement: [unify.view.animation.IAnimationManager],
  
  members :{
    __positions : {
      center: {left: 0, top: 0},
      left: {left: "-100%", top: 0},
      right: {left: "100%", top: 0},
      bottom: {left: 0, top: "100%"}
    },
    
    initIn : function(fromView, toView) {
      if (toView) {
        var posTo = this.__positions.right;
        toView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posTo.left, posTo.top)
        });
      }
      if (fromView) {
        var posFrom = this.__positions.center;
        fromView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posFrom.left, posFrom.top)
        });
      }
    },
    
    initOut : function(fromView, toView) {
      if (toView) {
        var posTo = this.__positions.left;
        toView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posTo.left, posTo.top)
        });
      }
      if (fromView) {
        var posFrom = this.__positions.center;
        fromView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posFrom.left, posFrom.top)
        });
      }
    },
    
    initModalIn : function(fromView, toView) {
      if (toView) {
        var posTo = this.__positions.bottom;
        toView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posTo.left, posTo.top)
        });
      }
      if (fromView) {
        var posFrom = this.__positions.center;
        fromView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posFrom.left, posFrom.top)
        });
      }
    },
    
    initModalOut : function(fromView, toView) {
      if (toView) {
        var posTo = this.__positions.bottom;
        toView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posTo.left, posTo.top)
        });
      }
      if (fromView) {
        var posFrom = this.__positions.center;
        fromView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posFrom.left, posFrom.top)
        });
      }
    },
    
    
    animateIn : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      if (toView) {
        toView.setAnimatePositionDuration(duration);
        toView.setAnimatePosition(pos.center);
      }
      if (fromView) {
        fromView.addListenerOnce("animatePositionDone", callback, this);
        fromView.setAnimatePositionDuration(duration);
        fromView.setAnimatePosition(pos.left);
      } else if (toView) {
        toView.addListenerOnce("animatePositionDone", callback, this);
      }
    },
    
    animateOut : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      if (toView) {
        toView.setAnimatePositionDuration(duration);
        toView.setAnimatePosition(pos.center);
      }
      if (fromView) {
        fromView.addListenerOnce("animatePositionDone", callback, this);
        fromView.setAnimatePositionDuration(duration);
        fromView.setAnimatePosition(pos.right);
      } else if (toView) {
        toView.addListenerOnce("animatePositionDone", callback, this);
      }
    },
    
    animateModalIn : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      if (toView) {
        toView.addListenerOnce("animatePositionDone", callback, this);
        toView.setAnimatePositionDuration(duration);
        toView.setAnimatePosition(pos.center);
      }
      if (fromView) {
        fromView.setAnimatePositionDuration(0);
        fromView.setAnimatePosition(pos.bottom);
      }
    },
    
    animateModalOut : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      if (toView) {
        toView.setAnimatePositionDuration(0);
        toView.setAnimatePosition(pos.center);
      }
      if (fromView) {
        fromView.addListenerOnce("animatePositionDone", callback, this);
        fromView.setAnimatePositionDuration(duration);
        fromView.setAnimatePosition(pos.bottom);
      }
    }
    
    
  }
});