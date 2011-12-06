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
    /** {Map} Position to animate to */
    animatePosition : {
      apply : "__mwaApplyAnimationPosition",
      nullable: true
    },
    
    /** {Integer} Duration of position animation in milliseconds */
    animatePositionDuration : {
      check: "Integer",
      init: 5000
    },
    
    /** {Float} Opacity to animate to */
    animateOpacity : {
      apply : "__mwaApplyAnimationOpacity",
      nullable: true
    },
    
    /** {Integer} Duration of opacity animation in milliseconds */
    animateOpacityDuration : {
      check: "Integer",
      init: 5000
    },
    
    /** {Integer} Rotation level in degree to animate to */
    animateRotate : {
      apply : "__mwaApplyAnimationRotate",
      nullable: true
    },
    
    /** {Integer} Duration of rotation animation in milliseconds */
    animateRotateDuration : {
      check: "Integer",
      init: 5000
    },
    
    /** {Boolean} If true rotation animation is infinite, duration is time for one round */
    animateRotateInfinite : {
      check: "Boolean",
      init: false
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
    
    /**
     * Animation method for position
     *
     * @param value {Map} Position to animate to
     */
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
    
    /**
     * Animation method for opacity
     *
     * @param value {Float} Opacity to animate to
     */
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
    
    /**
     * Animation method for rotation
     *
     * @param value {Integer} Rotation level to animate to
     */
    __mwaApplyAnimationRotate : function(value) {
      if (value != null) {
        var animation = this.__mwAnimationRotate;
        if (animation) {
          animation.stop();
        } else {
          animation = this.__mwAnimationRotate = new unify.fx.Rotate(this);
          this.__mwAnimationRotateReset = animation.getResetValue();
        }
        
        if (this.getAnimateRotateInfinite()) {
          if (value) {
            this.__infiniteRotateValue = value;
          }
          
          animation.addListenerOnce("stop", function(e) {
            if (e.getData() == "done") {
              this.resetAnimateRotate();
              this.setAnimateRotate(this.__infiniteRotateValue);
            }
          }, this);
        }
        
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