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
qx.Class.define("unify.ui.widget.form.Input", {
  extend : unify.ui.widget.core.Widget,
  
  properties : {
    columns : {
      init: 50
    },
    rows : {
      init: 3
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
    
    setValue : function(value) {
      qx.bom.Input.setValue(this.getElement(), value);
    },
    
    getValue : function() {
      return qx.bom.Input.getValue(this.getElement());
    }
  }
});
