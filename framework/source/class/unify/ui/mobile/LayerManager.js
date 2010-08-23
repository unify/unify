/* ************************************************************************

	 Unify Framework

	 Copyright:
		 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/* ************************************************************************

#optional(unify.ui.mobile.TabBar)

************************************************************************ */

/**
 * Manager for {@link Layer} instances. Called by the 
 * {@link unify.view.mobile.ViewManager} to switch displayed layer.
 */
qx.Class.define("unify.ui.mobile.LayerManager",
{
	extend : qx.core.Object,
	type : "singleton",
	
	
	/*
	*****************************************************************************
		 PROPERTIES
	*****************************************************************************
	*/

	properties :
	{
		/** The currently selected layer */
		layer :
		{
			check : "unify.ui.mobile.Layer",
			nullable : true,
			apply : "_applyLayer"
		}
	},



	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/

	members :
	{
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/
				
		/**
		 * Whether an animation is running
		 *
		 * @return {Boolean} Whether an animation is running and further changes 
		 *   should be post-poned.
		 */
		isRunning : function() {
			return this.__running > 0;
		},
		

		/**
		 * Selects the given DOM element. Automatically disables fade-out
		 * selections during layer animation.
		 * 
		 * @param elem {Element} DOM element to select
		 */
		select : function(elem)
		{
			this.__cleanupAnimateSelectionRecovery();
			qx.bom.element2.Class.add(elem, "selected");
		},
		
		
		
		
		/*
		---------------------------------------------------------------------------
			INTERNALS
		---------------------------------------------------------------------------
		*/
		
		/** {unify.ui.mobile.Layer} During layer animation: The previous layer */
		__fromLayer : null,

		/** {unify.ui.mobile.Layer} During layer animation: The next layer */
		__toLayer : null,
		
		/** {Boolean} The number of currently running animations */
		__running : 0,
		
		/** {Element} DOM element which is currently fadeout during selection recovery */
		__selectElem : null,
		
		
		// property apply
		_applyLayer : function(value, old)
		{
			// Shorten class access
			var ViewManager = unify.view.mobile.ViewManager.getInstance();
			var Class = qx.bom.element2.Class;
			var App = qx.core.Init.getApplication();

			// Cache element/view references
			var toLayer = value && value.getElement();
			var fromLayer = old && old.getElement();
			var toView = value && value.getView();
			var fromView = old && old.getView();
			
			// Collapse the keyboard
			var focussedElem = qx.bom.Selector.query(':focus')[0];
			if (focussedElem) {
				focussedElem.blur();
			}
			
			// Verify that target layer has a parent node
			if (value && !toLayer.parentNode) {
				App.getRoot().appendChild(toLayer);
			}

			var mode = ViewManager.getMode();
			
			// Detect animation		
			if (mode == "in" || mode == "out")
			{
				var animationProperty = "transform";
				
				if (qx.core.Variant.isSet("unify.postitionshift", "3d")) {
					var positionBottomOut = "translate3d(0,100%,0)";
					var positionRightOut = "translate3d(100%,0,0)";
					var positionLeftOut = "translate3d(-100%,0,0)";
					var positionVisible = "translate3d(0,0,0)";
				} else if (qx.core.Variant.isSet("unify.postitionshift", "2d")) {
					var positionBottomOut = "translate(0,100%)";
					var positionRightOut = "translate(100%,0)";
					var positionLeftOut = "translate(-100%,0)";
					var positionVisible = "translate(0,0)";
				}
				
				if (mode == "in") 
				{
					if (toView.isModal()) 
					{
						this.__animateLayer(toLayer, animationProperty, positionBottomOut, positionVisible, true, fromLayer);
					}
					else
					{
						this.__animateLayer(toLayer, animationProperty, positionRightOut, positionVisible, true);
						this.__animateLayer(fromLayer, animationProperty, positionVisible, positionLeftOut, false);
					}
				}
				else if (mode == "out") 
				{
					if (fromView.isModal()) 
					{
						this.__animateLayer(fromLayer, animationProperty, positionVisible, positionBottomOut, false, toLayer);
					}
					else 
					{
						this.__animateLayer(toLayer, animationProperty, positionLeftOut, positionVisible, true);
						this.__animateLayer(fromLayer, animationProperty, positionVisible, positionRightOut, false);
						this.__animateSelectionRecovery(fromView);
					}
				}
			}
			else
			{
				if (old) {
					Class.remove(fromLayer, "current");
				}

				if (value) {
					Class.add(toLayer, "current");
				}				
			}

			// Fire appear/disappear events
			if (old) {
				fromView.fireEvent("disappear");
			}

			if (value) {
				toView.fireEvent("appear");		
			}
		},
		
		
		/**
		 * Recovers selection on current layer when transitioning from given view.
		 * 
		 * @param fromView {unify.view.mobile.StaticView} View instance the user came from originally
		 */
		__animateSelectionRecovery : function(fromView)
		{
			var Style = qx.bom.element2.Style;			
			var Class = qx.bom.element2.Class;			
			
			// Build expression for selection
			var fromViewId = fromView.getId();
			var fromViewParam = fromView.getParam();
			var target = fromViewId + (fromViewParam != null ? ":" + fromViewParam : "");

			// Select element and fade out selection slowly
			var selectElem = this.getLayer().getElement().querySelector('[goto="' + target + '"]');
			if (selectElem) 
			{
				var duration = Style.property("transitionDuration");
				var selectElemStyle = selectElem.style;
				
				selectElemStyle[duration] = "0ms";
				Class.add(selectElem, "selected");
				
				selectElem.offsetWidth+1;
				selectElemStyle[duration] = "1000ms";
				Class.remove(selectElem, "selected");
				
				this.__selectElem = selectElem;
				qx.event.Registration.addListener(selectElem, "transitionEnd", this.__cleanupAnimateSelectionRecovery, this);
			}
		},
		
		
		/**
		 * Callback handler for transition function of animation created during
		 * {@link #__recoverSelection}. Clears event listeners and styles.
		 */
		__cleanupAnimateSelectionRecovery : function()
		{
			var selectElem = this.__selectElem;			
			if (selectElem)
			{
				qx.event.Registration.removeListener(selectElem, "transitionEnd", this.__cleanupAnimateSelectionRecovery, this);
				qx.bom.element2.Style.set(selectElem, "transitionDuration", "");
				
				// Force rendering. Required to re-select the element instantanously when clicked on it.
				// Otherwise it fades in again which is not what we want here.
				selectElem.offsetWidth;
				
				// Clear element marker
				this.__selectElem = null;
			}
		},
		
		
		/**
		 * Animates a layer property
		 * 
		 * @param target {Element} DOM element of layer
		 * @param property {String} Style property to modify
		 * @param from {var} Start value
		 * @param to {var} End value
		 * @param current {Boolean?false} Whether this layer is the current layer (read: new layer)
		 * @param other {Element} DOM element of other layer (previous/next).
		 */
		__animateLayer : function(target, property, from, to, current, other)
		{	
			var Registration = qx.event.Registration;
			var Class = qx.bom.element2.Class;
			var Style = qx.bom.element2.Style;
			var targetStyle = target.style;
			
			// Increment running animation counter
			this.__running++;
			
			// Normalize cross-browser differences
			property = Style.property(property);
			var duration = Style.property("transitionDuration");
			
			// Method to cleanup after transition
			var cleanup = function()
			{
				// Disable transition again
				targetStyle[duration] = "0ms";
				
				// Remove listener
				Registration.removeListener(target, "transitionEnd", cleanup, this);
				
				// Hide the other layer when this is the current one
				// Otherwise hide this layer when not the current one
				var selectedElem;
				if (current && other) 
				{
					Class.remove(other, "current");
					selectedElem = other.querySelector(".selected");
				}

				// Make completely invisible if not current layer
				else if (!current)
				{
					Class.remove(target, "current");
					selectedElem = target.querySelector(".selected");
				}

				// Remove selection 
				if (selectedElem) {
					Class.remove(selectedElem, "selected");
				}
				
				// Revert modifications
				targetStyle.zIndex = "";
				targetStyle[property] = "";
				
				// Decrement running animation counter
				this.__running--;
			};
		
			// React on transition end
			Registration.addListener(target, "transitionEnd", cleanup, this);

			// Move to top
			targetStyle.zIndex = 1000;

			// Disable transition
			targetStyle[duration] = "0ms";
			
			// Apply initial value
			targetStyle[property] = from;
			
			// Initial display when current layer
			if (current) 
			{
				Class.add(target, "current");
				
				// Force rendering
				target.offsetWidth + target.offsetHeight;
			}
			
			// Or show other layer when not the current one
			else if (other)
			{
				Class.add(other, "current");
			}			
			
			// Enable transition
			targetStyle[duration] = "";
			
			// Apply target value
			targetStyle[property] = to;
		}
	},
	
	
	
	/*
	*****************************************************************************
		 DESTRUCTOR
	*****************************************************************************
	*/	
	
	destruct : function()
	{
		// Clear element marker
		this.__selectElem = null;		
	}
});
