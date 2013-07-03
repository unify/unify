/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * Application class for next generation devices.
 *
 * #require(fix.FunctionBind)
 * #require(fix.Console)
 * #require(fix.DateNow)
 * #require(fix.DocumentHead)
 * #require(fix.ExecScript)
 * #require(fix.IsArray)
 * #require(fix.StringTrim)
 */
core.Class("unify.Application", {
	
	include : [unify.core.Init],
	
	/*
	----------------------------------------------------------------------------
		 MEMBERS
	----------------------------------------------------------------------------
	*/

	construct : function() {
		unify.core.Init.call(this);
		
		if (window.location.search.indexOf("testid=true") > 0) {
			jasy.Env.define("unify.testid", true);
		}
	},
	
	members :
	{
		__root : null,
		
		/*
		---------------------------------------------------------------------------
			APPLICATION CORE
		---------------------------------------------------------------------------
		*/

		// overridden
		main : function() {

			// Global error handling (otherwise we see nothing in PhoneGap)
			/* TODO: if (jasy.Env.getValue("phonegap"))
			{
				GlobalError.setErrorHandler(function(ex) {
					console.error("" + ex);
				});
			}*/

			// Display build time
			var buildTime = null; //jasy.Env.getValue("unify.$$build");
			if (buildTime) {
				this.info("Build Time: " + new Date(buildTime));
			}

			var theme = this._getTheme();
			if (theme) {
				unify.theme.Manager.register(theme.name(), theme);
				unify.theme.Manager.setTheme(theme.name());
			}

			var rootElement = this._getRootElement();
			var rootLayout = this._getRootLayout();
			var viewportElement = this._getViewportElement();
			var root = this.__root = new unify.view.Root(rootElement, this._getRootEventElement(), viewportElement, rootLayout);
			lowland.bom.Style.set(rootElement, "visibility", "hidden");
			
			// Add box sizing css node
			var boxSizeProp = core.String.hyphenate(lowland.bom.Style.property("boxSizing"));
			var settings = {};
			settings[boxSizeProp] = 'border-box;'
			
			//Premature optimizations are evil !!
			/*if (jasy.Env.isSet("engine", "webkit")) {
				var backfaceProp = core.String.hyphenate(lowland.bom.Style.property("backfaceVisibility"));
				settings[backfaceProp] = "hidden;";
			}*/
			
			var styleText = ['* {'];
			for (var key in settings) {
				styleText.push([key, settings[key]].join(":"));
			}
			styleText.push('}');
			lowland.bom.Style.addStyleText(styleText.join(""));
			
			// Support focus handling
			unify.ui.core.FocusHandler.getInstance().connectTo(root);

			// Configure document
			var Style = lowland.bom.Style;
			var rootStyle = unify.theme.Manager.get().resolveStyle("BODY") || {};
			Style.set(rootElement, rootStyle);
			if (rootStyle.font) {
				Style.set(rootElement, unify.theme.Manager.get().resolveFont(rootStyle.font));
			}
			
			// <html>
			Style.set(rootElement.parentNode, {
				width : "100%",
				height : "100%",
				overflow : "hidden",
				padding : 0
			});
			
			this.__setupDocumentSize();

			// Event listeners
			this.addNativeListener(window, "resize", this.__onResize, this);
			this.addNativeListener(rootElement, "touchmove", function(e) { lowland.bom.Events.preventDefault(e); }, this);
			this.addNativeListener(window, "orientationchange", this.__onRotate, this);
			/*
			if (jasy.Env.getValue("os.name") == "webos") {
				var palmSystem = window.PalmSystem;
				if (palmSystem) {
					palmSystem.stageReady();
				} else {
					this.warn("window.PalmSystem not found");
				}
			}*/
		},
		
		// overridden
		finalize : function() {
			lowland.bom.Style.set(this._getRootElement(), "visibility", "visible");
		},

		

		/**
		 * Returns the root DOM element.
		 * To switch to another root element overwrite this function with your own implementation.
		 *
		 * @return {Element} DOM element that is the root for this application
		 */
		_getRootElement : function() {
			return document.body;
		},
		
		/**
		 * {Element} Returns viewport element all popovers and out of layout widgets are bound to.
		 */
		_getViewportElement : function() {
			return this._getRootElement();
		},
		
		_getTheme : function() {
			if (jasy.Env.getValue("debug")) {
				throw new Error(this.toString() + " needs implementation for _getTheme()!");
			}
		},
		
		/**
		 * Returns the root event DOM element.
		 * To switch to another root event element overwrite this function with your own implementation.
		 *
		 * @return {Element} DOM element that is the event root for this application
		 */
		_getRootEventElement : function() {
			return document.documentElement;
		},

		/**
		 *  Returns the layout for the root view.
		 *  Defaults to canvas, override this function with your own implementation if you want a different layout
		 *
		 *  @return {unify.ui.layout.Base} layout
		 */
		_getRootLayout : function(){
			return new unify.ui.layout.Canvas();
		},
		
		/**
		 * Returns the root widget element
		 *
		 * @return {unify.view.Root} Root widget
		 */
		getRoot : function() {
			return this.__root;
		},
		
		getViewportRoot : function() {
			return this.__root.getViewport();
		},
		
		__viewAnimationManager : null,
		
		_getViewAnimationManager : function() {
			return new unify.view.animation.IOSAnimationManager();
		},
		
		getViewAnimationManager : function() {
			var vam = this.__viewAnimationManager;
			if (!vam) {
				vam = this.__viewAnimationManager = this._getViewAnimationManager();
			}
			
			return vam;
		},


		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/

		/**
		 * Adds a view manager to the root element of the application.
		 *
		 * @param viewManager {Object} Any object with a method "getElement" which returns a DOM element
		 */
		add : function(viewManager) {
			this.__root.add(viewManager, {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			});
		},


		/**
		 * Returns the top-level namespace/package of the application.
		 *
		 * @return {String} Application namespace
		 */
		getNamespace : function()
		{
			var clazz = this.classname;
			return clazz.substring(0, clazz.indexOf("."));
		},
		

		/**
		 * Applies an attribute to the document's body (the application root)
		 * named "orient" which is set to "landscape" or "portrait" depending
		 * on the current device orientation.
		 *
		 * @param e {lowland.events.DataEvent} Orientation change event
		 */
		__onRotate : function(e) {
			/* TODO : 
			this._getRootElement().setAttribute("orient", e.isLandscape()?"landscape":"portrait");*/
		},


		/**
		 * Fired whenever the windows is resized or the orientation is changed.
		 *
		 * @param e {lowland.events.Event} Resize event
		 */
		__onResize : function(e) {
			this.__setupDocumentSize();
		},


		/**
		 * Reconfigures size of HTML element to window inner sizes. This
		 * fixes some issues discovered in PhoneGap where a 100% size includes the
		 * status bar sitting on top of every application.
		 */
		__setupDocumentSize : function()
		{
			/* TODO: if (core.Evn.getValue("phonegap") && core.Evn.getValue("os.name") == "ios")
			{
				// This is a client-side bugfix for this issue in PhoneGap on iPhone OS:
				// http://phonegap.lighthouseapp.com/projects/20116-iphone/tickets/51-uiwebview-viewport-larger-than-application-viewport
				var rootStyle = document.documentElement.style;
				rootStyle.width = window.innerWidth + "px";
				rootStyle.height = window.innerHeight + "px";
			}*/
		},
		
		destruct : function() {
			this._disposeObjects(this.__root);
			unify.core.Init.prototype.destruct.call(this);
		}
	}
});
