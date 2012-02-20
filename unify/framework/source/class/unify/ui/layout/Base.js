core.Class("unify.ui.layout.Base", {
  
  include : [unify.core.Object],
  
  members : {
    __widget : null,
    _invalidChildrenCache : true,
    __sizeHint : null,
    
    connectWidget : function(widget) {
      this.__widget = widget;
    },
    
    _getWidget : function() {
      return this.__widget;
    },
    
    hasHeightForWidth : function() {
      return false;
    },
    
    getHeightForWidth : function(width) {
      console.error("getHeightForWidth is not implemented!", this.constructor);
      return null;
    },
    
    invalidateChildrenCache : function() {
      this._invalidChildrenCache = true;
    },
    
    invalidateLayoutCache : function() {
      this.__sizeHint = null;
    },
    
    renderLayout : function(availWidth, availHeight) {
      console.error("renderLayout is not implemented! ", this.constructor);
    },
    
    _computeSizeHint : function() {
      
    },
    
    getSizeHint : function() {
      var sizeHint = this.__sizeHint;
      
      if (!sizeHint) {
        sizeHint = this.__sizeHint = this._computeSizeHint();
      }
      
      return sizeHint;
    },
    
    _getLayoutChildren : function() {
      this._invalidChildrenCache = false;
      
      var widget = this._getWidget();
      if (widget) {
        return widget.getChildren();
      }
      
      return [];
    }
  }
});