/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011 - 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Transform abstractor
 */
(function() {
	
	var chrome = (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0);
	
	core.Module("unify.bom.Transform", {
		/**
		 * Generates translate string to have accelerated movement (if supported)
		 *
		 * @param x {Integer} X position of translate
		 * @param y {Integer} Y position of translate
		 * @return {String} Accelerated translate
		 */
		accelTranslate : (chrome || jasy.Env.getValue("engine") != "webkit") ? function(x, y) {
			// Fix resize bug with translate3d on google chrome 15.0.874.121 m
			return "translate("+x+","+y+")";
		} : function(x, y) {
			return "translate3d("+x+","+y+",0)";
		},
		
		/**
		 * Generates translate string
		 *
		 * @param x {Integer} X position of translate
		 * @param y {Integer} Y position of translate
		 * @return {String} Translate
		 */
		translate : function(x, y) {
			return "translate("+x+","+y+")";
		},
	
		/**
		 * Generates scale string to have accelerated scaling (if supported)
		 *
		 * @param x {Integer} X factor of scale
		 * @param y {Integer} Y factor of scale
		 * @return {String} Accelerated scale
		 */
		accelScale : function(x,y){
			// Fix resize bug with translate3d on google chrome 15.0.874.121 m
			if (chrome || jasy.Env.getValue("engine") != "webkit") {
				return "scale("+x+","+y+")";
			} else {
				return "scale3d("+x+","+y+",1)";
			}
		},
	
		/**
		 * Generates scale string
		 *
		 * @param x {Integer} X factor of scale
		 * @param y {Integer} Y factor of scale
		 * @return {String} Scale
		 */
		scale : function (x,y){
			return "scale("+x+","+y+")";
		},
		
		/**
		 * Generates rotate string to have accelerated rotate (if supported)
		 *
		 * @param deg {Integer} deg value to rotate to
		 * @return {String} Accelerated rotate
		 */
		accelRotate : function(deg){
			// Fix resize bug with translate3d on google chrome 15.0.874.121 m
			if (chrome || jasy.Env.getValue("engine") != "webkit") {
				return "rotate("+deg+"deg)";
			} else {
				return "rotate3d(0,0,1,"+deg+"deg)";
			}
		},

		/**
		 * Generates rotate string
		 *
		 * @param deg {Integer} deg  value to rotate to
		 * @return {String} rotate
		 */
		rotate : function (deg){
			return "rotate("+deg+"deg)";
		}
	});

})();
