/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

(function() {
	
	var themeRegistry = {};
	var theme = null;
	
	core.Module("unify.theme.Manager", {
		register : function(name, theme) {
			themeRegistry[name] = theme;
		},
		
		unregister : function(name) {
			themeRegistry[name] = null;
		},
		
		get : function(name) {
			return themeRegistry[name || theme];
		},
		
		setTheme : function(name) {
			theme = name;
		}
	});

})();