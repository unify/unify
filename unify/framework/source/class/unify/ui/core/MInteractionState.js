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
  
  statics : {
    MInteractionStateIsHovered : null
  },
  
  construct : function() {
    this._applyMInteractionState();
  },
  
  members : {
    __MInteractionStatePressed : null,
    
    /**
     * Checks if the left mouse button is pressed.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     * @return {Boolean} Whether the left mouse button is pressed
     */
    __isLeftMouseButtonPressed : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function(domEvent)
      {
        if ((qx.core.Environment.get("engine.name") == "mshtml")) {
          var buttonIndex = 1;
        } else {
          var buttonIndex = 0;
        }
        return domEvent.button == buttonIndex;
      },

      "default" : qx.lang.Function.empty
    }),
    
    /**
     * Set up event listener for interaction states
     */
    _applyMInteractionState : function() {
      var supportTouch = false;
      var supportMouse = true;
      
      var root = qx.core.Init.getApplication().getRoot();
      
      if (supportTouch) {
        this.addListener("touchstart", this.__MInteractionStateAddPressed, this, true);
        this.addListener("touchleave", this.__MInteractionStateRemovePressed, this, true);
        this.addListener("touchend", this.__MInteractionStateRemovePressed, this, true);
        this.addListener("touchcancel", this.__MInteractionStateRemovePressed, this, true);
      } else if (supportMouse) {
        this.addListener("mouseover", this.__MInteractionStateAddHover, this, true);
        this.addListener("mouseout", this.__MInteractionStateRemoveHover, this, true);
        this.addListener("mousedown", this.__MInteractionStateAddPressed, this, true);
        root.addListener("mouseup", this.__MInteractionStateRemovePressed, this, true);
      }
    },
    
    /**
     * Adds hover state to widget
     */
    __MInteractionStateAddHover : function() {
      var InteractionStateManager = unify.ui.core.InteractionStateManager.getInstance();
      var hovered = InteractionStateManager.getHoveredWidget();
      var pressed = InteractionStateManager.getPressedWidget();
      if ((pressed == null  || pressed == this) && hovered == null) {
        InteractionStateManager.setHoveredWidget(this);
        this.addState("hover");
      }
    },
    
    /**
     * Removes hover state to widget
     */
    __MInteractionStateRemoveHover : function() {
      var InteractionStateManager = unify.ui.core.InteractionStateManager.getInstance();
      
      if (InteractionStateManager.getHoveredWidget() == this) {
        this.removeState("hover");
        this.removeState("pressed");
        InteractionStateManager.setHoveredWidget(null);
      }
    },
    
    /**
     * Adds pressed state to widget
     */
    __MInteractionStateAddPressed : function(domEvent) {
      
      // only react on the left mouse button; ignore all others
      if (domEvent._type == "mousedown" && !this.__isLeftMouseButtonPressed(domEvent)) {
        return;
      }
      
      var InteractionStateManager = unify.ui.core.InteractionStateManager.getInstance();
      if (InteractionStateManager.getPressedWidget() == null) {
        this.addState("pressed");
        InteractionStateManager.setPressedWidget(this);
      }
    },
    
    /**
     * Removes pressed state to widget
     */
    __MInteractionStateRemovePressed : function(domEvent) {
      
      // only react on the left mouse button; ignore all others
      if (domEvent._type == "mousedown" && !this.__isLeftMouseButtonPressed(domEvent)) {
        return;
      }
      
      var InteractionStateManager = unify.ui.core.InteractionStateManager.getInstance();
      if (InteractionStateManager.getPressedWidget() == this) {
        this.removeState("pressed");
        InteractionStateManager.setPressedWidget(null);
      }
    }
  },
  
  destruct : function() {
    var root = qx.core.Init.getApplication().getRoot();
    
    this.removeListener("touchstart", this.__MInteractionStateAddPressed, this, true);
    this.removeListener("touchleave", this.__MInteractionStateRemovePressed, this, true);
    this.removeListener("touchend", this.__MInteractionStateRemovePressed, this, true);
    this.removeListener("touchcancel", this.__MInteractionStateRemovePressed, this, true);
    this.removeListener("mouseover", this.__MInteractionStateAddHover, this, true);
    this.removeListener("mouseout", this.__MInteractionStateRemoveHover, this, true);
    this.removeListener("mousedown", this.__MInteractionStateAddPressed, this, true);
    root.removeListener("mouseup", this.__MInteractionStateRemovePressed, this, true);
  }
});