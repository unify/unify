/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * Root widget bound to the root DOM element
 */
qx.Class.define("unify.view.Root", {
  extend : unify.ui.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],
  
  /**
   * @param rootElement {Element} DOM element the widget root is bound to
   */
  construct : function(rootElement,layout) {
    this.__rootElement = rootElement;
    
    this.base(arguments);
    
    this._setLayout(layout||new qx.ui.layout.Canvas());
    
    qx.event.Registration.addListener(window, "resize", this.__onResize, this);
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "root"
    }
  },
  
  members : {
    // Root element the whole application is based upon
    __rootElement : null,
    
    // overridden
    _createElement : function() {
      return this.__rootElement;
    },
    
    // overridden
    isRootWidget : function() {
      return true;
    },
    
    /**
     * Resize handler to start relayouting
     */
    __onResize : function() {
      qx.ui.core.queue.Layout.add(this);
    },
    
    /** Returns fixed size hint of base layer size */
    getSizeHint : function() {
      var root = this.__rootElement;
      
      var Dimension = qx.bom.element.Dimension;
      var e = {
        width: Dimension.getContentWidth(root),
        height: Dimension.getContentHeight(root)
      };
      return e;
    },
    
    // overridden
    renderLayout : function(left, top, width, height, preventSize) {
      this.base(arguments, left, top, width, height, true);
    }
  },
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  }
});