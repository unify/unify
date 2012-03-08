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
core.Class("unify.view.Root", {
  include : [unify.ui.core.Widget, unify.ui.core.MChildrenHandling],
  
  /**
   * @param rootElement {Element} DOM element the widget root is bound to
   * @param rootEventElement {Element} DOM element to bind global event listeners to
   * @param layout {qx.ui.layout.Abstract} Layout of root element
   */
  construct : function(rootElement,rootEventElement,layout) {
    this.__rootElement = rootElement;
    this.__rootEventElement = rootEventElement;
    
    unify.ui.core.Widget.call(this);
    
    this._setLayout(layout||new unify.ui.layout.Canvas());
    
    lowland.bom.Events.set(window, "resize", this.__onResize.bind(this));
    
    //this.setAppearance("root");
  },
  
  properties : {
    // overridden
    appearance : {
      init: "root"
    }
  },
  
  members : {
    // Root element the whole application is based upon
    __rootElement : null,
    
    // Root element that global events use
    __rootEventElement : null,
    
    // Size hint
    __rootSizeHint : null,
    
    // overridden
    _createElement : function() {
      return this.__rootElement;
    },
    
    // overridden
    isRootWidget : function() {
      return true;
    },
    
    getEventElement : function() {
      return this.__rootEventElement;
    },
    
    /**
     * Resize handler to start relayouting
     */
    __onResize : function() {
      var sizeHint = this._getSizeHint();
      var rootSizeHint = this.__rootSizeHint;
      
      if ((!rootSizeHint) || (sizeHint.width != rootSizeHint.width || sizeHint.height != rootSizeHint.height)) {
        this.__rootSizeHint = null;
        
        this.invalidateLayoutChildren();
        unify.ui.layout.queue.Layout.add(this);
      }
    },
    
    /** Returns fixed size hint of base layer size */
    getSizeHint : function() {
      var rootSizeHint = this.__rootSizeHint;
      if (rootSizeHint) {
        return rootSizeHint;
      }
      
      rootSizeHint = this.__rootSizeHint = this._getSizeHint();
      return rootSizeHint;
    },
    
    /**
     * Returns size hint of root element, this is always dimension of root element (most of the time browser viewport)
     *
     * @return {Map} Calculated size of root element
     */
    _getSizeHint : function() {
      return lowland.bom.Element.getContentSize(this.__rootElement);
    },
    
    // overridden
    renderLayout : function(left, top, width, height, preventSize) {
      unify.ui.core.Widget.prototype.renderLayout.call(this, left, top, width, height, true);
    }
  }/*,
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  }*/
});