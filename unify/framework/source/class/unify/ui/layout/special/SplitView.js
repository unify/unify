/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */
core.Class("unify.ui.layout.special.SplitView", {
	include : [unify.ui.layout.Base], 

	/**
	 * @splitLevel {Float?0.33} Set width of left part in percent
	 */
	construct : function(splitLevel) {
		unify.ui.layout.Base.call(this);

		if (splitLevel) {
			this.setSplitLevel(splitLevel);
		}
	},

	properties : {
		/** {Float} Split level, percantage value of width of left part, defaults to 0.33 */
		splitLevel : {
			init: 0.33
		}
	},

	members : {
		__left : null,
		__right : null,
		__title : null,

		/**
		 * Render part of layout stack that is managed by this layout manager. The part
		 * has size @availWidth {Integer} and @availHeight {Integer}.
		 */
		renderLayout : function(availWidth, availHeight) {
			var children = this._getLayoutChildren();

			if (children.length > 2) {
				this.error("SplitView supports only exactly 2 children!");
			}
			var baseWidget = this._getWidget();
			// Ask base widget if in portrait mode
			var isPortrait = baseWidget.isPortrait(availWidth, availHeight);

			if (children.length == 1) { //1 child -> currently in portrait
				if (isPortrait) {
					//still in portrait, use whole area for detail
					children[0].renderLayout(0, 0, availWidth, availHeight);
				} else {
					//do nothing, master will be readded and layout
				}
			} else { //2 children -> currently in landscape
				if (isPortrait) {
					//switch to portrait, render detail only
					children[1].renderLayout(0, 0, availWidth, availHeight);
				} else {
					//stay in landscape, calculate split
					var leftWidth = Math.round(availWidth * this.getSplitLevel());
					children[0].renderLayout(0, 0, leftWidth, availHeight);
					children[1].renderLayout(leftWidth, 0, availWidth-leftWidth, availHeight);
				}
			}
		},
		
		_computeSizeHint : function() {
				return {
					width: 10,
					minWidth: 1,
					height: 10,
					minHeight: 1
				};
			}
	}
});
