/*
===============================================================================================

    	Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Detects the operating system name
 */
core.Module("unify.bom.detect.Html5Placeholder", {
	
	/** {Boolean} If html5 placeholders are supported */
	VALUE : (function(doc) {
		if (!doc) {
			return false;
		}
		var i = doc.createElement("input");
		return ("placeholder" in i);
	})(this.window && window.document)
});
