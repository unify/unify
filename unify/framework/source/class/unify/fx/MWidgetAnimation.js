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
    },
    
    animateOpacity : {
      apply : "__mwaApplyAnimationOpacity",
      nullable: true
    },
    
    animateOpacityDuration : {
      check: "Integer",
      init: 5000
    },
    
    animateRotate : {
      apply : "__mwaApplyAnimationRotate",
      nullable: true
    },
    
    animateRotateDuration : {
      check: "Integer",
      init: 5000
    }
  },
  
  members : {
    __mwAnimationPosition : null,
    __mwAnimationPositionReset : null,
    __mwAnimationOpacity : null,
    __mwAnimationOpacityReset : null,
    __mwAnimationRotate : null,
    __mwAnimationRotateReset : null,
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
    },
    
    __mwaApplyAnimationOpacity : function(value) {
      if (value != null) {
        var animation = this.__mwAnimationOpacity;
        if (animation) {
          animation.stop();
        } else {
          animation = this.__mwAnimationOpacity = new unify.fx.Opacity(this);
          this.__mwAnimationOpacityReset = animation.getResetValue();
        }
        
        animation.addListenerOnce("start", function() { console.log("Start animation"); });
        animation.addListenerOnce("stop", function(e) { console.log("Stop animation " + e.getData()); });
        
        animation.setValue(value);
        animation.setDuration(this.getAnimateOpacityDuration());
        animation.start();
      } else {
        var animation = this.__mwAnimationOpacity;
        if (animation) {
          animation.stop();
        }
        animation.reset(this.__mwAnimationOpacityReset);
      }
    },
    
    __mwaApplyAnimationRotate : function(value) {
      if (value != null) {
        var animation = this.__mwAnimationRotate;
        if (animation) {
          animation.stop();
        } else {
          animation = this.__mwAnimationRotate = new unify.fx.Rotate(this);
          this.__mwAnimationRotateReset = animation.getResetValue();
        }
        
        animation.addListenerOnce("start", function() { console.log("Start animation"); });
        animation.addListenerOnce("stop", function(e) { console.log("Stop animation " + e.getData()); });
        
        animation.setValue(value);
        animation.setDuration(this.getAnimateRotateDuration());
        animation.start();
      } else {
        var animation = this.__mwAnimationRotate;
        if (animation) {
          animation.stop();
        }
        animation.reset(this.__mwAnimationRotateReset);
      }
    }
  }
});