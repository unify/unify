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
core.Class("unify.ui.layout.special.OverlayLayout", {
	include : [unify.ui.layout.Base],
	
	members : {
		__arrow : null,
		__content : null,
	
		/**
		 * Render part of layout stack that is managed by this layout manager. The part
		 * has size @availWidth {Integer} and @availHeight {Integer}.
		 */
		renderLayout : function(availWidth, availHeight) {
			if (this._invalidChildrenCache) {
				this.__rebuildCache();
			}
			
			var arrow = this.__arrow;
			var content = this.__content;
			var contentWidth = availWidth;
			var contentHeight = availHeight;
			var contentLeft = 0;
			var contentTop = 0;
			var arrowHint;

			
			if (arrow) {
				var arrowDirection = arrow.getDirection();
				arrowHint = arrow.getSizeHint();
				var arrowWidth = arrowHint.width;
				var arrowHeight = arrowHint.height;
				var arrowPosition = this._getWidget().calculateArrowPosition(contentHeight,contentWidth);
				var arrowLeft = arrowPosition.left;
				var arrowTop = arrowPosition.top;
				if (arrowDirection == "left") {
					contentLeft = arrowWidth;
					contentWidth -=  arrowWidth;
				} else if (arrowDirection == "right") {
					arrowLeft = availWidth - arrowWidth;
					contentWidth -=  arrowWidth;
				} else if (arrowDirection == "top") {
					contentTop = arrowHeight;
					contentHeight -= arrowHeight;
				} else if (arrowDirection == "bottom") {
					arrowTop = availHeight - arrowHeight;
					contentHeight -= arrowHeight;
				} else {
					//invalid direction, should not happen
				}
			}

			content.renderLayout(contentLeft, contentTop, contentWidth, contentHeight);
			if (arrow) {
				arrow.renderLayout(arrowLeft, arrowTop, arrowWidth, arrowHeight);
			}
		},
		
		_computeSizeHint : function() {
			if (this._invalidChildrenCache) {
				this.__rebuildCache();
			}
			
			var arrow = this.__arrow;
			var content = this.__content;
			
			var contentHint = content.getSizeHint();
			
			var Util = unify.ui.layout.Util;
			var horizontalGap = Util.calculateHorizontalGap(content);
			var verticalGap = Util.calculateVerticalGap(content);
			
			var width = contentHint.width + horizontalGap;
			var minWidth = contentHint.minWidth + horizontalGap;
			var height = contentHint.height + verticalGap;
			var minHeight = contentHint.minHeight + verticalGap;
			
			if (arrow) {
				var arrowHint = arrow.getSizeHint();
				var arrowDirection = arrow.getDirection();
				
				var arrowWidth = arrowHint.width;
				var arrowHeight = arrowHint.height;

				if (arrowDirection == "left" || arrowDirection == "right") {
					var arrowHorizontalGap = Util.calculateHorizontalGap(arrow);
					
					width += arrowHint.width + arrowHorizontalGap;
					minWidth += arrowHint.minWidth + arrowHorizontalGap;
				} else if (arrowDirection == "top" || arrowDirection == "bottom") {
					var arrowVerticalGap = Util.calculateVerticalGap(arrow);
					
					height += arrowHint.height + arrowVerticalGap;
					minHeight += arrowHint.minHeight + arrowVerticalGap;
				}
			}
			
			// Return hint
			return {
				minWidth : minWidth,
				width : width,
				minHeight : minHeight,
				height : height
			};
		},
		
		/**
		 * Rebuilds cache of layout children
		 */
		__rebuildCache : function() {
			var all = this._getLayoutChildren();
			
			for (var i=0,ii=all.length; i<ii; i++) {
				var child = all[i];
				
				var childProp = child.getLayoutProperties();
				var type = childProp.type;
				if (type == "arrow") {
					this.__arrow = child;
				} else if (!type || type == "content") {
					this.__content = child;
				} else {
					throw new Error("Type '"+type+"' is not supported!");
				}
			}
		}
	}
});
