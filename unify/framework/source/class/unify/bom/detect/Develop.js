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
core.Module("unify.bom.detect.Develop", {
	
	/** {=Boolean} True is source variant */
	VALUE : (function(location) {
		return location.pathname.contains("/source/");
	})(this.location)
});