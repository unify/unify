/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 - 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Interaction state manager to support in hovering and pressing the right widgets
 */
core.Class("unify.ui.core.InteractionStateManager", {
  
  properties : {
    /**
     * Widget that is hovered
     */
    hoveredWidget : {
      nullable: true
    },
    
    /**
     * Widget that is pressed
     */
    pressedWidget : {
      nullable: true
    }
  }
});
unify.core.Singleton.annotate(unify.ui.core.InteractionStateManager);