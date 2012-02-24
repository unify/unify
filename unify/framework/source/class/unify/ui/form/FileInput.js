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
qx.Class.define("unify.ui.form.FileInput", {
  extend : unify.ui.container.Composite,
  include : [unify.ui.core.MChildControl],

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

  construct : function() {
    this.base(arguments, new unify.ui.layout.Canvas());
    unify.ui.core.MChildControl.call(this);

    this._showChildControl("filename");
    this._showChildControl("fileinput");

    this.getChildControl("fileinput").addListener("changeValue", this.__fileInputValueChanged, this);
  },

  members : {
    __oldInputValue : null,
    __changed : false,

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;

      if (id == "fileinput") {
        control = new unify.ui.form.util.HtmlFileInput();
        this._addAt(control, 1, {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        });
      } else if (id == "filename") {
        control = new unify.ui.form.Button();
        this._addAt(control, 0, {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        });
      }

      return control || this.base(arguments, id);
    },

    /**
     * Sets input value
     *
     * @param value {String} Value to set on input field
     */
    setValue : function(value) {
      this.getChildControl("filename").setValue(value);
    },

    /**
     * Gets input value
     *
     * @return {String} Value of input field
     */
    getValue : function() {
      return this.getChildControl("filename").getValue();
    },

    /**
     * Returns array of files selected
     *
     * @return {Array} Array of files selected in file input
     */
    getFiles : function() {
      return this.getElement().files;
    },

    /**
     * Input change handler
     *
     * @param e {qx.event.type.Event} Change event
     */
    __fileInputValueChanged : function(e) {
      this.fireDataEvent("changeValue", e.getData());
    }
  },

  destruct : function() {
    this.getChildControl("fileinput").removeListener("changeValue", this.__fileInputValueChanged, this);
  }
});
