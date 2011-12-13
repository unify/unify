/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * A simple widget that shows html content. 
 */
qx.Class.define("unify.ui.embed.Html", {
  extend : unify.ui.core.Widget,
  
  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "html"
    },
    
    /**
     * the actual html content
     */
    html : {
      nullable: true,
      apply: "_applyHtml"
    }
  },
  
  members : {
    
    // overridden
    _createElement : function() {
      var div = document.createElement("div");
      return div;
    },
    
    // overridden
    _hasHeightForWidth : function() {
      return true;
    },
    
    // overridden
    _getHeightForWidth : function(width)
    {
      var el = this.getElement();
      
      var origWidth = el.style.width;
      var origHeight = el.style.height;
      var origVisibility = el.style.visibility;
      
      el.style.width = width != undefined ? width + "px" : "auto";
      el.innerHTML = this.getHtml();
      
      el.style.height = null;
      el.style.visibility = "hidden";
      
      var height = qx.bom.element.Dimension.getHeight(el);
      
      el.style.width = origWidth;
      el.style.height = origHeight;
      el.style.visibility = origVisibility;
      
      return height;
    },
    
    /**
     * Trigger invalidation of parent layout
     */
    __invalidateParentLayout : function() {
      this.scheduleLayoutUpdate();
      var layoutParent = this.getLayoutParent();
      if (layoutParent) {
        layoutParent.getLayout().invalidateLayoutCache();
      }
    },

    /**
     * Apply the new HTML content to the inner element an trigger a relayouting
     * 
     * @param value {String} apply HTML content to the inner DOM element
     */
    _applyHtml : function(value) {
      this.getContentElement().innerHTML = value;
      this.__invalidateParentLayout();
    },
    
    // overridden
    setStyle : function(map) {
      this._setStyle(map);
      this.__invalidateParentLayout();
    }
  }
});
