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
  extend: unify.ui.basic.Atom,
  include : [unify.ui.core.MInteractionState],

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

  members: {
    _createElement : function() {
      var e = this.base(arguments);

      qx.event.Registration.addListener(e, "tap", this.__onTap, this);

      return e;
    },

    /**
     * Set button text
     *
     * @param value {String} Text of button
     */
    setValue : function(value) {
      this.setText(value);
    },

    /**
     * Returns text of button
     *
     * @return {String} Text of button
     */
    getValue : function() {
      return this.getText();
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
