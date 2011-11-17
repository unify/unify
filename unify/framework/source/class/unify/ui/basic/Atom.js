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
  
  /**
   * @param label {String} Label on atom
   * @param image {String} Image url
   */
  construct : function(label, image) {
    this.base(arguments);
    this._setLayout(new unify.ui.layout.AtomLayout());
    
    var imageWidget = this.__imageWidget = new unify.ui.basic.Image(image);
    var labelWidget = this.__labelWidget = new unify.ui.basic.Label(label);
    
    this._add(imageWidget);
    this._add(labelWidget);
  },
  
  properties : {
    /** Position of image */
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
    
    /**
     * Set source of image
     *
     * @param value {String} URL of image
     */
    setSource : function(value) {
      this.__imageWidget.setSource(value);
    },
    
    /**
     * Set text on label
     *
     * @param value {String} Label text
     */
    setText : function(value) {
      this.__labelWidget.setValue(value);
    }
  }
});
