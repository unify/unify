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
qx.Class.define("unify.ui.form.TextArea", {
  extend : unify.ui.core.Widget,
  
  properties : {
    /** {Integer} Number of columns in text area */
    columns : {
      init: 50
    },
    
    /** {Integer} Number of rows in text area */
    rows : {
      init: 3
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
      var e = qx.bom.Input.create("textarea", {
        rows: this.getRows(),
        cols: this.getColumns()
      });
      //qx.event.Registration.addListener(e, "input", this._onChange, this);
      return e;
    },
    
    /**
     * Set value of text area
     *
     * @param value {String} New value of text area
     */
    setValue : function(value) {
      qx.bom.Input.setValue(this.getElement(), value);
    },
    
    /**
     * Get value of text area
     *
     * @return {String} Value of text area
     */
    getValue : function() {
      return qx.bom.Input.getValue(this.getElement());
    }
  }
});
