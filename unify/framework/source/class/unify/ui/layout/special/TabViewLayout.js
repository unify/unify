/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.layout.special.TabViewLayout", {
  include : [unify.ui.layout.Base],
  
  members : {
    __content : null,
    __bar : null,
  
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var content = this.__content;
      var bar = this.__bar;
      
      var contentMarginLeft = content.getMarginLeft();
      var contentMarginRight = content.getMarginRight();
      var contentMarginTop = content.getMarginTop();
      
      var barMarginLeft = bar.getMarginLeft();
      var barMarginBottom = bar.getMarginBottom();
      var barMarginRight = bar.getMarginRight();
      var barMarginTop = bar.getMarginTop();
      var barSizeHint = bar.getSizeHint();
      var barOuterHeight = barSizeHint.height + barMarginTop + barMarginBottom;
      
      bar.renderLayout(barMarginLeft, availHeight-barSizeHint.height-barMarginBottom, availWidth-barMarginLeft-barMarginRight, barSizeHint.height);
      content.renderLayout(contentMarginLeft, contentMarginTop, availWidth-contentMarginLeft-contentMarginRight, availHeight-barOuterHeight);
    },
    
    /**
     * Rebuilds cache of layout children
     */
    __rebuildCache : function() {
      var all = this._getLayoutChildren();
      
      if (all.length != 2) {
        this.error("TabView supports only exactly 2 children!");
      }
      
      for (var i=0,ii=all.length; i<ii; i++) {
        var child = all[i];
        
        var childProp = child.getLayoutProperties();
        var type = childProp.type;
        if (type == "bar") {
          this.__bar = child;
        } else {
          this.__content = child;
        }
      }
    }
  }
});
