/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.ui.dialog.Confirm", {
  extend: unify.ui.dialog.Alert,
  
  construct : function(value, onOk, onCancel) {
    this.base(arguments, value, onOk);
    //call parent function to add a "cancel" button and his callback function.
    this.__addButton("Cancel", onCancel);
  }
  
});
