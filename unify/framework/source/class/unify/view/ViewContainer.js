/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.view.ViewContainer", {
  extend : unify.ui.widget.core.Widget,
  
  include : [
    qx.ui.core.MChildrenHandling
  ],
  
  construct : function(layout) {
    this.base(arguments);
    
    if (!layout) {
      layout = new qx.ui.layout.Canvas();
    }
    this._setLayout(layout);
    
    qx.event.Registration.addListener(window, "resize", this.__onResize, this);
  },
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "layer"
    }
  },
  
  members : {
    _createElement : function() {
      var e = document.createElement("div");
      return e;
    },
    
    // overridden
    isRootWidget : function() {
      return this.__isMaster;
    },
    
    setMasterView : function(isMaster) {
      this.__isMaster = isMaster;
    },
    
    __onResize : function() {
      qx.ui.core.queue.Layout.add(this);
    },
    
    /** Returns fixed size hint of base layer size */
    getSizeHint : function() {
      if (this.__isMaster) {
        var Dimension = qx.bom.element.Dimension;
        var e = {
          width: Dimension.getContentWidth(document.body),
          height: Dimension.getContentHeight(document.body)
        };
        return e;
      } else {
        return this.base(arguments);
      }
    }
  },
  
  destruct : function() {
    qx.event.Registration.removeListener(window, "resize", this.__onResize, this);
  },
  
  defer : function(statics, members) {
    qx.ui.core.MLayoutHandling.remap(members);
    qx.ui.core.MChildrenHandling.remap(members);
  }
});