core.Class("unify.ui.layout.Base", {
  
  include : [unify.core.Object],
  
  construct : function() {
    unify.core.Object.call(this);
  },
  
  members : {
    __widget : null,
    _invalidChildrenCache : true,
    __sizeHint : null,
    
    /**
     * Connects @widget {unify.ui.core.Widget} to layout
     */
    connectWidget : function(widget) {
      this.__widget = widget;
    },
    
    _getWidget : function() {
      return this.__widget;
    },
    
    _applyLayoutChange : function() {
      if (this.__widget) {
        this.__widget.scheduleLayoutUpdate();
      }
    },
    
    /**
     * {Boolean} If layout can calculate height for a given width this function returns true.
     */
    hasHeightForWidth : function() {
      return false;
    },
    
    /**
     * {Integer} Returns calculated height for given @width {Integer}. Please check hasHeightForWidth as
     * not every layout supports this calculation.
     */
    getHeightForWidth : function(width) {
      console.error("getHeightForWidth is not implemented!", this.constructor);
      return null;
    },
    
    /**
     * Sets flag to invalidate children cache. This is done in next layouting phase.
     */
    invalidateChildrenCache : function() {
      this._invalidChildrenCache = true;
    },
    
    /**
     * Invalidates cached layouting size hint.
     */
    invalidateLayoutCache : function() {
      this.__sizeHint = null;
    },
    
    /**
     * Render part of layout stack that is managed by this layout manager. The part
     * has size @availWidth {Integer} and @availHeight {Integer}.
     */
    renderLayout : function(availWidth, availHeight) {
      console.error("renderLayout is not implemented! ", this.constructor);
    },
    
    _computeSizeHint : function() {
      
    },
    
    /**
     * {Map} Calculates size of child widgets in this layout.
     */
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
        return widget.getLayoutChildren();
      }
      
      return [];
    }
  }
});