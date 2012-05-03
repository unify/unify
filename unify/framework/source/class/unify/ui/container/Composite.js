/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * Generic composite container widget
 */
core.Class("unify.ui.container.Composite", {
  include : [unify.ui.core.Widget, unify.ui.core.MChildrenHandling],
  
  /**
   * @param layout {unify.ui.layout.Base?null} Layout of composite
   */
  construct : function(layout) {
    unify.ui.core.Widget.call(this);
    
    if (layout) {
      this._setLayout(layout);
    }
  },
  
  properties : {
    // overridden
    appearance : {
      init: "composite"
    }
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    },
    
    setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle
  }
});