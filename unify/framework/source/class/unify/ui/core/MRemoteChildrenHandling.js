/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Mixin.define("unify.ui.core.MRemoteChildrenHandling", {
  include : qx.ui.core.MRemoteChildrenHandling,

  members : {
    /**
     * Set style on remote container
     *
     * @param map {Map[]} Style map to apply on remote container
     */
    setStyle : function(map) {
      this.getChildrenContainer().setStyle(map);
    },

    /**
     * Get style of remote container
     *
     * @param name {String} Name of style property
     * @param computed {Boolean?false} Compute style if not set directly on child container
     * @return {Var} Style value
     */
    getStyle : function(name, computed) {
      return this.getChildrenContainer().getStyle(name, computed);
    }
  }
});
