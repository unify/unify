/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com
		
===============================================================================================
*/

(function() {


	var rgba = function(red,green,blue,alpha) {
		return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
	};
	var rgb = function(red,green,blue) {
		return "rgb(" + red + "," + green + "," + blue + ")";
	};
	var colorFnt;
	
	if (jasy.Env.getValue("engine") == "trident") {
		var version = /MSIE.(\d+)/.exec(navigator.userAgent);
		if (version[1] && parseInt(version[1],10) < 9) {
			colorFnt = rgb;
		} else {
			colorFnt = rgba;
		}
	} else {
		colorFnt = rgba;
	}
	
	/**
	 * Creates browser specific gradients
	 */
	core.Module('unify.bom.Color', {
		
		/*
		----------------------------------------------------------------------------
			STATICS
		----------------------------------------------------------------------------
		*/
	
		/**
		 * Creates a browser specific color code based upon @red {Integer}, @green {Integer}, 
		 * @blue {Integer} and @alpha {Float}, ignoring alpha on IE<9
		 */
		rgba: colorFnt
	});


})();