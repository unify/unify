/*
===============================================================================================

 Unify Project

 Homepage: unify-project.org
 License: MIT + Apache (V2)
 Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

 ===============================================================================================
*/

/**
 * Use external requestAnimationFrame patches from zynga
 */
/*
 #ignore(requestAnimationFrame)
 #ignore(cancelAnimationFrame)
 */

(function() {

var AnimationFrame = core.effect.AnimationFrame;
var requestAnimationFrame = AnimationFrame.request;
var cancelAnimationFrame = AnimationFrame.cancel;

/**
 * require(ext.RequestAnimationFrame)
 */
core.Module("unify.fx.core.AnimationFrame", {
	/**
	 * Request animation frame
	 *
	 * @param callback {Function} Callback function if animation frame is hitten
	 * @param root {Object?} optional html element defining the area where the animation happens
	 * @return {Object} request handle
	 */
	request : function(callback,root) {
		return requestAnimationFrame(callback,root);//TODO check spec if root element is still there and if browsers support it
	},

	/**
	 * cancels a pending animation frame step
	 * 
	 * @param handle {Object} the pending requests handle
	 */
	cancel : function(handle) {
		return cancelAnimationFrame(handle);
	}
});

})();
