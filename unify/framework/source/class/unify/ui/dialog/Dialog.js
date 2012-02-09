/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Alexander Wunschik, Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Provides simple user interaction dialogs:
 * 
 * inform: inform the user
 * alert: inform the user about an error
 * confirm: let the user decide between two choices
 * 
 * Each function has a callback that returns the ID of the button that was 
 * used to close the dialog. 
 * The default values of these Buttons are "OK" and "CLOSE".
 * 
 * This code is inspired by an qooxdoo example from Christian Boulanger:
 * @see http://qooxdoo.org/documentation/0.7/snippets/asynchronous_user_interaction
 */
qx.Class.define("unify.ui.dialog.Dialog", {
  type: 'static',
  
  statics: {
    
    /**
     * show a generic dialog
     *
     * @type member
     * @param title {String} The title of the dialog
     * @param msg {String} The message to the user
     * @param buttons {Array} An array of buttons 
     *        @see unify.ui.dialog.GenericDialog__createButtons
     * @param callback {Function} Callback function
     * @param context {Object} "this" object in callback function
     * @return {void} 
     */
    _showDialog : function(title, msg, buttons, callback, context) {
      // Create a new generic dialog
      var dialog = new unify.ui.dialog.GenericDialog(title, buttons);
      
      // Get the dialog content and add a label to it.
      // This label contains the actual info-message.
      var content = dialog.getChildrenContainer();
      var text = new unify.ui.basic.Label(msg);
      text.set({
        allowGrowX: true,
        allowGrowY: true,
        wrap: true
      });
      content.add(text);
      
      // Add an event handler for closing the dialog
      dialog.addListener("execute", function(e) {
        unify.ui.core.PopOverManager.getInstance().hide(dialog);
        callback.call(context, e);
      }, this);
      
      // Show the ovelay
      unify.ui.core.PopOverManager.getInstance().show(dialog);
    },
    
    /**
     * Displays an alert / warning
     *
     * @type member
     * @param title {String} The title of the dialog window
     * @param msg {String} Message 
     * @param callback {Function} Callback function
     * @param context {Object} "this" object in callback function
     * @return {void} 
     */
    alert : function(title, msg, callback, context) {
      unify.ui.dialog.Dialog._showDialog(
          title,
          msg,
          [], //Default: Show only a OK Button
          callback,
          context
      );
    },
    
    /**
     * Asks user to confirm something. The callback function receives a true or false value.
     *
     * @type member
     * @param title {String} The title of the dialog window
     * @param msg {String} Message 
     * @param yesBtn {String} Label for the "Yes" Button (The left one)
     * @param noBtn {String} Label for the "No" Button (The right one)
     * @param callback {Function} Callback function (IDs: "YES", "NO", "CLOSE")
     * @param context {Object} "this" object in callback function
     * @return {void} 
     */
    confirm : function(title, msg, yesBtn, noBtn, callback, context) {
      unify.ui.dialog.Dialog._showDialog(
          title,
          msg,
          [{
            label: yesBtn,
            id: "YES",
            align: "left"
          },{
            label: noBtn,
            id: "NO",
            align: "right"
          }],
          callback,
          context
      );
    }
    
  }
});