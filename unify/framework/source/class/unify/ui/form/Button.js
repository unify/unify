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
  extend: unify.ui.basic.Label,

  events : {
    /** Execute event when button is tapped */
    "execute" : "qx.event.type.Event"
  },

  properties: {
    // overridden
    appearance :
    {
      refine: true,
      init: "button"
    }
  },
  
  members: {
    _createElement : function() {
      var e = this.base(arguments);
      
      qx.event.Registration.addListener(e, "tap", this.__onTap, this);
      
      return e;
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
