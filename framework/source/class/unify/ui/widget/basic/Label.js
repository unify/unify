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
    __contentSize : null,
  
    // overridden
    _createElement : function() {
      return qx.bom.Label.create(this.getValue(), this.getHtml());
    },
    
    // overridden
    _getContentHint : function()
    {
      var contentSize = this.__contentSize;
      if (!contentSize)
      {
        contentSize = this.__contentSize = this.__computeContentSize();
      }

      console.log("CONTENT SIZE: ",{
        width : contentSize.width,
        height : contentSize.height
      });

      return {
        width : contentSize.width,
        height : contentSize.height
      };
    },
    
    /**
     * Internal utility to compute the content dimensions.
     *
     * @return {Map} Content size
     */
    __computeContentSize : function()
    {
      var Label = qx.bom.Label;

      var styles = this.getFont();
      console.log("x", styles);
      var content = this.getValue() || "A";

      return Label.getTextSize(content, styles);
    },
    
    /**
     * Applies text to element
     * @param value {String} New value to set
     */
    _applyValue : function(value) {
      this.__contentSize = null;
      qx.bom.Label.setValue(this.getElement(), value);
    }
  }
});
