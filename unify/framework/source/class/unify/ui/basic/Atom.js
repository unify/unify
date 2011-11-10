/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.basic.Atom", {
  extend: unify.ui.core.Widget,
  
  construct : function(label, icon) {
    this.base(arguments);
    this._setLayout(new unify.ui.layout.AtomLayout());
    
    var imageWidget = this.__imageWidget = new unify.ui.basic.Image(icon);
    var labelWidget = this.__labelWidget = new unify.ui.basic.Label(label);
    
    this._add(imageWidget);
    this._add(labelWidget);
  },
  
  properties : {
    direction : {
      type : "String",
      value : "top"
    },
    
    // overridden
    appearance :
    {
      refine: true,
      init: "atom"
    }
  },
  
  members: {
    __imageWidget : null,
    __labelWidget : null,
    
    setSource : function(value) {
      this.__imageWidget.setSource(value);
    },
    
    setText : function(value) {
      this.__labelWidget.setValue(value);
    }
  }
});
