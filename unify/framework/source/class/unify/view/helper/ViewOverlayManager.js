/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com
							 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Manager for view managers which functions as a so-called pop over.
 * #break(unify.view.ViewManager)
 */

core.Class("unify.view.helper.ViewOverlayManager", {
	include : [unify.core.Object],
	
	/*
	----------------------------------------------------------------------------
		 CONSTRUCTOR
	----------------------------------------------------------------------------
	*/
		
	construct : function() {
		unify.core.Object.call(this);
		
		unify.ui.core.PopOverManager.getInstance().addListener("hide", this.__hidePopover, this);
		
		this.__visibleViewManagers = [];
		this.__styleRegistry = {};
		this.__overlays = {};
	},
	
	events : {
		/** Show popup event */
		"show" : core.event.Simple,
		
		/** Hide popup event */
		"hide" : core.event.Simple
	},

	/*
	----------------------------------------------------------------------------
		 MEMBERS
	----------------------------------------------------------------------------
	*/
		
	members :
	{
		__visibleViewManagers : null,
		
		/** {Map} ID to view manager registry */
		__viewManagers : null,
		
		
		/** {Map} Style registry */
		__styleRegistry : null,
		
		__overlays : null,
		
		__currentViewManager : null,
		__currentOverlay : null,
		
		/**
		 * Set css styles defined in @styleMap {Map[]} for a specific @viewManager {unify.view.ViewManager}.
		 */
		setStyles : function(viewManager, styleMap) {
			this.__styleRegistry[viewManager] = styleMap;
		},
		
		/**
		 * {var} Return styles set via setStyles for a specific @viewManager {unify.view.ViewManager}.
		 */
		getStyles : function(viewManager) {
			return this.__styleRegistry[viewManager];
		},
		
		/**
		 * Get current visible view manager
		 */
		getCurrentViewManager : function() {
			return this.__currentViewManager;
		},
		
		/**
		 * Get current visible overlay
		 */
		getCurrentOverlay : function() {
			return this.__currentOverlay;
		},
		
		/**
		 * {Boolean} Check if a view manager or overlay widget with @id {String} is already visible.
		 */
		isVisible : function(id){
			var viewManager = unify.view.ViewManager.get(id);
			if (this.__visibleViewManagers.indexOf(viewManager) > -1) {
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Shows the view manager with the given @id {String}. 
		 * Optional a @trigger {unify.ui.core.Widget?} element can be defined. The view manager
		 * is located next to the trigger.
		 */
		show : function(id, trigger) {
			var viewManager = unify.view.ViewManager.get(id);
			var modal = viewManager.getModal();
			
			if (!viewManager.isInitialized()) {
				viewManager.init();
			}
			
			if (jasy.Env.getValue("debug"))
			{
				if (!viewManager) {
					throw new Error("Unknown view manager: " + id);
				}
			}
			
			if (this.__visibleViewManagers.indexOf(viewManager) > -1) {
				if (jasy.Env.getValue("debug")){
					this.debug("called show with viewmanager that is already visible: "+id);
				}
				
				return; // already visible
			}
			
			if (jasy.Env.getValue("debug")) {
				this.debug("Show: " + id);
			}

			
			var PopOverManager = unify.ui.core.PopOverManager.getInstance();
			var registeredStyle = this.__styleRegistry[viewManager];
			var popOverElement = null;
			if (modal) {
				PopOverManager.show(viewManager,registeredStyle ||"full");
			} else {
				popOverElement = this.__getOverlay(viewManager);
				popOverElement.set({
					modal: false
				});
	
				
				if(registeredStyle){
					popOverElement.getChildrenContainer().setStyle(registeredStyle);
				}
				popOverElement.add(viewManager, { top:0, left:0, right:0, bottom:0 });
				viewManager.show();
				PopOverManager.show(popOverElement, trigger);
			}
			this.fireEvent("show", id);
			
			this.__currentViewManager = viewManager;
			this.__currentOverlay = popOverElement;
			
			this.__visibleViewManagers.push(viewManager);
		},
		
		
		/**
		 * Hides the view manager with the given @id {String}.
		 */
		hide : function(id) {
			var viewManager = unify.view.ViewManager.get(id);

			if (jasy.Env.getValue("debug")) {
				if (!viewManager) {
					throw new Error("Unknown view manager: " + id);
				}
			}
			if (this.__visibleViewManagers.indexOf(viewManager) < 0) {
				if (jasy.Env.getValue("debug")){
						this.debug("called hide with viewmanager that is not visible: "+id);
				}
				return;
			}
			
			var PopOverManager = unify.ui.core.PopOverManager.getInstance();
			
			var self = this;
			var finalize = function() {
				var vvm = self.__visibleViewManagers;
				vvm.remove(viewManager);
				self.fireEvent("hide", id);
				
				if (vvm.length > 0) {
					var vm = self.__currentViewManager = vvm[vvm.length-1];
					self.__currentOverlay = self.__getOverlay(vm, false);
				} else {
					self.__currentOverlay = null;
				}
			};
			

			if (viewManager.getModal()) {
				PopOverManager.hide(viewManager);
				finalize();
			} else {
				var mode = viewManager.getDisplayMode();
	
				var overlay=this.__overlays[viewManager.getHash()];
				PopOverManager.hide(overlay);
				
				overlay.addListenerOnce("hidden",finalize,this);
				if (mode == "modal") {
					viewManager.hide(function() {
						overlay.hide();
					});
				} else {
					overlay.hide();
				}
			}
		},
		
		__hidePopover : function(e) {
			var overlay = e.getData();
			
			if (overlay) {
				var widget = lowland.ObjectManager.find(overlay.getUserData("viewmanager"));
				
				if (widget) {
					this.__visibleViewManagers.remove(widget);
					this.fireEvent("hide", (widget&&widget.getId()) || null);
					widget.hide();
				}
			}
		},

		/**
		 * Get overlay element
		 *
		 * @param viewManager {unify.view.ViewManager} View manager to generate overlay for
		 * @return {unify.ui.container.Overlay} Overlay widget
		 */
		__getOverlay : function(viewManager, create){
			var overlay = this.__overlays[viewManager.getHash()] || null;
			if(!overlay && create !== false){
				overlay = new unify.ui.container.Overlay();
				overlay.setUserData("viewmanager", viewManager.getHash());

				var appearanceId=viewManager.getId()+"-overlay";
				var appearance = unify.theme.Manager.get().resolveStyle(appearanceId);
				if(appearance){
					overlay.setAppearance(appearanceId);
				}
				this.__overlays[viewManager.getHash()] = overlay;
			}
			return overlay;
		},
		
		/**
		 * Destructor
		 */
		destruct : function() {
			this.__root = this.__pblocker= this.__mblocker=this.__viewManagers=this.__overlays=this.__styleRegistry = null;
			unify.core.Object.prototype.destruct.call(this);
		}
	}
});

unify.core.Singleton.annotate(unify.view.helper.ViewOverlayManager);
