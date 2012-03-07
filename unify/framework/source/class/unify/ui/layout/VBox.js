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
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var space = this.getSpacing();
      var top = 0;
      var hasFlex = this.__hasFlex;
      var hasNoFlex = this.__hasNoFlex;
      var sizeCache = this.__sizeCache;
      var i, ii;
      
      if (hasFlex.length > 0) {
        var overallFlex = this.__overallFlex;
        var usedNoFlexHeight = 0;
        var e;
        
        for (i=0,ii=hasNoFlex.length; i<ii; i++) {
          e = sizeCache[hasNoFlex[i]];
          e.size.height = e.size.minHeight;
          usedNoFlexHeight += e.size.height;
        }
        
        var flexUnit = (availHeight - usedNoFlexHeight) / overallFlex;
        
        for (i=0,ii=hasFlex.length; i<ii; i++) {
          e = sizeCache[hasFlex[i]];
          
          e.size.height = Math.round(flexUnit * e.flex);
        }
      }
      
      for (i=0,ii=sizeCache.length; i<ii; i++) {
        var element = sizeCache[i];
        var widget = element.widget;
        var calc = element.properties;
        var size = element.size;
        
        var alignX = widget.getAlignX();
        var left;
        var width = availWidth;
        var height = size.height;
        
        if (size.maxWidth && width > size.maxWidth) {
          width = size.maxWidth;
        }
        
        if (alignX == "left") {
          left = 0;
        } else if (alignX == "center") {
          left = Math.round(availWidth / 2 - width / 2);
        } else {
          left = availWidth - width;
        }
        
        var topGap = unify.ui.layout.Util.calculateTopGap(widget);
        var bottomGap = unify.ui.layout.Util.calculateBottomGap(widget);
        
        top += topGap;
        widget.renderLayout(left, top, width, height);
        
        top += height + bottomGap + space;
      }
    },
    
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildChildrenCache();
      }
      
      var space = this.getSpacing();
      var sizeCache = this.__sizeCache;
      var i, ii;
      
      var minWidth = 0;
      var width = 0;
      var minHeight = 0;
      var height = 0;
      
      for (i=0,ii=sizeCache.length; i<ii; i++) {
        var element = sizeCache[i];
        var widget = element.widget;
        var calc = element.properties;
        var size = element.size;
        
        var horizontalGap = unify.ui.layout.Util.calculateHorizontalGap(widget);
        var verticalGap = unify.ui.layout.Util.calculateVerticalGap(widget);
        var ownMinWidth = size.minWidth + horizontalGap;
        var ownWidth = size.width + horizontalGap;
        
        if (ownMinWidth > minWidth) {
          minWidth = ownMinWidth;
        }
        if (ownWidth > width) {
          width = ownWidth;
        }
        
        minHeight += verticalGap + size.minHeight;
        height += verticalGap + size.height;
        
        if (i > 0) {
          minHeight += space;
          height += space;
        }
      }
      
      return {
        width: width,
        minWidth: minWidth,
        height: height,
        minHeight: minHeight
      };
    },
    
    __rebuildChildrenCache : function() {
      var children = this._getLayoutChildren();
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