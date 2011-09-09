/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.widget.form.Button", {
  extend: unify.ui.widget.basic.Label,

  events : {
    "execute" : "qx.event.type.Event"
  },

  properties: {
    execute: {
      init: null,
      nullable: true
    },
    
    hyperreference: {
      init: null,
      nullable: true
    },
    
    // could be : close, parent, same
    relation: {
      init: null,
      nullable: true
    },
    
    goTo: {
      init: null,
      nullable: true
    },
    
    show: {
      init: null,
      nullable: true
    },
    
    hide: {
      init: null,
      nullable: true
    },
    
    // overridden
    appearance :
    {
      refine: true,
      init: "button"
    }
  },
  
  members: {
    getElement : function() {
      var element = this.base(arguments);
      
      qx.event.Registration.addListener(element, "tap", this.__onTap, this);
      qx.bom.element.Class.add(element, "navigateble");
      
      return element;
    },
    
    __onTap : function(e) {
      this.fireEvent("execute");
    }
  }
});
