/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

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
        var src = ResourceManager.toUri(value);
        //e.setAttribute("src", src);
        core.bom.Style.set(e, {
          backgroundImage: "url(" + src + ")"
        });
        var imgSize = ResourceManager.getImageSize(value);
        this.setWidth(imgSize.width);
        this.setHeight(imgSize.height);
      }
    }
  }
});
