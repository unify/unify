/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.ui.layout.Dock", {
  include : [unify.ui.layout.Base],
  
  construct : function() {
    unify.ui.layout.Base.call(this);
  },
  
  members : {
    __childrenCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      
      var centerElement = null;
      var allocatedLeft = 0;
      var allocatedRight = 0;
      var allocatedTop = 0;
      var allocatedBottom = 0;
      
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        
        var prop = widget.getLayoutProperties();
        
        if (prop.edge == "center") {
          if (core.Env.getValue("debug") && centerElement) {
            throw new Error("Dock layout only supports one center!");
          }
          centerElement = widget;
        } else {
          var size = widget.getSizeHint();
          
          var leftGap = widget.getMarginLeft();
          var rightGap = widget.getMarginRight();
          var topGap = widget.getMarginTop();
          var bottomGap = widget.getMarginBottom();
          
          var left;
          var top;
          var width;
          var height;
          
          if (prop.edge == "left") {
            width = size.width;
            height = availHeight;
            left = leftGap + allocatedLeft;
            top = 0;
            allocatedLeft += leftGap + rightGap + width;
          } else if (prop.edge == "right") {
            width = size.width;
            height = availHeight;
            left = availWidth - (rightGap + allocatedRight + width);
            top = 0;
            allocatedRight += leftGap + rightGap + width;
          } else if (prop.edge == "top") {
            width = availWidth;
            height = size.height;
            top = topGap + allocatedTop;
            left = 0;
            allocatedTop += topGap + bottomGap + height;
          } else if (prop.edge == "right") {
            width = availWidth;
            height = size.height;
            top = availHeight - (bottomGap + allocatedBottom + height);
            left = 0;
            allocatedBottom += topGap + bottomGap + height;
          }
          
          if (width > size.maxWidth) {
            width = size.maxWidth;
          }
          if (height > size.maxHeight) {
            height = size.maxHeight;
          }
  
          widget.renderLayout(left, top, width, height);
        }
        
        var centerMarginLeft = centerElement.getMarginLeft();
        var centerMarginTop = centerElement.getMarginTop();
        var centerMarginRight = centerElement.getMarginRight();
        var centerMarginBottom = centerElement.getMarginBottom();
        centerElement.renderLayout(allocatedLeft + centerMarginLeft, allocatedTop + centerMarginTop, 
          availWidth - allocatedLeft - allocatedRight - centerMarginLeft - centerMarginRight,
          availHeight - allocatedTop - allocatedBottom - centerMarginTop - centerMarginBottom);
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var calc = widget.getLayoutProperties();
        var size = widget.getSizeHint();
      }
      
      return null;
    },
    
    __rebuildChildrenCache : function() {
      this.__childrenCache = this._getLayoutChildren();
    }
  }
});