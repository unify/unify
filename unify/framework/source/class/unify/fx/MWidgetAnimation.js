/* ***********************************************************************************************

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 *********************************************************************************************** */

/**
 * Add support for animations to widgets
 */
qx.Mixin.define("unify.fx.MWidgetAnimation", {
  
  properties : {
    animatePosition : {
      apply : "__mwaApplyAnimationPosition"
    },
    
    animatePositionDuration : {
      check: "Integer",
      init: 5000
    }
  },
  
  members : {
    __mwAnimationPosition : null,
    __mwAnimationOpacity : null,
    __mwRotate : null,
    __mwScale : null,
    
    __mwaApplyAnimationPosition : function(value) {
      var animation = this.__mwAnimationPosition;
      if (animation) {
        animation.stop();
      } else {
        animation = this.__mwAnimationPosition = new unify.fx.Position(this);
      }
      
      animation.addListenerOnce("start", function() { console.log("Start animation"); });
      animation.addListenerOnce("stop", function(e) { console.log("Stop animation " + e.getData()); });
      
      animation.setValue(value);
      animation.setDuration(this.getAnimatePositionDuration());
      animation.start();
    }
  }
});