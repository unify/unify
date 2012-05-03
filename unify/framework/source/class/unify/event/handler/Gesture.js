/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * This class provides a gesture event handler.
 *
 * Supported event types: gesturestart, gesturechange, gestureend, gesturecancel.
 */
qx.Class.define("unify.event.handler.Gesture",
{
  extend: qx.core.Object,
  implement: qx.event.IEventHandler,


  /*
  ----------------------------------------------------------------------------
    CONSTRUCTOR
  ----------------------------------------------------------------------------
  */

  /**
   * Create a new instance
   *
   * @param manager {qx.event.Manager} Event manager for the window to use
   */
  construct: function(manager)
  {
    this.base(arguments);

    // Define shorthands
    this.__window = manager.getWindow();
    this.__root = this.__window.document.documentElement;

    // Initialize observers
    this.__initObserver();
  },


  /*
  ----------------------------------------------------------------------------
    STATICS
  ----------------------------------------------------------------------------
  */

  statics:
  {
    /** {Integer} Priority of this handler */
    PRIORITY: qx.event.Registration.PRIORITY_NORMAL,

    /** {Map} Supported event types */
    SUPPORTED_TYPES:
    {
      gesturestart: 1,
      gesturechange: 1,
      gestureend: 1,
      gesturecancel: 1
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK: qx.event.IEventHandler.TARGET_DOMNODE,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE: true,

    /** {Boolean} Whether the client supports gesture events */
    SUPPORTS_GESTURE : !!document.createTouch
  },



  /*
  ----------------------------------------------------------------------------
    MEMBERS
  ----------------------------------------------------------------------------
  */

  members:
  {
    __onGestureEventWrapper: null,
    __window: null,
    __root: null,


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent: function(target, type) {
      // Nothing needs to be done here
    },

    // interface implementation
    registerEvent: function(target, type, capture) {
      // Nothing needs to be done here
    },

    // interface implementation
    unregisterEvent: function(target, type, capture) {
      // Nothing needs to be done here
    },


    /*
    ---------------------------------------------------------------------------
      OBSERVER INIT/STOP
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the native gesture event listeners.
     */
    __initObserver: function()
    {
      if (unify.event.handler.Gesture.SUPPORTS_GESTURE)
      {
        var onGestureEventWrapper = this.__onGestureEventWrapper = qx.lang.Function.listener(this.__onGestureEvent, this);
        var Event = qx.bom.Event;
        var root = this.__root;

        Event.addNativeListener(root, "gesturestart", onGestureEventWrapper);
        Event.addNativeListener(root, "gesturechange", onGestureEventWrapper);
        Event.addNativeListener(root, "gestureend", onGestureEventWrapper);
        Event.addNativeListener(root, "gesturecancel", onGestureEventWrapper);
      }
    },


    /**
     * Disconnects the native gesture event listeners.
     */
    __stopObserver: function()
    {
      if (unify.event.handler.Gesture.SUPPORTS_GESTURE)
      {
        var Event = qx.bom.Event;
        var root = this.__root;
        var onGestureEventWrapper = this.__onGestureEventWrapper;

        Event.removeNativeListener(root, "gesturestart", onGestureEventWrapper);
        Event.removeNativeListener(root, "gesturechange", onGestureEventWrapper);
        Event.removeNativeListener(root, "gestureend", onGestureEventWrapper);
        Event.removeNativeListener(root, "gesturecancel", onGestureEventWrapper);
      }
    },


    /**
     * Global handler for the gesture event.
     *
     * @param nativeEvent {Event} native event
     */
    __onGestureEvent : qx.event.GlobalError.observeMethod(function(nativeEvent)
    {
      var target = nativeEvent.target;
      qx.event.Registration.fireEvent(target, nativeEvent.type, unify.event.type.Gesture, [nativeEvent, target, null, true, true]);
    })
  },


  /*
  ----------------------------------------------------------------------------
    DESTRUCTOR
  ----------------------------------------------------------------------------
  */

  destruct : function()
  {
    this.__stopObserver();
    this.__window = this.__root = null;
  },


  /*
  ----------------------------------------------------------------------------
    DEFER
  ----------------------------------------------------------------------------
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
