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
    },
    
    spacing : {
      init: 0
    }
  },
  
  construct : function(spacing) {
    if (spacing) {
      this.setSpacing(spacing);
    }
  },
  
  members : {
    __childrenCache : null,
    __overallFlex : 0,
    __hasFlex : null,
    __hasNoFlex : null,
    __sizeCache : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var space = this.getSpacing();
      var left = 0;
      var hasFlex = this.__hasFlex;
      var hasNoFlex = this.__hasNoFlex;
      var sizeCache = this.__sizeCache;
      var cache = this.__childrenCache;
      var i, ii;
      
      if (hasFlex.length > 0) {
        var overallFlex = this.__overallFlex;
        var usedNoFlexWidth = 0;
        var e;
        
        for (i=0,ii=hasNoFlex.length; i<ii; i++) {
          e = sizeCache[hasNoFlex[i]];
          
          e.size.width = e.size.minWidth;
          usedNoFlexWidth += e.size.width;
        }
        
        var flexUnit = (availWidth - usedNoFlexWidth) / overallFlex;
        
        for (i=0,ii=hasFlex.length; i<ii; i++) {
          e = sizeCache[hasFlex[i]];
          
          e.size.width = Math.round(flexUnit * e.flex);
        }
      }

      for (i=0,ii=sizeCache.length; i<ii; i++) {
        var element = sizeCache[i];
        var widget = element.widget;
        var calc = element.properties;
        var size = element.size;
        
        var alignY = widget.getAlignY();
        var top;
        var width = size.width;
        var height = availHeight;
        
        if (size.maxHeight && height > size.maxHeight) {
          height = size.maxHeight;
        }
        
        if (alignY == "top") {
          top = widget.getMarginTop();
        } else if (alignY == "center") {
          top = Math.round(availHeight / 2 - height / 2);
        } else {
          top = availHeight - height - widget.getMarginBottom();
        }
        
        var leftGap = unify.ui.layout.Util.calculateLeftGap(widget);
        var rightGap = unify.ui.layout.Util.calculateRightGap(widget);
        
        left += leftGap;
        widget.renderLayout(left, top, width, height);
        
        left += width + rightGap + space;
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
      var children = this.__childrenCache = this._getLayoutChildren();
      var flex = this.__hasFlex = [];
      var noFlex = this.__hasNoFlex = [];
      var sizes = this.__sizeCache = [];
      var overallFlex = 0;
      
      for (var i=0,ii=children.length; i<ii; i++) {
        var child = children[i];
        var props = child.getLayoutProperties();

        var flexState = props.flex;
        if (flexState) {
          flex.push(i);
          overallFlex += flexState;
          sizes.push({widget: child, properties: props, flex: flexState, size: child.getSizeHint()});
        } else {
          noFlex.push(i);
          sizes.push({widget: child, properties: props, flex: false, size: child.getSizeHint()});
        }
      }
      
      this.__overallFlex = overallFlex;
    }
  }
});