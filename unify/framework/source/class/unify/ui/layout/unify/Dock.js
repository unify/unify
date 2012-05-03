/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

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
      var size = this.__childrenSizeCache;
      
      var renderQueue = [];
      
      var centerElement = null;
      var allocatedLeft = 0;
      var allocatedRight = 0;
      var allocatedTop = 0;
      var allocatedBottom = 0;
      
      var horizontalFlex = 0;
      var verticalFlex = 0;
      var nonFlexMinWidth = 0;
      var nonFlexMinHeight = 0;
      
      var availFlexWidth = 0;
      var availFlexHeight = 0;
      
      for (var i=0,ii=cache.length; i<ii; i++) {
        var prop = cache[i].getLayoutProperties();
        if (prop.flex) {
          if (prop.edge == "west" || prop.edge == "east") {
            horizontalFlex += prop.flex;
          } else {
            verticalFlex += prop.flex;
          }
        } else {
          if (prop.edge == "center") {
            nonFlexMinWidth += size[i].minWidth + cache[i].getMarginLeft() + cache[i].getMarginRight();
            nonFlexMinHeight += size[i].minHeight + cache[i].getMarginTop() + cache[i].getMarginBottom();
          } else if (prop.edge == "west" || prop.edge == "east") {
            nonFlexMinWidth += size[i].minWidth + cache[i].getMarginLeft() + cache[i].getMarginRight();
          } else {
            nonFlexMinHeight += size[i].minHeight + cache[i].getMarginTop() + cache[i].getMarginBottom();
          }
        }
      }
      
      if (horizontalFlex > 0) {
        availFlexWidth = availWidth - nonFlexMinWidth;
      }
      if (verticalFlex > 0) {
        availFlexHeight = availHeight - nonFlexMinHeight;
      }

      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var wSize = size[i];
        
        var prop = widget.getLayoutProperties();
        
        if (prop.edge == "center") {
          if (core.Env.getValue("debug") && centerElement) {
            throw new Error("Dock layout only supports one center!");
          }
          centerElement = widget;
        }
        
        if (prop.edge != "center") {
          var leftGap = widget.getMarginLeft();
          var rightGap = widget.getMarginRight();
          var topGap = widget.getMarginTop();
          var bottomGap = widget.getMarginBottom();
          
          var left;
          var top;
          var width;
          var height;
          
          var flex = prop.flex;
          
          if (prop.edge == "west") {
            if (flex) {
              wSize.width = Math.min(Math.round(availFlexWidth / horizontalFlex * flex), wSize.maxWidth);
            }
            width = Math.max(wSize.width, wSize.minWidth);
            height = availHeight - allocatedTop - allocatedBottom;
            left = leftGap + allocatedLeft;
            top = allocatedTop;
            allocatedLeft += leftGap + rightGap + width;
          } else if (prop.edge == "east") {
            if (flex) {
              wSize.width = Math.min(Math.round(availFlexWidth / horizontalFlex * flex), wSize.maxWidth);
            }
            width = Math.max(wSize.width, wSize.minWidth);
            height = availHeight - allocatedTop - allocatedBottom;
            left = availWidth - (rightGap + allocatedRight + width);
            top = allocatedTop;
            allocatedRight += leftGap + rightGap + width;
          } else if (prop.edge == "north") {
            width = availWidth - allocatedLeft - allocatedRight;
            if (flex) {
              wSize.height = Math.min(Math.round(availFlexHeight / verticalFlex * flex), wSize.maxHeight);
            }
            height = Math.max(wSize.height, wSize.minHeight);
            top = topGap + allocatedTop;
            left = allocatedLeft;
            allocatedTop += topGap + bottomGap + height;
          } else if (prop.edge == "south") {
            width = availWidth - allocatedLeft - allocatedRight;
            if (flex) {
              wSize.height = Math.min(Math.round(availFlexHeight / verticalFlex * flex), wSize.maxHeight);
            }
            height = Math.max(wSize.height, wSize.minHeight);
            top = availHeight - (bottomGap + allocatedBottom + height);
            left = allocatedLeft;
            allocatedBottom += topGap + bottomGap + height;
          }
          
          if (width > wSize.maxWidth) {
            width = wSize.maxWidth;
          }
          if (height > wSize.maxHeight) {
            height = wSize.maxHeight;
          }
  
          renderQueue.push([widget, left, top, width, height]);
        }
      }
      if (centerElement) {
        var centerMarginLeft = centerElement.getMarginLeft();
        var centerMarginTop = centerElement.getMarginTop();
        var centerMarginRight = centerElement.getMarginRight();
        var centerMarginBottom = centerElement.getMarginBottom();
        
        var width = availWidth - allocatedLeft - allocatedRight - centerMarginLeft - centerMarginRight;
        var height = availHeight - allocatedTop - allocatedBottom - centerMarginTop - centerMarginBottom;
        
        var size = centerElement.getSizeHint();
        
        if (width > size.maxWidth) {
          width = size.maxWidth;
        }
        if (height > size.maxHeight) {
          height = size.maxHeight;
        }
        
        renderQueue.push([centerElement, allocatedLeft + centerMarginLeft, allocatedTop + centerMarginTop, width, height]);
      }
      
      var w;
      while ((w = renderQueue.pop())) {
        if (this._getWidget().constructor == "[class ppbase.ui.epub.EPubReader]") {
          console.log(w[0].getElement(), JSON.stringify(w[0].getSizeHint()));
        }
        w[0].renderLayout(w[1], w[2], w[3], w[4]);
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var allocatedLeft = 0;
      var allocatedRight = 0;
      var allocatedTop = 0;
      var allocatedBottom = 0;
      
      var allocatedMinLeft = 0;
      var allocatedMinRight = 0;
      var allocatedMinTop = 0;
      var allocatedMinBottom = 0;
      
      var center;
      
      var cache = this.__childrenCache;
      for (var i=0,ii=cache.length; i<ii; i++) {
        var widget = cache[i];
        var prop = widget.getLayoutProperties();
        var size = widget.getSizeHint();
        
        if (prop.edge == "north") {
          allocatedTop += size.height;
          allocatedMinTop += size.minHeight;
        } else if (prop.edge == "east") {
          allocatedRight += size.width;
          allocatedMinRight += size.minWidth;
        } else if (prop.edge == "south") {
          allocatedBottom += size.height;
          allocatedMinBottom += size.minHeight;
        } else if (prop.edge == "west") {
          allocatedLeft += size.width;
          allocatedMinLeft += size.minWidth;
        } else {
          center = size;
        }
      }
      
      return {
        width: allocatedLeft + allocatedRight + (center?center.width:0),
        height: allocatedTop + allocatedBottom + (center?center.height:0),
        minWidth: allocatedMinLeft + allocatedMinRight + (center?center.minWidth:0),
        minHeight: allocatedMinTop + allocatedMinBottom + (center?center.minHeight:0)
      };
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
      
      var size = this.__childrenSizeCache = [];
      for (var i=0,ii=cache.length; i<ii; i++) {
        size.push(cache[i].getSizeHint());
      }
      
      this.__childrenCache = cache;
    }
  }
});