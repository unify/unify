/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * Generic virtual composite container widget
 * This widgets creates no DOM element but uses DocumentFragment to support less DIVs in final HTML code
 */
core.Class("unify.ui.container.Virtual", {
  include : [
    unify.ui.core.Widget,
    unify.ui.core.MChildrenHandling/*,
    unify.ui.core.MLayoutHandling*/
  ],

  /**
   * @param layout {qx.ui.layout.Abstract?null} Layout of composite
   */
  construct : function(layout) {
    unify.ui.core.Widget.call(this);
    unify.ui.core.MChildrenHandling.call(this);
    /*unify.ui.core.MLayoutHandling.call(this);*/

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
    setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle,
      
    _createElement : function() {
      return document.createDocumentFragment();
    }
  }/* TODO: ,

  defer : function(statics, members) {
    qx.ui.core.MLayoutHandling.remap(members);
    qx.ui.core.MChildrenHandling.remap(members);
  }*/
});
