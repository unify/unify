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
  construct : function(rootElement,rootEventElement,layout) {
    this.__rootElement = rootElement;
    this.__rootEventElement = rootEventElement;
    
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
    
    // Root element that global events use
    __rootEventElement : null,
    
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
    },
    
    __rootEvents : ["touchstart", "touchmove", "touchend", "touchcancel"],
    __EventRegistration : qx.event.Registration,
    
    // overridden
    addListener : function(type, listener, self, capture) {
      if (qx.lang.Array.contains(this.__rootEvents, type)) {
        return this.__EventRegistration.addListener(this.__rootEventElement, type, listener, self, capture);
      } else {
        return this.base(arguments, type, listener, self, capture);
      }
    },
    
    // overridden
    addListenerOnce : function(type, listener, self, capture) {
      if (qx.lang.Array.contains(this.__rootEvents, type)) {
        var callback = function(e) {
          this.__EventRegistration.removeListener(this.__rootEventElement, type, callback, this, capture);
          listener.call(self||this, e);
        };
  
        return this.__EventRegistration.addListener(this.__rootEventElement, type, listener, self, capture);
      } else {
        return this.base(arguments, type, listener, self, capture);
      }
    },
    
    // overridden
    removeListener : function(type, listener, self, capture) {
      if (qx.lang.Array.contains(this.__rootEvents, type)) {
        return this.__EventRegistration.removeListener(this.__rootEventElement, type, listener, self, capture);
      } else {
        return this.base(arguments, type, listener, self, capture);
      }
    },
    
    // overridden
    removeListenerById : function(id) {
      if (qx.lang.Array.contains(this.__rootEvents, type)) {
        return this.__EventRegistration.removeListenerById(this.__rootEventElement, id);
      } else {
        return this.base(arguments, id);
      }
    },
    
    // overridden
    hasListener : function(type, capture) {
      if (qx.lang.Array.contains(this.__rootEvents, type)) {
        return this.__EventRegistration.hasListener(this.__rootEventElement, type, capture);
      } else {
        return this.base(arguments, type, capture);
      }
    }
  },
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  }
});