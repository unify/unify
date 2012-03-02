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

  events : {
    /** Execute event when button is tapped */
    "execute" : "qx.event.type.Event"
  },

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
    
    data : {
      init: null
    },
    
    checked : {
      check: "Boolean",
      init: false,
      apply: "_applyChecked"
    }
  },

  members: {
    __selected : null,
    __overlay : null,
    
    /*_createElement : function() {
      var e = this.base(arguments);

      qx.event.Registration.addListener(e, "tap", this.__onTap, this);

      return e;
    },*/
    
    /**
     * TODO
     * @param value {Boolean} TODO
     */
    _applyChecked : function(value) {
      if (value) {
        this.addState("checked");
      } else {
        this.removeState("checked");
      }
    },
    
    __getEntryById : function(id) {
      var data = this.getData();
      if (data) {
        for (var i=0, ii=data.length; i<ii; i++) {
          if (data[i].id == id) {
            return data[i];
          }
        }
      }
      
      return null;
    },

    /**
     * Set button text
     *
     * @param value {String} Text of button
     */
    setValue : function(value) {
      var d = this.__getEntryById(value);
      if (d) {
        this.__selected = d.id;
        this.setText(d.label);
      }
    },

    /**
     * Returns text of button
     *
     * @return {String} Text of button
     */
    getValue : function() {
      return this.__selected;
    },

    /**
     * Returns child control widget identified by id
     *
     * @param id {String} ID of child widget
     * @return {unify.ui.core.Widget} Content widget
     */
    _createChildControlImpl : function(id) {
      var control;
      
      if (id == "overlay") {
        control = new unify.ui.container.Overlay();
        control.setRelativeTriggerPosition({x: "left", y: "bottom"});
      }
      
      return control || this.base(arguments, id);
    },

    /**
     * onTap handler on button
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      // toggle checked state
      this.setChecked(!this.getChecked());
    },
    
    __onButtonExecute : function(e) {
      unify.ui.core.PopOverManager.getInstance().hide(this.getChildControl("overlay"));
      var id = e.getTarget().getUserData("id");
      this.setValue(e.getTarget().getUserData("id"));
      this.fireDataEvent("execute", id);
    }
  }
});
