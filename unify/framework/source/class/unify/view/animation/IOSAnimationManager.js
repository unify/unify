qx.Class.define("unify.view.animation.IOSAnimationManager", {
  implement: [unify.view.animation.IAnimationManager],
  
  members :{
    animateIn : function(fromView, toView, duration, callback) {},
    animateOut : function(fromView, toView, duration, callback) {},
    animateModalIn : function(fromView, toView, duration, callback) {},
    animateModalOut : function(fromView, toView, duration, callback) {}
  }
});