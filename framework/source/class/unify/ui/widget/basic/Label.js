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
    if (text) {
      this.setValue(text);
    }
  },
  
  properties : {
    /** Contains the label content */
    value : {
      check: "String",
      apply: "_applyValue",
      event: "changeValue",
      nullable: true
    },
    
    html : {
      check: "Boolean",
      init: false,
      event: "changeHtml"
    },
    
    // overridden
    allowGrowX : {
      refine : true,
      init : false
    },


    // overridden
    allowGrowY : {
      refine : true,
      init : false
    },

    // overridden
    allowShrinkY : {
      refine : true,
      init : false
    }
  },
  
  members : {
    // overridden
    _createElement : function() {
      return qx.bom.Label.create(this.getValue(), this.getHtml());
    },
    
    /**
     * Applies text to element
     * @param value {String} New value to set
     */
    _applyValue : function(value) {
      qx.bom.Label.setValue(this.getElement(), value);
    }
  }
});
