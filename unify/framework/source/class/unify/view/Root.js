/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.view.Root", {
  extend : unify.ui.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],
  
  construct : function(rootElement) {
    this.__rootElement = rootElement;
    
    this.base(arguments);
    
    this._setLayout(new qx.ui.layout.Canvas());
    
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
    
    _createElement : function() {
      return this.__rootElement;
    },
    
    // overridden
    isRootWidget : function() {
      return true;
    },
    
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
    }
  },
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MChildrenHandling.remap(members);
  }
});