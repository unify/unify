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
  
  properties : {
    sort : {
      type : ["auto", "x", "y"],
      init: "auto"
    }
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
          
          if (prop.edge == "west") {
            width = Math.max(size.width, size.minWidth);
            height = availHeight - allocatedTop - allocatedBottom;
            left = leftGap + allocatedLeft;
            top = allocatedTop;
            allocatedLeft += leftGap + rightGap + width;
          } else if (prop.edge == "east") {
            width = Math.max(size.width, size.minWidth);
            height = availHeight - allocatedTop - allocatedBottom;
            left = availWidth - (rightGap + allocatedRight + width);
            top = allocatedTop;
            allocatedRight += leftGap + rightGap + width;
          } else if (prop.edge == "north") {
            width = availWidth - allocatedLeft - allocatedRight;
            height = Math.max(size.height, size.minHeight);
            top = topGap + allocatedTop;
            left = allocatedLeft;
            allocatedTop += topGap + bottomGap + height;
          } else if (prop.edge == "south") {
            width = availWidth - allocatedLeft - allocatedRight;
            height = Math.max(size.height, size.minHeight);
            top = availHeight - (bottomGap + allocatedBottom + height);
            left = allocatedLeft;
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
      }
      if (centerElement) {
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
      var sort = this.getSort();
      var cache = this._getLayoutChildren();
      
      if (sort == "x") {
        var first = [];
        var second = [];
        
        for (var i=0,ii=cache.length; i<ii; i++) {
          var e = cache[i];
          var edge = e.getLayoutProperties();
          if (edge == "west" || edge == "east") {
            first.push(e);
          } else {
            second.push(e);
          }
        }
        
        cache = first.concat(second);
      } else if (sort == "y") {
        var first = [];
        var second = [];
        
        for (var i=0,ii=cache.length; i<ii; i++) {
          var e = cache[i];
          var edge = e.getLayoutProperties();
          if (edge == "north" || edge == "south") {
            first.push(e);
          } else {
            second.push(e);
          }
        }
        
        cache = first.concat(second);
      }
      
      this.__childrenCache = cache;
    }
  }
});