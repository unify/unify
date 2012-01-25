/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Abstract view to help to implement dialogs
 */
qx.Class.define("unify.view.DialogView", {
  extend: unify.view.StaticView,
  type : "abstract",

  properties : {
    appearance : {
      refine: true,
      init: "dialogview"
    }
  },
  
  construct : function() {
    this.base(arguments, new unify.ui.layout.Center());
  },
  
  members : {
    __dialog : null,
    
    /**
     * Creates dialog content
     *
     * @return {unify.ui.core.Widget} Dialog widget
     */
    _createDialog : function() {
      if (qx.core.Environment.get("qx.debug")) {
        throw new Error(this.toString() + " needs implementation for _createDialog()!")
      }
    },
    
    /**
     * Returns array of buttons on dialog
     * Must be overridden
     *
     * @return {Array} Array of buttons on dialog
     */
    _getButtons : function() {
      if (qx.core.Environment.get("qx.debug")) {
        throw new Error(this.toString() + " needs implementation for _getButtons()!")
      }
    },
    
    _createView : function() {
      var dialog = this.__dialog = new unify.ui.dialog.GenericDialog(this.getTitle(), this._getButtons());
      dialog.add(this._createDialog(), { flex: 1 });
      
      this.add(dialog);
    },
    
    _resumeView : function() {
      this.__dialog.addListener("execute", this.__onDialogExecute, this);
    },
    
    _pauseView : function() {
      this.__dialog.removeListener("execute", this.__onDialogExecute, this);
    },
    
    /**
     * Execution handler for dialog
     *
     * @param e {qx.evet.type.Event} Event
     */
    __onDialogExecute : function(e) {
      this._handleAction(e.getData());
    },
    
    /**
     * Handles action on dialog execute event
     * Must be overridden
     *
     * @param id {String} ID of execution source
     */
    _handleAction : function(id) {
      if (qx.core.Environment.get("qx.debug")) {
        throw new Error(this.toString() + " needs implementation for _handleAction()!")
      }
    },
    
    /**
     * Closes dialog view
     */
    _close : function() {
      unify.view.PopOverManager.getInstance().hide(this.getManager().getId());
    }
  }
});