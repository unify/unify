/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Mixin.define("unify.ui.core.MRemoteChildrenHandling", {
  include : qx.ui.core.MRemoteChildrenHandling,

  members : {
    setStyle : function(map) {
      this.getChildrenContainer().setStyle(map);
    },

    getStyle : function(name, computed) {
      return this.getChildrenContainer().getStyle(name, computed);
    }
  }
});
