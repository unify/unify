/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.core.MRemoteChildrenHandling", {

  members : {
    // TODO:
    getChildren : function() {
      return this.getChildrenContainer().getChildren();
    },
    hasChildren : function() {
      return this.getChildrenContainer().hasChildren();
    },
    add: function(child, options) {
      this.getChildrenContainer().add(child, options);
    },
    remove: function(child) {
      this.getChildrenContainer().remove(child);
    },
    removeAll: function() {
      this.getChildrenContainer().removeAll();
    },
    indexOf: function(child) {
      return this.getChildrenContainer().indexOf(child);
    },
    addAt: function(child, index, options) {
      this.getChildrenContainer().addAt(child, index, options);
    },
    addBefore: function(child, before, options) {
      this.getChildrenContainer().addBefore(child, before, options);
    },
    addAfter: function(child, after, options) {
      this.getChildrenContainer().addAfter(child, after, options);
    },
    removeAt: function(index) {
      this.getChildrenContainer().removeAt(index);
    },
    
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
    },
    
    /**
     * Set style on remote container
     *
     * @param map {Map[]} Style map to apply on remote container
     */
    setOuterStyle : function(map) {
      this._setStyle(map);
    },

    /**
     * Get style of remote container
     *
     * @param name {String} Name of style property
     * @param computed {Boolean?false} Compute style if not set directly on child container
     * @return {Var} Style value
     */
    getOuterStyle : function(name, computed) {
      return this._getStyle(name, computed);
    }
  }
});
