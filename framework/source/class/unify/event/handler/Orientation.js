/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This handler provides event for orientation changes. Based on .
 */
qx.Class.define("unify.event.handler.Orientation",
{
	extend : qx.core.Object,
	implement : qx.event.IEventHandler,



	/*
	*****************************************************************************
		 CONSTRUCTOR
	*****************************************************************************
	*/

	/**
	 * Create a new instance
	 *
	 * @param manager {qx.event.Manager} Event manager for the window to use
	 */
	construct : function(manager)
	{
		this.base(arguments);

		// Define shorthands
		this.__manager = manager;
		this.__window = manager.getWindow();

		// Cache last orientation
		this.__lastOrientation = qx.bom.Viewport.getOrientation();

		// Detect event support
		this.__eventType = qx.bom.Event.supportsEvent(window, "orientationchange") ? "orientationchange" : "resize";

		// Initialize observers
		this.__initObserver();
	},



	/*
	*****************************************************************************
		 STATICS
	*****************************************************************************
	*/

	statics :
	{
		/** {Integer} Priority of this handler */
		PRIORITY : qx.event.Registration.PRIORITY_NORMAL,

		/** {Map} Supported event types */
		SUPPORTED_TYPES : {
			rotate : 1
		},

		/** {Integer} Which target check to use */
		TARGET_CHECK : qx.event.IEventHandler.TARGET_WINDOW,

		/** {Integer} Whether the method "canHandleEvent" must be called */
		IGNORE_CAN_HANDLE : true
	},



	/*
	*****************************************************************************
		 MEMBERS
	*****************************************************************************
	*/

	members :
	{
		__window : null,
		__manager : null,
		__lastOrientation : null,
		__onNativeWrapper : null,



		/*
		---------------------------------------------------------------------------
			EVENT HANDLER INTERFACE
		---------------------------------------------------------------------------
		*/

		// interface implementation
		canHandleEvent : function(target, type) {
			// Nothing needs to be done here
		},

		// interface implementation
		registerEvent : function(target, type, capture) {
			// Nothing needs to be done here
		},

		// interface implementation
		unregisterEvent : function(target, type, capture) {
			// Nothing needs to be done here
		},



		/*
		---------------------------------------------------------------------------
			OBSERVER INIT/STOP
		---------------------------------------------------------------------------
		*/

		/**
		 * Initializes the native window event listeners.
		 *
		 * @return {void}
		 */
		__initObserver : function()
		{
			this.__onNativeWrapper = qx.lang.Function.listener(this.__onNative, this);
			qx.bom.Event.addNativeListener(this.__window, this.__eventType, this.__onNativeWrapper);
		},


		/**
		 * Disconnect the native window event listeners.
		 *
		 * @return {void}
		 */
		__stopObserver : function() {
			qx.bom.Event.addNativeListener(this.__window, this.__eventType, this.__onNativeWrapper);
		},



		/*
		---------------------------------------------------------------------------
			NATIVE EVENT SUPPORT
		---------------------------------------------------------------------------
		*/

		/**
		 * Native listener for all supported events.
		 *
		 * @signature function(e)
		 * @param e {Event} Native event
		 */
		__onNative: qx.event.GlobalError.observeMethod(function(e)
		{
			var Viewport = qx.bom.Viewport;
			var orientation = Viewport.getOrientation();

			// Especially needed for resize events: Compare old and new size and check
			// whether the orientation has really been modified.
			if (orientation != this.__lastOrientation)
			{
				this.__lastOrientation = orientation;
				var mode = Viewport.isLandscape() ? "landscape" : "portrait";
				qx.event.Registration.fireEvent(window, "rotate", unify.event.type.Orientation, [orientation, mode]);
			}
		})
	},



	/*
	*****************************************************************************
		 DESTRUCTOR
	*****************************************************************************
	*/

	destruct : function()
	{
		this.__stopObserver();
		this.__manager = null;
	},




	/*
	*****************************************************************************
		 DEFER
	*****************************************************************************
	*/

	defer : function(statics) {
		qx.event.Registration.addHandler(statics);
	}
});
