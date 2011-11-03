/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/*
#require(qx.event.handler.Input)
*/

/**
 * EXPERIMENTAL
 * Input component
 */
qx.Class.define("unify.ui.form.TextField", {
  extend : unify.ui.core.Widget,
  
  properties : {
    /**
     * Type of input field, on some devices the input type changes teh behaviour of keyboard
     */
    type : {
      init : "text",
      check : ["text", "password", "telephone", "url", "email", "number"],
      apply : "_applyType"
    },
    
    // overridden
    appearance :
    {
      refine: true,
      init: "input"
    }
  },
  
  members : {
    _createElement : function() {
      var map = {
        "text" : "text",
        "password" : "password",
        "telephone" : "tel",
        "url" : "url",
        "email" : "email",
        "number" : "text"
      };
      
      var type = this.getType();
      var attrib = {
        type : map[type]
      };
      if (type == "number") {
        attrib.pattern = "[0-9]*";
      }
      
      var e = qx.bom.Input.create("text", attrib);

      return e;
    },
    
    /**
     * Sets input value
     *
     * @param value {String} Value to set on input field
     */
    setValue : function(value) {
      qx.bom.Input.setValue(this.getElement(), value);
    },
    
    /**
     * Gets input value
     *
     * @return {String} Value of input field
     */
    getValue : function() {
      return qx.bom.Input.getValue(this.getElement());
    },
    
    _applyType : function(value) {
      qx.bom.element.Attribute.set(this.getElement(), "type", value);
    }
  }
});
