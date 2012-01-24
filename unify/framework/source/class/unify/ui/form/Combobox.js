/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Composite
 */

qx.Class.define("unify.ui.form.Combobox", {
  extend: unify.ui.basic.Atom,

  events : {
    /** Execute event when button is tapped */
    "execute" : "qx.event.type.Event"
  },

  properties: {
    // overridden
    appearance : {
      refine: true,
      init: "combobox"
    },
    
    /** Position of image */
    direction : {
      refine : true,
      init : "right"
    },

    // overridden
    focusable : {
      refine: true,
      init: true
    },
    
    data : {
      init: null
    }
  },

  members: {
    __selected : null,
    
    /*_createElement : function() {
      var e = this.base(arguments);

      qx.event.Registration.addListener(e, "tap", this.__onTap, this);

      return e;
    },*/
    
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
     * onTap handler on button
     *
     * @param e {Event} Tap event
     */
    __onTap : function(e) {
      this.fireEvent("execute");
    }
  }
});
