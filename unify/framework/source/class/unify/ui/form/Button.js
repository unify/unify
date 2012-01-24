/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */

qx.Class.define("unify.ui.form.Button", {
  extend: unify.ui.container.Composite,
  include : [unify.ui.core.MInteractionState, unify.ui.core.MChildControl],

  events : {
    /** Execute event when button is tapped */
    "execute" : "qx.event.type.Event"
  },

  properties: {
    // overridden
    appearance : {
      refine: true,
      init: "button"
    },

    // overridden
    focusable : {
      refine: true,
      init: true
    },
    
    /** Wheter the button should calculate it's size -> property forwarded to label */
    autoCalculateSize : {
      check: "Boolean",
      init: false,
      apply: "_applyAutoCalculateSize"
    }
  },

  /**
   * @param text {String?null} Text of button
   */
  construct : function(text) {
    var layout = this.__layout = new unify.ui.layout.Center();
    this.base(arguments, layout)

    this._forwardStates = {
      "hover" : true,
      "pressed" : true
    }

    if (text) {
      this.setValue(text);
    }
  },

  members: {
    _createElement : function() {
      var e = this.base(arguments);

      qx.event.Registration.addListener(e, "tap", this.__onTap, this);

      return e;
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;

      if (id == "label") {
        control = new unify.ui.basic.Label();
        this._add(control);
      }

      return control || this.base(arguments, id);
    },

    _applyAppearance : function(value) {
      this.base(arguments, value);
    },

    /**
     * Set button text
     *
     * @param value {String} Text of button
     */
    setValue : function(value) {
      this.getChildControl("label").setValue(value);
    },

    /**
     * Returns text of button
     *
     * @return {String} Text of button
     */
    getValue : function() {
      return this.getChildControl("label").getValue();
    },

    /**
     * onTap handler on button
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      this.fireEvent("execute");
    },
    
    /**
     * Applies autoCalculateSize property to label
     *
     * @param value {Boolean} Label size should be automatic calculated
     */
    _applyAutoCalculateSize : function(value) {
      this.getChildControl("label").setAutoCalculateSize(value);
    }
  }
});
