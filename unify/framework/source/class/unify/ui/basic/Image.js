/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.basic.Image", {
  extend: unify.ui.core.Widget,
  
  /**
   * @param source {String} URL of image
   */
  construct : function(source) {
    this.base(arguments);
    if (source) {
      this.setSource(source);
    }
  },
  
  properties : {
    /** {String} URL of image */
    source : {
      apply : "_applySource"
    },
    // overridden
    appearance :
    {
      refine: true,
      init: "image"
    }
  },
  
  members: {
    _createElement : function() {
      return document.createElement("img");
    },
    
    _applySource : function(value) {
      var ResourceManager = qx.util.ResourceManager.getInstance();
      
      if (this._hasElement()) {
        var e = this.getElement();
        e.setAttribute("src", ResourceManager.toUri(value));
      }
    }
  }
});
