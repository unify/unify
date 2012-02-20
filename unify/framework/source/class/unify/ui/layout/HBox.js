/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Wrapper for qooxdoo layout class
 */
core.Class("unify.ui.layout.HBox", {
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
      
      var left = 0;
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        var alignY = this.getAlignY();
        var top;
        var width = size.width;
        var height;
        
        if (alignY == "top") {
          top = 0;
          height = size.height;
        } else if (alignY == "center") {
          top = Math.round(availHeight / 2 - size.height / 2);
          height = size.height;
        } else {
          height = size.height;
          top = availHeight - height;
        }
        
        widget.renderLayout(left, top, width, height);
        
        left += width;
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