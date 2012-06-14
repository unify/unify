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
   * Constructor. A @layout {unify.ui.layout.Base?null} can be given.
   */
  construct : function(layout) {
    unify.ui.core.Widget.call(this);
    
    if (layout) {
      this._setLayout(layout);
    }
  },
  
  properties : {
    /** {String} Appearance ID of widget used by theme system */
    appearance : {
      init: "composite"
    }
  },
  
  members : {
    _createElement : function() {
      return document.createElement("div");
    },
    
    /**
     * Set styles of @map {Map} to the element.
     */
    setStyle : unify.ui.core.MChildrenHandling.prototype.setStyle
  }
});