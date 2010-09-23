/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ************************************************************************

#require(qx.event.dispatch.DomBubbling)

************************************************************************ */

/**
 * This class provides a touch event handler.
 *
 * Supported event types: touchstart, touchmove, touchend and touchcancel.
 *
 * Different to other events, the event object is not directly related to
 * the touch event. Rather it is a container that holds several lists
 * in which the actual events are stored.
 *
 * For development purposes this handler supports mouse events to emulate
 * one finger touch events on clients which doesn't support touch events.
 */
qx.Class.define("unify.event.handler.Touch",
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
    SUPPORTED_TYPES :
    {
      tap : 1,
      touchstart : 1,
      touchmove : 1,
      touchend : 1,
      touchcancel : 1,
      touchhold : 1,
      touchrelease : 1
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true,

    /** {Boolean} Whether the client supports touch events */
    SUPPORTS_TOUCH : (function() {
      var touch;
      try {
        touch = (typeof document.createEvent('TouchEvent')['initTouchEvent'] == 'function');
      } catch (e) {
        touch = false;
      }
      return touch;
    })()
  },




  /*
  *****************************************************************************
    MEMBERS
  *****************************************************************************
  */

  members:
  {
    __onNativeEventWrapper : null,
    __window : null,
    __root : null,



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
     * Initializes the native touch event listeners.
     */
    __initObserver : function()
    {
      var onTouchEventWrapper = this.__onNativeEventWrapper = qx.lang.Function.listener(this.__onNativeEvent, this);
      var Event = qx.bom.Event;
      var root = this.__root;

      if (unify.event.handler.Touch.SUPPORTS_TOUCH)
      {
        Event.addNativeListener(root, "touchstart", onTouchEventWrapper);
        Event.addNativeListener(root, "touchmove", onTouchEventWrapper);
        Event.addNativeListener(root, "touchend", onTouchEventWrapper);
        Event.addNativeListener(root, "touchcancel", onTouchEventWrapper);
      }
      else
      {
        // emulate one finger touch events via mouse events for development purposes
        Event.addNativeListener(root, "mousedown", onTouchEventWrapper);
        Event.addNativeListener(root, "mousemove", onTouchEventWrapper);
        Event.addNativeListener(root, "mouseup", onTouchEventWrapper);
      }
    },


    /**
     * Disconnects the native touch event listeners.
     */
    __stopObserver : function()
    {
      var Event = qx.bom.Event;
      var root = this.__root;
      var onTouchEventWrapper = this.__onNativeEventWrapper;

      if (unify.event.handler.Touch.SUPPORTS_TOUCH)
      {
        Event.removeNativeListener(root, "touchstart", onTouchEventWrapper);
        Event.removeNativeListener(root, "touchmove", onTouchEventWrapper);
        Event.removeNativeListener(root, "touchend", onTouchEventWrapper);
        Event.removeNativeListener(root, "touchcancel", onTouchEventWrapper);
      }
      else
      {
        // emulate one finger touch events via mouse events for development purposes
        Event.removeNativeListener(root, "mousedown", onTouchEventWrapper);
        Event.removeNativeListener(root, "mousemove", onTouchEventWrapper);
        Event.removeNativeListener(root, "mouseup", onTouchEventWrapper);
      }
    },



    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVER
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether the left mouse button in pressed */
    __mouseIsDown : false,

    /** {Element} Original target from start event */
    __originalTarget : null,

    /** {Boolean} Whether the finger has been moved around */
    __hasMoved : false,

    /** {Boolean} Whether the user holds a touch */
    __hold : false,

    /** {Object} Handle for timeout used to detect touch down states */
    __touchDownHandle : null,

    /** {Array} Position of initial touch down event */
    __moveposition : null,


    /** {Map} Internal event type re-mapping. Used to emulate one finger touch events for development purposes. */
    __typeTranslation :
    {
      "mousedown" : "touchstart",
      "mousemove" : "touchmove",
      "mouseup" : "touchend"
    },


    /** {Map} Prevent default action on all elements but the listed ones */
    __inputTags :
    {
      "SELECT" : 1,
      "INPUT" : 1,
      "TEXTAREA" : 1
    },


    /**
     * Global handler for the touch event.
     *
     * @param nativeEvent {Event} DOM event
     */
    __onNativeEvent : qx.event.GlobalError.observeMethod(function(nativeEvent)
    {
      var type = nativeEvent.type;
      var target = nativeEvent.target;
      var Registration = qx.event.Registration;
      var supportsTouch = unify.event.handler.Touch.SUPPORTS_TOUCH;
      var touches = supportsTouch ? nativeEvent.changedTouches.length : 1;

      // Debug
      if (touches > 1) {
        this.debug("More than one change at once!");
      }

      // Fix text node clicks
      if (target.nodeType == 3) {
        target = target.parentNode;
      }

      // Translate mouse events to touch events
      // Ignore mouse move without a button being pressed (touchmove)
      if (!unify.event.handler.Touch.SUPPORTS_TOUCH)
      {
        // Emulate one finger touch events via mouse events for development purposes
        if (type === "mousedown") {
          this.__mouseIsDown = true;
        } else if (type === "mouseup") {
          this.__mouseIsDown = false;
        } else if (type === "mousemove" && !this.__mouseIsDown) {
          return;
        }

        type = this.__typeTranslation[type] || type;
      }

      // Prevent all native actions
      if (!this.__inputTags[target.tagName]) {
        nativeEvent.preventDefault();
      }

      // Fire qooxdoo event
      Registration.fireEvent(target, type, unify.event.type.Touch, [nativeEvent, target, null, true, true]);

      // Fire virtual tap event
      if (touches === 1)
      {
        if (this.__touchDownHandle)
        {
          window.clearTimeout(this.__touchDownHandle);
          this.__touchDownHandle = null;
        }

        if (type === "touchstart")
        {
          this.__hasMoved = false;
          if (qx.core.Variant.isSet("unify.touch", "wiggly")) {
            this.__moveposition = [nativeEvent.changedTouches[0].screenX, nativeEvent.changedTouches[0].screenY];
          }
          this.__originalTarget = target;

          var self = this;
          this.__touchDownHandle = window.setTimeout(function()
          {
            self.__hold = true;
            Registration.fireEvent(target, "touchhold", unify.event.type.Touch, [nativeEvent, target, null, true, false]);
          }, 50);
        }
        else
        {
          if (type === "touchmove") {
            if (qx.core.Variant.isSet("unify.touch", "wiggly")) {
              var x = nativeEvent.changedTouches[0].screenX;
              var y = nativeEvent.changedTouches[0].screenY;
              var oldx = this.__moveposition[0];
              var oldy = this.__moveposition[1];
              var gate = 4;
              if ( (x-gate > oldx) || (x+gate < oldx) ||
                 (y-gate > oldy) || (y+gate < oldy) ) {
                this.__hasMoved = true;
              }
            } else {
              this.__hasMoved = true;
            }
          }

          if (this.__hold)
          {
            this.__hold = null;
            Registration.fireEvent(target, "touchrelease", unify.event.type.Touch, [nativeEvent, target, null, true, false]);
          }

          if (!this.__hasMoved && target === this.__originalTarget && type === "touchend") {
            Registration.fireEvent(target, "tap", unify.event.type.Touch, [nativeEvent, target, null, true, false]);
          }
        }
      }
    })
  },



  /*
  *****************************************************************************
    DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this.__stopObserver();
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
