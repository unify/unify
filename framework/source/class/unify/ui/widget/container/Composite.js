/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Generic composite container widget
 */
qx.Class.define("unify.ui.widget.container.Composite", {
  extend : unify.ui.widget.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  }
});
