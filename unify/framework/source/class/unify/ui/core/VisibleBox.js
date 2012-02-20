core.Class("unify.ui.core.VisibleBox", {
  include : [unify.core.Object],
  
  properties : {
    width: {
      init: null
    },
    minWidth: {
      init: null
    },
    maxWidth: {
      init: null
    },
    
    height: {
      init: null
    },
    minHeight: {
      init: null
    },
    maxHeight: {
      init: null
    },
    
    marginLeft: {
      init: 0
    },
    marginTop: {
      init: 0
    },
    marginRight: {
      init: 0
    },
    marginBottom: {
      init: 0
    },
    
    allowGrowX: {
      init: true
    },
    allowShrinkX: {
      init: true
    },
    
    allowGrowY: {
      init: true
    },
    allowShrinkY: {
      init: true
    }
  },
  
  members : {
    __sizeHint : null,
    
    getSizeHint : function(compute) {
      var hint = this.__sizeHint;
      
      if (hint) {
        return hint;
      }
      
      if (compute === false) {
        return null;
      }
      
      hint = this.__sizeHint = this._computeSizeHint();
      
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
      if (this.isRootWidget()) {
        return 0;
      }
      
      var parent = this.getParentBox();
      if (parent) {
        return parent.getNestingLevel()+1;
      } else {
        return 100000;
      }
    },
    
    __cache : null,
    
    getBounds : function() {
      return this.__cache || null;
    },
    
    renderLayout : function(left, top, width, height) {
      var cache = this.__cache;
      
      console.log("RENDER LAYOUT ", left, top, width, height, this.constructor);
      
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
    
    __parentBox : null,
    
    getParentBox : function() {
      return this.__parentBox;
    },
    
    setParentBox : function(parent) {
      this.__parentBox = parent;
    },
    
    
    
    _getLayout : function() {
      return null;
    },
    
    isRootWidget : function() {
      return false;
    },
    
    
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