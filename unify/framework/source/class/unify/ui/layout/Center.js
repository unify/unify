/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.Center", {
  extend : qx.ui.layout.Abstract,
  
  members : {
    __content : null,
    __bar : null,
  
    renderLayout : function(availWidth, availHeight) {
      if (core.Env.getValue("debug")) {
        if (this._getLayoutChildren().length != 1) {
          this.error("Center layout only supports one child");
        }
      }

      var element = this._getLayoutChildren()[0];
      var elementSizeHint = element.getSizeHint();
      
      var marginLeft = element.getMarginLeft();
      var marginTop = element.getMarginTop();
      var elementWidth = elementSizeHint.width + marginLeft + element.getMarginRight();
      var elementHeight = elementSizeHint.height + marginTop + element.getMarginBottom();
      
      var left = Math.round(availWidth / 2.0 - elementSizeHint.width / 2.0);
      var top = Math.round(availHeight / 2.0 - elementSizeHint.height / 2.0);
      
      if (left < 0) {
        left = 0;
      } else if (left < marginLeft) {
        left = marginLeft;
      }
      if (top < 0) {
        top = 0;
      } else if (top < marginTop) {
        top = marginTop;
      }
      
      var width = elementSizeHint.width;
      if (width > availWidth) {
        width = availWidth;
      }
      
      var height = elementSizeHint.height;
      if (height > availHeight) {
        height = availHeight;
      }
      
      element.renderLayout(
        left,
        top,
        width,
        height
      );
    },
    
    _computeSizeHint : function() {
      var element = this._getLayoutChildren()[0];
      var elementSizeHint = element.getSizeHint();
      
      return {
        width: elementSizeHint.width,
        minwidth: elementSizeHint.width + element.getMarginLeft() + element.getMarginRight(),
        height: elementSizeHint.height,
        minheight: elementSizeHint.height + element.getMarginTop() + element.getMarginBottom()
      };
    }
  }
});
