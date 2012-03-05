/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Alexander Wunschik, Fürth, Germany, mail@wunschik.it

*********************************************************************************************** */

/**
 * CheckBox
 */
qx.Class.define("unify.ui.form.CheckBox", {
  extend: unify.ui.basic.Atom,
  include : [unify.ui.core.MChildControl],
  
  /**
   * @param label {String} Label on atom
   */
  construct : function(label, checked) {
    this.base(arguments, label);
    
    this.setChecked(!!checked);
    
    this.addListener("tap", this.__onTap, this);
  },

  properties: {
    // overridden
    appearance : {
      refine: true,
      init: "checkbox"
    },
    
    /** Position of image */
    direction : {
      refine : true,
      init : "left"
    },
    
    // overridden
    focusable : {
      refine: true,
      init: true
    },
    
    checked : {
      check: "Boolean",
      init: false,
      event: "execute",
      apply: "_applyChecked"
    }
  },

  members: {
    
    /**
     * onTap handler on button
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      // toggle checked state
      this.setChecked(!this.getChecked());
    },
    
    /**
     * Handles chanches on the "checked" property
     * @param value {Boolean} if the checkbox is checked
     */
    _applyChecked : function(value) {
      if (value) {
        this.addState("checked");
      } else {
        this.removeState("checked");
      }
    }
  }
});
