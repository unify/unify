/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.basic.AnimatedImage", {
  extend: unify.ui.basic.Image,
  include: [unify.fx.MWidgetAnimation],
  
  construct : function(source) {
    this.base(arguments, source);
    
    this.setAnimateRotateDuration(1500);
    this.addListener("changeVisibility", this.__onChangeVisibility, this);
  },
  
  members : {
    renderLayout : function(left, top, width, height, prevent) {
      this.base(arguments, left, top, width, height, prevent);
    },
    
    __onChangeVisibility : function(e) {
      if (e.getData() == "visible") {
        this.setAnimateRotateInfinite(true);
        this.setAnimateRotate(360);
      } else {
        this.setAnimateRotateInfinite(false);
      }
    }
  }
});