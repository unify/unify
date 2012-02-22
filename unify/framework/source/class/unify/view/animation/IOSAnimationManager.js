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
    
    initModalIn : function(fromView, toView) {},
    
    initModalOut : function(fromView, toView) {},
    
    
    animateIn : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      fromView.addListenerOnce("animatePositionDone", callback, this);
      toView.setAnimatePositionDuration(duration);
      toView.setAnimatePosition(pos.center);
      fromView.setAnimatePositionDuration(duration);
      fromView.setAnimatePosition(pos.left);
    },
    
    animateOut : function(fromView, toView, duration, callback) {
      var pos = this.__positions;
      
      fromView.addListenerOnce("animatePositionDone", callback, this);
      toView.setAnimatePositionDuration(duration);
      toView.setAnimatePosition(pos.center);
      fromView.setAnimatePositionDuration(duration);
      fromView.setAnimatePosition(pos.right);
    },
    
    animateModalIn : function(fromView, toView, duration, callback) {},
    
    animateModalOut : function(fromView, toView, duration, callback) {}
    
    
  }
});