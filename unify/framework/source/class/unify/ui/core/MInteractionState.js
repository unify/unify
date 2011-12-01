/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Mixin to support interaction states (hover, active etc.) on widgets
 */
qx.Mixin.define("unify.ui.core.MInteractionState", {
  construct : function() {
    this._applyMInteractionState();
  },
  
  members : {
    _applyMInteractionState : function() {
      var supportTouch = true;
      var supportMouse = true;
      
      if (supportTouch) {
        this.addListener("touchstart", this.__MInteractionStateTouchStart, this);
        this.addListener("touchleave", this.__MInteractionStateTouchLeave, this);
        this.addListener("touchend", this.__MInteractionStateTouchLeave, this);
        this.addListener("touchcancel", this.__MInteractionStateTouchLeave, this);
      }
      if (supportMouse) {
        this.addListener("mouseover", this.__MInteractionStateMouseOver, this);
        this.addListener("mouseout", this.__MInteractionStateMouseOut, this);
      }
    },
    
    __MInteractionStateTouchStart : function() {
      this.addState("hover");
    },
    
    __MInteractionStateTouchLeave : function() {
      this.removeState("hover");
    },
    
    __MInteractionStateMouseOver : function() {
      this.addState("hover");
    },
    
    __MInteractionStateMouseOut : function() {
      this.removeState("hover");
    }    
  },
  
  destruct : function() {
    this.removeListener("touchstart", this.__MInteractionStateTouchStart, this);
    this.removeListener("touchleave", this.__MInteractionStateTouchLeave, this);
    this.removeListener("touchend", this.__MInteractionStateTouchLeave, this);
    this.removeListener("touchcancel", this.__MInteractionStateTouchLeave, this);
    this.removeListener("mouseover", this.__MInteractionStateMouseOver, this);
    this.removeListener("mouseout", this.__MInteractionStateMouseOut, this);
  }
});