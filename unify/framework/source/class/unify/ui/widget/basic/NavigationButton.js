/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.widget.basic.NavigationButton", {
  extend: unify.ui.widget.form.Button,

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
    }
  },
  
  members: {
    getElement : function() {
      var element = this.base(arguments);
      
      qx.bom.element.Class.add(element, "navigatable");
      
      return element;
    }
  }
});
