/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 *
 * Simple content widget based upon html DIV element
 */
qx.Class.define("unify.ui.widget.basic.Content", {
  extend : unify.ui.widget.core.Widget,
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  }
});
