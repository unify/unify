/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class provides support for HTML5 transition events.
 *
 * Supported event types are: transitionEnd, animationStart, animationIteration and animationEnd.
 *
 * Currently only working on recent Webkit versions with transition support.
 */
qx.Class.define("unify.event.handler.Transition",
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
    this.__window = manager.getWindow();
    this.__root = this.__window.document.documentElement;

    // Wrap functions
    this.__onEventWrapper = qx.lang.Function.listener(this.__onEvent, this);
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
    SUPPORTED_TYPES :
    {
      transitionEnd : 1,
      animationEnd : 1,
      animationStart : 1,
      animationIteration : 1
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members:
  {
    __onEventWrapper : null,
    __window : null,
    __root : null,

    __nativeTypes : qx.core.Environment.select("engine.name",
    {
      "webkit" :
      {
        transitionEnd : "webkitTransitionEnd",
        animationEnd : "webkitAnimationEnd",
        animationStart : "webkitAnimationStart",
        animationIteration : "webkitAnimationIteration"
      },

      "gecko" :
      {
        transitionEnd : "mozTransitionEnd",
        animationEnd : "mozAnimationEnd",
        animationStart : "mozAnimationStart",
        animationIteration : "mozAnimationIteration"
      },

      "default" : null
    }),

    __publicTypes : qx.core.Environment.select("engine.name",
    {
      "webkit" :
      {
        webkitTransitionEnd : "transitionEnd",
        webkitAnimationEnd : "animationEnd",
        webkitAnimationStart : "animationStart",
        webkitAnimationIteration : "animationIteration"
      },

      "gecko" :
      {
        mozTransitionEnd : "transitionEnd",
        mozAnimationEnd : "animationEnd",
        mozAnimationStart : "animationStart",
        mozAnimationIteration : "animationIteration"
      },

      "default" : null
    }),




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
    /**
     * @signature function(target, type, capture)
     */
    registerEvent: qx.core.Environment.select("engine.name",
    {
      "webkit|gecko" : function(target, type, capture) {
        qx.bom.Event.addNativeListener(target, this.__nativeTypes[type], this.__onEventWrapper);
      },

      "default" : function() {}
    }),


    // interface implementation
    /**
     * @signature function(target, type, capture)
     */
    unregisterEvent: qx.core.Environment.select("engine.name",
    {
      "webkit|gecko" : function(target, type, capture) {
        qx.bom.Event.removeNativeListener(target, this.__nativeTypes[type], this.__onEventWrapper);
      },

      "default" : function() {}
    }),



    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVERS
    ---------------------------------------------------------------------------
    */

    /**
     * Global handler for the touch event.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     */
    __onEvent : qx.event.GlobalError.observeMethod(function(nativeEvent) {
      qx.event.Registration.fireEvent(nativeEvent.target, this.__publicTypes[nativeEvent.type], qx.event.type.Event);
    })
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
