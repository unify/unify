/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.OverlayLayout", {
  extend : qx.ui.layout.Abstract,
  
  members : {
    __arrow : null,
    __arrowDirection : null,
    __arrowAlignment : null,
    
    __content : null,
  
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var arrow = this.__arrow;
      var content = this.__content;
      
      var arrowHint;
      var arrowDirection = "left";
      var arrowAlignment = "center";
      
      if (arrow) {
        var arrowDirection = arrow.getDirection();
        var arrowAlignment = this.__arrowAlignment;
        
        arrowHint = arrow.getSizeHint();
      } else {
        arrowHint = {
          width: 0,
          height: 0
        };
      }
      var arrowWidth = arrowHint.width;
      var arrowHeight = arrowHint.height;
      var arrowLeft = 0;
      var arrowTop = 0;
      
      var contentWidth = availWidth;
      var contentHeight = availHeight;
      var contentLeft = 0;
      var contentTop = 0;
      
      var GAP = 1;
      
      if (arrowDirection == "left") {
        contentLeft = arrowWidth;
        contentWidth -=  arrowWidth;
      } else if (arrowDirection == "right") {
        arrowLeft = availWidth - arrowWidth;
        contentWidth -=  arrowWidth;
      } else if (arrowDirection == "top") {
        contentTop = arrowWidth;
        contentHeight -= arrowWidth;
      } else if (arrowDirection == "bottom") {
        arrowTop = availHeight - arrowHeight;
        contentHeight -= arrowWidth;
      }
      
      if (arrowAlignment == "top") {
        if (arrowDirection == "left" || arrowDirection == "right") {
          arrowTop += GAP;
        } else {
          this.error("Layout combination of " + arrowAlignment + " and " + arrowDirection + " is not allowed");
        }
      } else if (arrowAlignment == "bottom") {
        if (arrowDirection == "left" || arrowDirection == "right") {
          arrowTop = contentHeight - arrowHeight - GAP;
        } else {
          this.error("Layout combination of " + arrowAlignment + " and " + arrowDirection + " is not allowed");
        }
      } else if (arrowAlignment == "left") {
        if (arrowDirection == "top" || arrowDirection == "bottom") {
          arrowLeft = GAP;
        } else {
          this.error("Layout combination of " + arrowAlignment + " and " + arrowDirection + " is not allowed");
        }
      } else if (arrowAlignment == "right") {
        if (arrowDirection == "top" || arrowDirection == "bottom") {
          arrowLeft = contentWidth - arrowHeight - GAP;
        } else {
          this.error("Layout combination of " + arrowAlignment + " and " + arrowDirection + " is not allowed");
        }
      } else if (arrowAlignment == "center") {
        if (arrowDirection == "left" || arrowDirection == "right") {
          arrowTop = Math.round(contentHeight / 2 - arrowHeight/2);
        } else {
          arrowLeft = Math.round(contentWidth / 2 - arrowHeight/2);
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
          this.__arrowAlignment = childProp.alignment;
        } else if (!type || type == "content") {
          this.__content = child;
        } else {
          throw new Error("Type '"+type+"' is not supported!");
        }
      }
    }
  }
});
