(function() {
  
  var dimensionFnt;
  var stretchFnt;
  dimmensionFnt = stretchFnt = function(value) {
    this.__invalidateParent();
    
    this.invalidateLayoutCache();
    unify.ui.layout.queue.Layout.add(this);
  };
  
  var marginFnt = function() { this._applyMargin(); };
  
  core.Class("unify.ui.core.VisibleBox", {
    include : [unify.core.Object],
    
    properties : {
      width: {
        init: null,
        apply : dimmensionFnt
      },
      minWidth: {
        init: null,
        apply : dimmensionFnt
      },
      maxWidth: {
        init: null,
        apply : dimmensionFnt
      },
      
      height: {
        init: null,
        apply : dimmensionFnt
      },
      minHeight: {
        init: null,
        apply : dimmensionFnt
      },
      maxHeight: {
        init: null,
        apply : dimmensionFnt
      },
      
      marginLeft: {
        init: 0,
        apply : marginFnt
      },
      marginTop: {
        init: 0,
        apply : marginFnt
      },
      marginRight: {
        init: 0,
        apply : marginFnt
      },
      marginBottom: {
        init: 0,
        apply : marginFnt
      },
      
      allowGrowX: {
        init: true,
        apply : stretchFnt
      },
      allowShrinkX: {
        init: true,
        apply : stretchFnt
      },
      
      allowGrowY: {
        init: true,
        apply : stretchFnt
      },
      allowShrinkY: {
        init: true,
        apply : stretchFnt
      },
      
      alignX : {
        type : ["left", "center", "right"],
        init: null,
        nullable: true
      },
      alignY : {
        type : ["top", "middle", "bottom"],
        init: null,
        nullable: true
      },
      
      parentBox : {
        init: null,
        nullable: true
      }
    },
    
    construct : function() {
      unify.core.Object.call(this);
    },
    
    members : {
      /** {Object} Calculated size hint map */
      __sizeHint : null,
      
      __invalidateParent : function() {
        var parent = this;
        
        while ((parent = parent.getParentBox())) {
          parent.invalidateLayoutCache();
          unify.ui.layout.queue.Layout.add(parent);
        }
      },
      
      invalidateLayoutCache : function() {
        this.__sizeHint = null;
      },
      
      _applyMargin : function() {
        var parent = this.getParentBox();
        if (parent) {
          parent.updateLayoutProperties();
        }
      },
      
      getSizeHint : function(compute) {
        var hint = this.__sizeHint;
        
        if (hint) {
          return hint;
        }
        
        if (compute === false) {
          return null;
        }
        
        hint = this.__sizeHint = this._computeSizeHint();
        
        if (this.__computedHeightForWidth && this.getHeight() === null) {
          hint.height = this.__computedHeightForWidth;
        }
        
        if (hint.width < hint.minWidth) {
          hint.width = hint.minWidth;
        }
        if (hint.height < hint.minHeight) {
          hint.height = hint.minHeight;
        }
        
        if (hint.width > hint.maxWidth) {
          hint.width = hint.maxWidth;
        }
        if (hint.height > hint.maxHeight) {
          hint.height = hint.maxHeight;
        }
        
        if (!this.getAllowGrowX()) {
          hint.maxWidth = hint.width;
        }
        if (!this.getAllowGrowY()) {
          hint.maxHeight = hint.height;
        }
        
        if (!this.getAllowShrinkX()) {
          hint.minWidth = hint.width;
        }
        if (!this.getAllowShrinkY()) {
          hint.minHeight = hint.height;
        }
        
        return hint;
      },
      
      _computeSizeHint : function() {
        var width = this.getWidth();
        var height = this.getHeight();
        var maxWidth = this.getMaxWidth();
        var maxHeight = this.getMaxHeight();
        var minWidth = this.getMinWidth() || 0;
        var minHeight = this.getMinHeight() || 0;
  
        return {
          width: width || minWidth,
          height: height || minHeight,
          maxWidth: maxWidth || Infinity,
          maxHeight: maxHeight || Infinity,
          minWidth: minWidth,
          minHeight: minHeight
        };
      },
      
      getNestingLevel : function() {
        var parent = this.getParentBox();
        if (parent) {
          return parent.getNestingLevel()+1;
        } else {
          return 100000;
        }
      },
      
      /** {Array} Cached position and size of element */
      __cache : null,
      
      /** {Integer} Cached height for width applied to element */
      __computedHeightForWidth : null,
      
      getBounds : function() {
        var cache = this.__cache;
        if (!cache) {
          return null;
        }
        
        return {
          left: cache[0],
          top: cache[1],
          width: cache[2],
          height: cache[3]
        };
      },
      
      renderLayout : function(left, top, width, height) {
        
        // Height for width support
        // Results into a relayout which means that width/height is applied in the next iteration.
        var flowHeight = null;
        if (this.getHeight() == null && this._hasHeightForWidth()) {
          flowHeight = this._getHeightForWidth(width);
        }
  
        if (flowHeight != null && flowHeight !== this.__computedHeightForWidth)
        {
          // This variable is used in the next computation of the size hint
          this.__computedHeightForWidth = flowHeight;
          this.__sizeHint = null;
          
          // Re-add to layout queue
          unify.ui.layout.queue.Layout.add(this);
          
          // TODO: Check if this could be done more efficient
          var e = this;
          while ((e = e.getParentBox())) {
            //e.invalidateLayoutCache();
            unify.ui.layout.queue.Layout.add(e);
          }
  
          return null;
        }
        
        var cache = this.__cache;
        if (!cache) {
          cache = this.__cache = [left, top, width, height];
          
          return {
            position: true,
            size: true
          };
        } else {
          var changes = {};
          
          if (left !== cache[0] || top !== cache[1]) {
            changes.position = true;
          }
          if (width !== cache[2] || height !== cache[3]) {
            changes.size = true;
          }
          
          this.__cache = [left, top, width, height];
          
          return changes;
        }
      },
      
      _hasHeightForWidth : function() {
        var layout = this._getLayout();
        if (layout) {
          return layout.hasHeightForWidth();
        }
  
        return false;
      },
      
      _getHeightForWidth : function(width) {
        var layout = this._getLayout();
        if (layout && layout.hasHeightForWidth()) {
          var e = layout.getHeightForWidth(width);
          return e;
        }
  
        return null;
      },
      
      
      _getLayout : function() {
        return null;
      },
      
      /** {Object} Cached layout property map */
      __properties : null,
      
      updateLayoutProperties : function(props) {
        var layout = this._getLayout();
        
        if (layout) {
          layout.invalidateChildrenCache();
        }
        
        unify.ui.layout.queue.Layout.add(this);
      },
      
      setLayoutProperties : function(props) {
        if (!props) {
          return;
        }
        
        var properties = this.__properties;
        if (!properties) {
          properties = this.__properties = {};
        }
        
        var parent = this.getParentBox();
        if (parent) {
          parent.updateLayoutProperties(props);
        }
        
        var keys = Object.keys(props);
        for (var i=0,ii=keys.length; i<ii; i++) {
          var key = keys[i];
          var val = props[key];
          
          if (val === null) {
            delete properties[key];
          } else {
            properties[key] = val;
          }
        }
      },
      
      getLayoutProperties : function() {
        return this.__properties || {};
      }
    }
  });
})();