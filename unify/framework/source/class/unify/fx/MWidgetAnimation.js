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
  
  events : {
    animatePositionDone : "qx.event.type.Event",
    animateOpacityDone : "qx.event.type.Event",
    animateRotateDone : "qx.event.type.Event"
  },
  
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
  
  construct : function() {
    this.__mwAnimationMap = {};
    this.__mwAnimationResetMap = {};
  },
  
  members : {
    __mwAnimationMap : null,
    __mwAnimationResetMap : null,
    __mwAnimationRotate : null,
    __mwAnimationRotateReset : null,
    __mwScale : null,
    
    __mwaDoAnimation : function(value, animationName, Animation, doneEvent, duration) {
      if (value != null) {
        var animation = this.__mwAnimationMap[animationName];
        if (animation) {
          animation.stop();
        } else {
          animation = this.__mwAnimationMap[animationName] = Animation;
          this.__mwAnimationResetMap[animationName] = animation.getResetValue();
        }
        
        animation.addListenerOnce("stop", function() {
          this.fireEvent(doneEvent);
        }, this);
        
        animation.setValue(value);
        animation.setDuration(duration);
        animation.start();
      } else {
        var animation = this.__mwAnimationMap[animationName];
        if (animation) {
          animation.stop();
        }
        animation.reset(this.__mwAnimationResetMap[animationName]);
      }
    },
    
    /**
     * Animation method for position
     *
     * @param value {Map} Position to animate to
     */
    __mwaApplyAnimationPosition : function(value) {
      this.__mwaDoAnimation(value, "position", new unify.fx.Position(this), "animatePositionDone", this.getAnimatePositionDuration());
    },
    
    /**
     * Animation method for opacity
     *
     * @param value {Float} Opacity to animate to
     */
    __mwaApplyAnimationOpacity : function(value) {
      this.__mwaDoAnimation(value, "opacity", new unify.fx.Opacity(this), "animateOpacityDone", this.getAnimateOpacityDuration());
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
        } else {
          animation.addListener("stop", function() {
            this.fireEvent("animateRotationDone");
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