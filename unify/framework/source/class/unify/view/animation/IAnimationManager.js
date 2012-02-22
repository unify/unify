qx.Interface.define("unify.view.animation.IAnimationManager", {
  members : {
    initIn : function(fromView, toView) {},
    initOut : function(fromView, toView) {},
    initModalIn : function(fromView, toView) {},
    initModalOut : function(fromView, toView) {},
    
    animateIn : function(fromView, toView, duration, callback) {},
    animateOut : function(fromView, toView, duration, callback) {},
    animateModalIn : function(fromView, toView, duration, callback) {},
    animateModalOut : function(fromView, toView, duration, callback) {}
  }
});