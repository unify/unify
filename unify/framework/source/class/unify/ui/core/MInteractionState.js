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
        this.addListener("touchstart", this.__MInteractionStateAddPressed, this);
        this.addListener("touchleave", this.__MInteractionStateRemovePresse, this);
        this.addListener("touchend", this.__MInteractionStateRemovePresse, this);
        this.addListener("touchcancel", this.__MInteractionStateRemovePresse, this);
      }
      if (supportMouse) {
        this.addListener("mouseover", this.__MInteractionStateAddHover, this);
        this.addListener("mouseout", this.__MInteractionStateRemoveHover, this);
        this.addListener("mousedown", this.__MInteractionStateAddPressed, this);
        this.addListener("mouseup", this.__MInteractionStateRemovePresse, this);
      }
    },
    
    __MInteractionStateAddHover : function() {
      this.addState("hover");
    },
    
    __MInteractionStateRemoveHover : function() {
      this.removeState("hover");
    },
    
    __MInteractionStateAddPressed : function() {
      this.addState("pressed");
    },
    
    __MInteractionStateRemovePresse : function() {
      this.removeState("pressed");
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