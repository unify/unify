/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
 
core.Class("unify.ui.basic.AnimatedImage", {
  include: [unify.ui.basic.Image, unify.fx.MWidgetAnimation],
  
  construct : function(source) {
    unify.ui.basic.Image.call(this, source);
    unify.fx.MWidgetAnimation.call(this);
    
    this.setAnimateRotateDuration(1500);
    this.addListener("changeVisibility", this.__onChangeVisibility, this);
  },
  
  members : {
    /**
     * Event handler for visibility changes
     *
     * @param e {Event} Change event
     */
    __onChangeVisibility : function(e) {
      if (e.getData() == "visible") {
        this.setAnimateRotateInfinite(true);
        this.setAnimateRotate(360);
      } else {
        this.setAnimateRotateInfinite(false);
        this.setAnimateRotate(null);
      }
    }
  }
});