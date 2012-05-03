/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */
 
core.Class("unify.ui.basic.Image", {
  include: [unify.ui.core.Widget],
  
  /**
   * @param source {String} URL of image
   */
  construct : function(source) {
    unify.ui.core.Widget.call(this);
    if (source) {
      this.setSource(source);
    }
  },
  
  properties : {
    /** {String} URL of image */
    source : {
      apply : function(value) { this._applySource(value); }
    },
    
    fitToSize : {
      init: false
    },
    
    // overridden
    appearance :
    {
      init: "image"
    }
  },
  
  members: {
    _createElement : function() {
      return document.createElement("div");
    },
    
    _applySource : function(value) {
      var ResourceManager = core.io.Asset;

      if (this._hasElement()) {
        var e = this.getElement();
        
        var size = null;
        
        var src = value;
        if (ResourceManager.has(value)) {
          src = ResourceManager.toUri(value);
          size = ResourceManager.getImageSize(value);
        }

        var style = {
          backgroundImage: "url(" + src + ")"
        };
        
        if (size) {
          style.backgroundSize = size.width + "px " + size.height + "px";
        }
        
        if (this.getFitToSize()) {
          style.backgroundSize = "contain";
        }
        
        core.bom.Style.set(e, style);
      }
    }
  }
});
