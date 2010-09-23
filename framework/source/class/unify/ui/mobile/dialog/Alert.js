/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Experimental implementation of alert dialogs
 * Not for production
 *
 * @deprecated
 */
qx.Class.define("unify.ui.mobile.dialog.Alert", {
  extend : unify.ui.mobile.dialog.Dialog,

  construct : function() {
    this.base(arguments);

    this._classNameBase = "infodialog";
    this.__buttonHolder = [];
  },

  statics : {
    /**
     * Opens alert dialog
     *
     * @param content {String} Content of alert dialog
     */
    start : function(content) {
      var dialog = new unify.ui.mobile.dialog.Alert();
      for (var i=0, len=arguments.length; i < len; i++) {
        dialog.add(arguments[i]);
      }
      dialog.show();
    }
  },

  members : {
    __buttonIsAdded : null,
    __buttonHolder : null,

    /**
     * Adds element or button to dialog box.
     *
     * @param obj {String|Element|unify.ui.mobile.Abstract} HTML, control or element to insert
     * @param skipButtonParsing {Boolean} Skips parsing for button elements, mostly used internal
     */
    add : function(obj, skipButtonParsing) {
      var regex = /class="(((\s|\S)*\sbutton\s(\s|\S)*)|(button(\s|\S)*)|((\s|\S)*button))"/g;
      if ((!skipButtonParsing) && (typeof obj == "string") && (obj.match(regex))) {
        this.__buttonHolder.push(obj);
      } else {
        this.base(arguments, obj);
      }
    },

    // overridden
    show : function() {
      if (!this.__buttonIsAdded) {
        this.__buttonIsAdded = true;
        var html = "<div class=\"buttons\">";
        for (var i=0; i<this.__buttonHolder.length; i++) {
          html += this.__buttonHolder[i];
        }
        html += "</div>";
        this.add(html, true);
      }
      this.base(arguments);
    }
  }
});