/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Manager to handle dialogs
 */
qx.Class.define("unify.view.DialogManager", {
  extend: qx.core.Object,
  type: "singleton",
  
  construct : function() {
    this.base(arguments);
    
    this.__init();
  },
  
  members : {
    
    /**
     * Initialisation of dialog manager
     */
    __init : function() {
      var viewManager = this.__viewManager = new unify.view.ViewManager("DIALOG");
      viewManager.setAnimateTransitions(false);
      viewManager.setDisplayMode("modal");
    },
    
    /**
     * Register view to dialog manager
     *
     * @param viewCls {unify.view.StaticView} View to register as dialog
     */
    register : function(viewCls) {
      this.__viewManager.register(viewCls);
    },
    
    /**
     * Shows dialog as modal window
     *
     * @param viewId {String} ID of view to display as dialog
     */
    show : function(viewId) {
      unify.view.ViewManager.get("DIALOG").navigate(unify.view.Path.fromString(viewId));
    }
  }
});