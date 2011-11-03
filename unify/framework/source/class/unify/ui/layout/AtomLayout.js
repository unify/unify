/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.AtomLayout", {
  extend : qx.ui.layout.Abstract,
  
  members : {
    renderLayout : function(availWidth, availHeight) {
      var direction = this._getWidget().getDirection();
    
      var children = this._getLayoutChildren();
      var image = children[0];
      var label = children[1];
      
      var imageHint = image.getSizeHint();
      var labelHint = label.getSizeHint();
      
      var imageTop, imageHeight, imageWidth, imageLeft, labelTop, labelHeight, labelWidth, labelLeft;

      if (direction == "left" || direction == "right") {
        if (imageHint.height > availHeight) {
          imageHeight = availHeight;
          imageTop = 0;
        } else {
          imageHeight = imageHint.height;
          imageTop = Math.ceil((availHeight / 2) - (imageHeight / 2));
        }
        if (labelHint.height > availHeight) {
          labelHeight = availHeight;
          labelTop = 0;
        } else {
          labelHeight = labelHint.height;
          labelTop = Math.ceil((availHeight / 2) - (labelHeight / 2));
        }
      }
      
      if (direction == "left") {
        imageLeft = 0;
        labelLeft = imageHint.width;
      } else if (direction == "right") {
        labelLeft = 0;
        imageLeft = labelHint.width;
      }
      
      image.renderLayout(imageLeft, imageTop, imageWidth, imageHeight);
      label.renderLayout(labelLeft, labelTop, labelWidth, labelHeight);
    }
  }
});
