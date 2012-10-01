/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 */
core.Class("unify.view.TabViewManager", {
	include : [unify.ui.container.Composite],
	implement : [unify.view.IViewManager],

	/*
	----------------------------------------------------------------------------
		 CONSTRUCTOR
	----------------------------------------------------------------------------
	*/

	/**
	 * @viewManager {unify.view.ViewManager} ViewManager to attach to
	 */
	construct : function(viewManager)
	{
		unify.ui.container.Composite.call(this, new unify.ui.layout.special.TabViewLayout());

		this.setUserData("viewmanager", this);

		if (jasy.Env.getValue("debug"))
		{
			if (viewManager == null) {
				throw new Error("TabViewManager needs a ViewManager at construction time!");
			}
		}

		// Maps root views to full path objects
		this.__paths = {};

		// Maps of views controlled by this manager
		this.__viewmap = {};

		// Remember view manager and react on changes of its path
		this.__viewManager = viewManager;
		viewManager.addListener("changePath", this.__onViewManagerChangePath, this);

		this.add(viewManager);

		var bar = this.__getBar();
		bar.setHeight(49);
		this.add(bar, {
			type: "bar"
		});
	},



	/*
	----------------------------------------------------------------------------
		 PROPERTIES
	----------------------------------------------------------------------------
	*/

	properties :
	{
		/** ID of selected view */
		selected :
		{
			type : "String",
			fire : "changeSelected",
			nullable : true,
			apply : this._applySelected
		}
	},



	/*
	----------------------------------------------------------------------------
		 MEMBERS
	----------------------------------------------------------------------------
	*/

	members :
	{
		__paths : null,

		/** {unify.view.ViewManager} Instance of attached view manager */
		__viewManager : null,

		/** {Element} Root element which is used for the button bar */
		__bar : null,

		/** {Element} Root element of the attached view manager */
		__pane : null,

		__viewmap : null,

		/**
		 * @return {Boolean} true if this ViewManager currently animates the transition between 2 views
		 */
		isInAnimation : function() {
			return false;
		},

		/**
		 * Returns the currently selected view instance
		 *
		 * @return {unify.view.StaticView} View instance which is currently selected
		 */
		getCurrentView : function() {
			return this.__viewManager.getCurrentView();
		},

		/**
		 * Returns the local path of the view manager
		 *
		 * @return {Map[]} List of dictonaries (with keys view, segment and param)
		 */
		getPath : function() {
			return this.__viewManager.getPath();
		},

		/**
		 * Returns the view instance stored behind the given ID.
		 *
		 * @param id {String} Identifier of the view.
		 * @return {unify.view.StaticView} Instance derived from the StaticView class.
		 */
		getView : function(id) {
			return this.__viewManager.getView(id);
		},

		/**
		 * Navigates to the given path
		 *
		 * @param path {unify.view.Path} Path to navigate to
		 */
		navigate : function(path) {
			this.__viewManager.navigate(path);
		},


		/**
		 * Adds a view to the tab bar. The buttons are displayed in the order of
		 * execution of this function.
		 *
		 * @param viewClass {Class} Class of the view to register {@see unify.view.StaticView}
		 */
		register : function(viewClass, isDefault)
		{
			var viewInstance = viewClass.getInstance();

			var elem = new unify.ui.basic.NavigationButton(viewInstance.getTitle("tab-bar"), viewInstance.getIcon("tab-bar"));
			elem.set({
				appearance: "tabbar.button",
				goTo: viewInstance.getId(),
				relation: "master"
			});

			this.__viewmap[viewInstance.getId()] = elem;
			this.__getBar().add(elem);
		},

		/**
		 * lazy intialization for __bar
		 */
		__getBar : function(){
			var bar=this.__bar;
			if(!bar){
				// TODO: Check in master the next line!
				var layout = new unify.ui.layout.HBox();
				layout.set({
					alignX: "center",
					alignY: "top"
				});
				this.__bar = bar = new unify.ui.container.Composite(layout);
				bar.setAppearance("tabbar");
			}
			return bar;
		},

		/**
		 * Reacts on path changes of the view manager and updates "selected" property accordingly.
		 *
		 * @param e {lowland.events.DataEvent} Data event
		 */
		__onViewManagerChangePath : function(e)
		{
			var path = e.getData();
			if (path)
			{
				var first = path[0];
				if (first) {
					return this.setSelected(first.view);
				}
			}

			this.resetSelected();
		},


		// property apply
		_applySelected : function(value, old)
		{
			var viewmap = this.__viewmap;

			var n = value && viewmap[value];
			if (n) {
				n.addState("active");
			}

			var o = old && viewmap[old];
			if (o) {
				o.removeState("active");
			}
		},

		/**
		 * Event handler for onTap event
		 *
		 * @param e {lowland.events.Event} Event
		 */
		_onTap : function(e) {
			var widget = this._getTapFollowElement(e);
			this.__onTap(widget);
		},

		/**
		 * Reacts on tabbing on the tabbar buttons.
		 *
		 * @param widget {unify.ui.core.Widget} Touch event
		 */
		__onTap : function(widget)
		{
			if (widget)
			{
				var viewManager = this.__viewManager;
				var oldPath = viewManager.getPath();
				var oldRootView = oldPath[0].view;

				var newRootView = widget.getGoTo();

				// If root view has not changed we force jump to root of the view and not
				// using the stored deep path. This results into the intented behavior to
				// jump to top on the second click on the same button.

				var newPath;

				if (oldRootView != newRootView) {
					newPath = this.__paths[newRootView];
				}

				if (!newPath) {
					newPath = unify.view.Path.fromString(newRootView);
				}

				this.__viewManager.navigate(newPath);

				// Store path for old view
				this.__paths[oldRootView] = oldPath;
			}
		}
	}
});