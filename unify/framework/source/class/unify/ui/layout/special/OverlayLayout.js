/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.special.OverlayLayout", {
  extend : qx.ui.layout.Abstract,
  
  members : {
    __arrow : null,
    __content : null,
  
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var arrow = this.__arrow;
      var content = this.__content;
      var contentWidth = availWidth;
      var contentHeight = availHeight;
      var contentLeft = 0;
      var contentTop = 0;
      var arrowHint;

      
      if (arrow) {
        var arrowDirection = arrow.getDirection();
        arrowHint = arrow.getSizeHint();
        var arrowWidth = arrowHint.width;
        var arrowHeight = arrowHint.height;
        var arrowPosition = this._getWidget().calculateArrowPosition(contentHeight,contentWidth);
        var arrowLeft = arrowPosition.left;
        var arrowTop = arrowPosition.top;
        if (arrowDirection == "left") {
          contentLeft = arrowWidth;
          contentWidth -=  arrowWidth;
        } else if (arrowDirection == "right") {
          arrowLeft = availWidth - arrowWidth;
          contentWidth -=  arrowWidth;
        } else if (arrowDirection == "top") {
          contentTop = arrowHeight;
          contentHeight -= arrowHeight;
        } else if (arrowDirection == "bottom") {
          arrowTop = availHeight - arrowHeight;
          contentHeight -= arrowHeight;
        } else {
          //invalid direction, should not happen
        }
      }

      content.renderLayout(contentLeft, contentTop, contentWidth, contentHeight);
      if (arrow) {
        arrow.renderLayout(arrowLeft, arrowTop, arrowWidth, arrowHeight);
      }
    },
    
    /**
     * Rebuilds cache of layout children
     */
    __rebuildCache : function() {
      var all = this._getLayoutChildren();
      
      for (var i=0,ii=all.length; i<ii; i++) {
        var child = all[i];
        
        var childProp = child.getLayoutProperties();
        var type = childProp.type;
        if (type == "arrow") {
          this.__arrow = child;
        } else if (!type || type == "content") {
          this.__content = child;
        } else {
          throw new Error("Type '"+type+"' is not supported!");
        }
      }
    }
  }
});
