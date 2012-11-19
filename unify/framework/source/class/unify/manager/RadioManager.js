/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

(function() {

	var registry = {};

	core.Module("unify.manager.RadioManager", {
		register : function(group, value, widget) {
			
			if (!registry[group]) {
				registry[group] = [];
			}
			
			registry[group][value] = widget;
		},
		
		check : function(group, value) {
			if (!registry[group]) {
				throw new Error("No radio group " + group + " exists");
			}
			
			var g = registry[group];
			var k = Object.keys(g);
			
			for (var i=0,ii=k.length; i<ii; i++) {
				var e = g[k[i]];
				
				if (k[i] == value) {
					e.setChecked(true);
					break;
				}
			}
		},
		
		uncheckOther : function(group, value) {
			if (!registry[group]) {
				throw new Error("No radio group " + group + " exists");
			}
			
			var g = registry[group];
			var k = Object.keys(g);
			
			for (var i=0,ii=k.length; i<ii; i++) {
				var e = g[k[i]];
				
				if (k[i] != value) {
					e.setChecked(false);
				}
			}
		}
	});

})();