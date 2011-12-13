/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 Deutsche Telekom AG, Germany, http://telekom.com
    
*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.dialog.Confirm", {
  extend: unify.ui.dialog.Alert,
  
  /**
   * @param value {String} Dialog text
   * @param onOk {Function} onOkay callback
   * @param onCancel {Function} onCancel callback
   */
  construct : function(value, onOk, onCancel) {
    this.base(arguments, value, onOk);
    //call parent function to add a "cancel" button and his callback function.
    this._addButton("Cancel", onCancel);
  }
  
});