/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * The label widget implements text representation in unify widget system
 */
qx.Class.define("unify.ui.widget.basic.Label", {
  extend : unify.ui.widget.core.Widget,
  
  /**
   * Creates a new instance of Label
   * @param text {String} Text content to use 
   */
  construct : function(text) {
    this.setText(text);
  },
  
  properties : {
    /** Contains the label content */
    text : {
      check: "String",
      apply: "_applyText"
    }
  },
  
  members : {
    // overridden
    _createElement : function() {
      return document.createElement("div");
    },
    
    /**
     * Applies text to element
     * @param value {String} New value to set
     */
    _applyText : function(value) {
      this.getElement().innerHTML = value;
    }
  }
});
