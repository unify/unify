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
  
  construct : function(source) {
    this.base(arguments);
    if (source) {
      this.setSource(source);
    }
  },
  
  properties : {
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
      var e = document.createElement("img");
      /*var source = this.getSource();
      if (source) {
        e.setAttribute("src", source);
      }*/
      
      return e;
    },
    
    _applySource : function(value) {
      if (this._hasElement()) {
        var e = this.getElement();
        e.setAttribute("src", value);
      }
    }
  }
});
