/* ************************************************************************

	${Name}

	Copyright:
		2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("${Namespace}.view.mobile.Start", {
	extend : unify.view.mobile.StaticView,
	type : "singleton",

	members : 
	{
		__content : null,
	

		// overridden
		getTitle : function(type, param) {
			return "Start";
		},

		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);
			var titlebar = new unify.ui.mobile.TitleBar(this);
			titlebar.add({href:'sys-info', label:'System-Info', target:'right'});
			layer.add(titlebar);
			
			var content = this.__content = new unify.ui.mobile.Content;
			content.add("Hello World");
			layer.add(content);

			return layer;
		}
	}
});
