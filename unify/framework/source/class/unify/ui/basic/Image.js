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
    
    scale : {
      init: false,
      apply : function(value) { this._applyScale(value); }
    },
    
    changeSizeAfterLoad : {
      init: false,
      apply : function(value) { this._applyChangeSizeAfterLoad(value); }
    },
    
    // overridden
    appearance :
    {
      init: "image"
    }
  },
  
  members: {
    _createElement : function() {
      var e = document.createElement("div");
      
      core.bom.Style.set(e, {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: null
      });
      
      return e;
    },
    
    _applyChangeSizeAfterLoad : function(value) {
    	var src = this.getSource();
      if (value && src) {
        core.io.Image.load(src, function(uri, error, params) {
          this.setWidth(params.width);
          this.setHeight(params.height);
        }, this);
      }
    },
    
    _applyScale : function(value) {
      var e = this.getElement();
      
      var style = {
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: null
      };
      
      if (value) {
        style.backgroundSize = "contain"
      }
      
      core.bom.Style.set(e, style);
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
