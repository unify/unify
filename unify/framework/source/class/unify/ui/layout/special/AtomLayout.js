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
          labelWidth = availWidth - imageWidth - 
                       unify.ui.layout.Util.calculateLeftGap(image) - 
                       unify.ui.layout.Util.calculateRightGap(image) -
                       unify.ui.layout.Util.calculateHorizontalGap(label);
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
          labelHeight = availHeight - imageHeight - 
                        unify.ui.layout.Util.calculateTopGap(image) - 
                        unify.ui.layout.Util.calculateBottomGap(image) - 
                        unify.ui.layout.Util.calculateVerticalGap(label);
        }
        
        if (direction == "left") {
          imageLeft = unify.ui.layout.Util.calculateLeftGap(image);
          labelLeft = imageWidth + unify.ui.layout.Util.calculateHorizontalGap(image) + unify.ui.layout.Util.calculateLeftGap(label);
        } else if (direction == "right") {
          labelLeft = label.getMarginLeft();
          imageLeft = availWidth - imageWidth - unify.ui.layout.Util.calculateHorizontalGap(image);
        } else if (direction == "top") {
          imageTop = unify.ui.layout.Util.calculateTopGap(image);
          labelTop = imageTop + imageHint.height + label.getMarginTop();
        } else if (direction == "bottom") {
          labelTop = label.getMarginTop();
          imageTop = availHeight - imageHeight - unify.ui.layout.Util.calculateBottomGap(image);
        }
        image.renderLayout(imageLeft, imageTop, imageWidth, imageHeight);
        label.renderLayout(labelLeft, labelTop, labelWidth, labelHeight);
      } else if (image) {
        var imageHint = image.getSizeHint();
        var imageWidth = imageHint.width;
        if (imageWidth > availWidth) {
          imageWidth = availWidth;
        }
        var imageHeight = imageHint.height;
        if (imageHeight > availHeight) {
          imageHeight = availHeight;
        }
        var left = Math.round((availWidth / 2) - (imageWidth / 2));
        var top = Math.round((availHeight / 2) - (imageHeight / 2));
        image.renderLayout(left, top, imageWidth, imageHeight);
      } else if (label) {
        var labelHint = label.getSizeHint();
        var labelWidth = availWidth;
        if (labelWidth > labelHint.maxWidth) {
          labelWidth = labelHint.maxWidth;
        }
        var labelHeight = availHeight;
        if (labelHeight > labelHint.maxHeight) {
          labelHeight = labelHint.maxHeight;
        }
        var left = Math.round((availWidth / 2) - (labelWidth / 2));
        var top = Math.round((availHeight / 2) - (labelHeight / 2));
        
        label.renderLayout(left, top, labelWidth, labelHeight);
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
      
      var Util = unify.ui.layout.Util;
      if (direction == "left" || direction == "right") {
        neededWidth = imageSizeHint.width + labelSizeHint.width;
        if (image) {
          neededWidth += Util.calculateLeftGap(image) + Util.calculateRightGap(image);
        }
        neededHeight = Math.max(imageSizeHint.height, labelSizeHint.height);
      } else {
        neededWidth = Math.max(imageSizeHint.width, labelSizeHint.width);
        neededHeight = imageSizeHint.height + labelSizeHint.height;
        if (image) {
          neededHeight += Util.calculateTopGap(image) + Util.calculateBottomGap(image);
        }
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
  },
  
  destruct: function(){
    this.__image=this.__label=null;
  }
});
