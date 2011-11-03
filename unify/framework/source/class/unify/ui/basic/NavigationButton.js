/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Button to support navigation
 *
 * EXPERIMENTAL
 */
 
qx.Class.define("unify.ui.basic.NavigationButton", {
  extend: unify.ui.form.Button,

  properties: {
    /**
     * Executes the given function on the view.
     * The function has to be public!
     */
    execute: {
      check: "String",
      init: null,
      nullable: true
    },
    
    /**
     * Opens hyperreference (=URL) in a new window
     */
    hyperreference: {
      check: "String",
      init: null,
      nullable: true
    },
    
    /**
     * Relational navigation. This property navigates relative to the current view.
     * Allowed parameters:
     * close - Close current view if it is a modal view on top of another one
     * parent - Navigate to the parent view in hierarchy
     * same - Take the same view, change segment or parameter
     * master - ?
     */
    relation: {
      check : ["close", "parent", "same", "master"],
      init: null,
      nullable: true
    },
    
    /**
     * Opens other view
     */
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
    // overwritten
    getElement : function() {
      var element = this.base(arguments);
      
      qx.bom.element.Class.add(element, "navigatable");
      
      return element;
    }
  }
});
