/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Mixin to support interaction states (hover, active etc.) on widgets
 */
core.Class("unify.ui.core.MInteractionState", {
  construct : function() {
    this._applyMInteractionState();
  },
  
  members : {
    __MInteractionStatePressed : null,
    
    /**
     * Set up event listener for interaction states
     */
    _applyMInteractionState : function() {
      var supportTouch = true;
      var supportMouse = true;
      
      var root = unify.core.Init.getApplication().getRoot().getElement();
      var element = this.getElement();
      
      if (supportTouch) {
        this.addNativeListener("touchstart", this.__MInteractionStateAddPressed, this);
        this.addNativeListener("touchleave", this.__MInteractionStateRemovePressed, this);
        this.addNativeListener(root, "touchend", this.__MInteractionStateRemovePressed, this);
        this.addNativeListener(root, "touchcancel", this.__MInteractionStateRemovePressed, this);
      }
      if (supportMouse) {
        this.addNativeListener("mouseover", this.__MInteractionStateAddHover, this);
        this.addNativeListener("mouseout", this.__MInteractionStateRemoveHover, this);
      }
      
      this.addListener("blur", this.__MInteractionStateRemoveHover, this);
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
      /* TODO: if (domEvent instanceof qx.event.type.Mouse && !domEvent.isLeftPressed()) {
        return;
      }*/
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
      /* TODO : if (domEvent instanceof qx.event.type.Mouse && !domEvent.isLeftPressed()) {
        return;
      }*/
      var InteractionStateManager = unify.ui.core.InteractionStateManager.getInstance();
      if (InteractionStateManager.getPressedWidget() == this) {
        this.removeState("pressed");
        InteractionStateManager.setPressedWidget(null);
      }
    }
  }
});
