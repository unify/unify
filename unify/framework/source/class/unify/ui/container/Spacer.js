/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Spacer widget
 */
qx.Class.define("unify.ui.container.Spacer", {
  extend: unify.ui.core.Widget,
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "spacer"
    }
  },
  
  construct : function() {
    this.base(arguments);
    this.setLayoutProperties({flex: 1});
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    }
  }
});