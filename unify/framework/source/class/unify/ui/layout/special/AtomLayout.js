/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.layout.special.AtomLayout", {
  extend : qx.ui.layout.Abstract,
  
  members : {
    __image : null,
    __label : null,
    
    renderLayout : function(availWidth, availHeight) {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var direction = this._getWidget().getDirection();
    
      var image = this.__image;
      var label = this.__label;
      
      if (image && label) {
        var imageHint = image.getSizeHint();
        var labelHint = label.getSizeHint();
        
        var imageTop = 0;
        var imageHeight = imageHint.height;
        var imageWidth = imageHint.width;
        var imageLeft = 0;
        var labelTop = 0;
        var labelHeight = labelHint.height;
        var labelWidth = labelHint.width;
        var labelLeft = 0;
  
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
        } else {
          if (imageHint.width > availWidth) {
            imageWidth = availWidth;
            imageLeft = 0;
          } else {
            imageWidth = imageHint.width;
            imageLeft = Math.ceil((availWidth / 2) - (imageWidth / 2));
          }
          if (labelHint.height > availHeight) {
            labelWidth = availWidth;
            labelLeft = 0;
          } else {
            labelWidth = imageHint.width;
            labelLeft = Math.ceil((availWidth / 2) - (labelWidth / 2));
          }
        }
        
        if (direction == "left") {
          imageLeft = 0;
          labelLeft = imageHint.width;
        } else if (direction == "right") {
          labelLeft = 0;
          imageLeft = labelHint.width;
        } else if (direction == "top") {
          imageTop = 0;
          labelTop = imageHint.height;
        } else if (direction == "bottom") {
          labelTop = 0;
          imageTop = labelHint.height;
        }
        
        image.renderLayout(imageLeft, imageTop, imageWidth, imageHeight);
        label.renderLayout(labelLeft, labelTop, labelWidth, labelHeight);
      } else if (image) {
        image.renderLayout(0, 0, availWidth, availHeight);
      } else if (label) {
        label.renderLayout(0, 0, availWidth, availHeight);
      }
    },
    
    // overridden
    _computeSizeHint : function() {
      if (this._invalidChildrenCache) {
        this.__rebuildCache();
      }
      
      var direction = this._getWidget().getDirection();
    
      var image = this.__image;
      var label = this.__label;
      var imageSizeHint = {width: 0, height: 0};
      var labelSizeHint = {width: 0, height: 0};
      
      var neededWidth = 0;
      var neededHeight = 0;
      
      if (image) {
        imageSizeHint = image.getSizeHint();
      }
      if (label) {
        labelSizeHint = label.getSizeHint();
      }
      
      if (direction == "left" || direction == "right") {
        neededWidth = imageSizeHint.width + labelSizeHint.width;
        neededHeight = Math.max(imageSizeHint.height, labelSizeHint.height);
      } else {
        neededWidth = Math.max(imageSizeHint.width, labelSizeHint.width);
        neededHeight = imageSizeHint.height + labelSizeHint.height;
      }
      
      return {
        width : neededWidth,
        height : neededHeight
      };
    },
    
    /**
     * Rebuilds cache of layout children
     */
    __rebuildCache : function() {
      var all = this._getLayoutChildren();
      
      for (var i=0,ii=all.length; i<ii; i++) {
        var child = all[i];
        
        var type = child.getLayoutProperties().type;
        if (type == "image") {
          this.__image = child;
        } else if (type == "label") {
          this.__label = child;
        } else {
          throw new Error("Type '"+type+"' is not supported!");
        }
      }
    }
  }
});
