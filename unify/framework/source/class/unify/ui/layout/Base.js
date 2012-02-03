core.Class("unify.ui.layout.Base", {
  
  include : [unify.core.Object],
  
  members : {
    __widget : null,
    _invalidChildrenCache : false,
    
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
      return null;
    },
    
    invalidateChildrenCache : function() {
      this._invalidChildrenCache = true;
    },
    
    invalidateLayoutCache : function() {
    },
    
    renderLayout : function(availWidth, availHeight) {
      
    },
    
    _computeSizeHint : function() {
      
    },
    
    getSizeHint : function() {
      
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