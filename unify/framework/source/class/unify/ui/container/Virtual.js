/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Generic virtual composite container widget
 * This widgets creates no DOM element but uses DocumentFragment to support less DIVs in final HTML code
 */
qx.Class.define("unify.ui.container.Virtual", {
  extend : unify.ui.core.Widget,

  include : [
    qx.ui.core.MChildrenHandling,
    qx.ui.core.MLayoutHandling
  ],

  /**
   * @param layout {qx.ui.layout.Abstract?null} Layout of composite
   */
  construct : function(layout) {
    this.base(arguments);

    if (layout) {
      this._setLayout(layout);
    }
  },

  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "composite"
    }
  },

  members : {
    _createElement : function() {
      return document.createDocumentFragment();
    }
  },

  defer : function(statics, members) {
    qx.ui.core.MLayoutHandling.remap(members);
    qx.ui.core.MChildrenHandling.remap(members);
  }
});
