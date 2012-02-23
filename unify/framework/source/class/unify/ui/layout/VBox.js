/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Wrapper for qooxdoo layout class
 */
core.Class("unify.ui.layout.VBox", {
  include : [unify.ui.layout.Base],
  
  properties : {
    alignX: {
      init: "left"
    },
    alignY: {
      init: "top"
    }
  },
  
  members : {
    __childrenCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var top = 0;
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        var alignX = this.getAlignX();
        var left;
        var width;
        var height = size.height;
        
        if (alignX == "left") {
          left = 0;
          width = size.width;
        } else if (alignX == "center") {
          left = Math.round(availHeight / 2 - size.height / 2);
          width = size.width;
        } else {
          width = size.width;
          left = availHeight - width;
        }
        
        widget.renderLayout(left, top, width, height);
        
        top += height;
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
      }
      
      return null;
    },
    
    __rebuildChildrenCache : function() {
      this.__childrenCache = this._getLayoutChildren();
    }
  }
});