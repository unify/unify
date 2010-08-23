/**
 * Experimental implementation of one button alert dialogs
 * Not for production
 * 
 * @deprecated
 */
qx.Class.define("unify.ui.mobile.dialog.Info", {
	extend : unify.ui.mobile.dialog.Alert,

	construct : function() {
		this.base(arguments);
		
		this.add("<button class=\"close\">OK</button>");
	},

	statics : {
		/**
		 * Opens alert dialog
		 * 
		 * @param content {String} Content of alert dialog
		 */
		start : function(content) {
			var dialog = new unify.ui.mobile.dialog.Info();
			for (var i=0, len=arguments.length; i < len; i++) {
				dialog.add(arguments[i], true);
			}
			dialog.show();
		}
	}
});