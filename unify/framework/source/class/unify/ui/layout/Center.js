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
      if (qx.core.Environment.get("qx.debug")) {
        if (this._getLayoutChildren().length != 1) {
          this.error("Center layout only supports one child");
        }
      }

      var element = this._getLayoutChildren()[0];
      var elementSizeHint = element.getSizeHint();
      
      var left = Math.round(availWidth / 2.0 - elementSizeHint.width / 2.0);
      var top = Math.round(availHeight / 2.0 - elementSizeHint.height / 2.0);
      
      if (left < 0) {
        left = 0;
      }
      if (top < 0) {
        top = 0;
      }
      
      element.renderLayout(
        left,
        top,
        elementSizeHint.width,
        elementSizeHint.height
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
