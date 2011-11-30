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
      apply : "__mwaApplyAnimationPosition",
      nullable: true
    },
    
    animatePositionDuration : {
      check: "Integer",
      init: 5000
    }
  },
  
  members : {
    __mwAnimationPosition : null,
    __mwAnimationPositionReset : null,
    __mwAnimationOpacity : null,
    __mwRotate : null,
    __mwScale : null,
    
    __mwaApplyAnimationPosition : function(value) {
      if (value != null) {
        var animation = this.__mwAnimationPosition;
        if (animation) {
          animation.stop();
        } else {
          animation = this.__mwAnimationPosition = new unify.fx.Position(this);
          this.__mwAnimationPositionReset = animation.getResetValue();
        }
        
        animation.addListenerOnce("start", function() { console.log("Start animation"); });
        animation.addListenerOnce("stop", function(e) { console.log("Stop animation " + e.getData()); });
        
        animation.setValue(value);
        animation.setDuration(this.getAnimatePositionDuration());
        animation.start();
      } else {
        var animation = this.__mwAnimationPosition;
        if (animation) {
          animation.stop();
        }
        animation.reset(this.__mwAnimationPositionReset);
      }
    }
  }
});