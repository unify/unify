/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Alexander Wunschik, Fürth, Germany, mail@wunschik.it
               2012       Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * CheckBox
 */
core.Class("unify.ui.form.CheckBox", {
  include: [unify.ui.basic.Atom, unify.ui.core.MInteractionState],
  
  /**
   * @param label {String} Label on atom
   */
  construct : function(label, checked) {
    unify.ui.basic.Atom.call(this, label);
    
    this.setChecked(!!checked);
    
    lowland.bom.Events.listen("tap", this.__onTap.bind(this));
  },

  properties: {
    // overridden
    appearance : {
      init: "checkbox"
    },
    
    /** Position of image */
    direction : {
      init : "left"
    },
    
    // overridden
    focusable : {
      init: true
    },
    
    checked : {
      type: "Boolean",
      init: false,
      fire: "execute",
      apply: function(value) { this._applyChecked(value); }
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
