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
 * EXPERIMENTAL !
 * Input component
 */
qx.Class.define("unify.ui.form.util.HtmlFileInput", {
  extend : unify.ui.core.Widget,

  properties : {
    // overridden
    appearance :
    {
      refine: true,
      init: "input.file"
    }
  },

  events : {
    /** Fired on loosing focus */
    "changeValue" : "qx.event.type.Data"
  },

  members : {
    __oldInputValue : null,
    __changed : false,

    _createElement : function() {
      var e = qx.bom.Input.create("file");
      qx.event.Registration.addListener(e, "change", this.__onInput, this);

      return e;
    },

    /**
     * Sets input value
     *
     * @param value {String} Value to set on input field
     */
    setValue : function(value) {
      this.__changed = true;
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

    /**
     * Event listener for native input events. Redirects the event
     * to the widget. Also checks for the filter and max length.
     *
     * @param e {qx.event.type.Data} Input event
     */
    __onInput : function(e) {
      this.fireDataEvent("changeValue", e.getTarget().files);
    }
  }
});
