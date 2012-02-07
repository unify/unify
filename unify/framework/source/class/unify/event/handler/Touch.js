/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Tino Butz (tbtz)
     * Christian Hagendorn (chris_schmidt)
     * Dominik Göpel (dominikg)
     * Alexander Wunschik (mojoaxel)

   ======================================================================

   This class contains code based on the following work:

   * Unify Project

     Homepage:
       http://unify-project.org

     Copyright:
       2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

************************************************************************ */

/* ************************************************************************

#require(qx.event.handler.UserAction)
#require(qx.event.handler.Orientation)

************************************************************************ */

/**
 * This class provides an unified touch event handler.
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
    this.__manager = manager;
    this.__window = manager.getWindow();
    this.__root = this.__window.document;

    this._initTouchObserver();
    this._initMouseObserver();
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
      touchstart : 1,
      touchmove : 1,
      touchend : 1,
      touchcancel : 1, // Appears when the touch is interrupted, e.g. by an alert box
      tap : 1,
      swipe : 1,
      touchhold : 1, // Appears after touchstart if the touch continues for a configurable amount of time and does not leave the original target
      touchleave: 1, // Appears after touchhold if the touch moves out of the hold target
      touchrelease : 1 // Appears after touchhold when the holding touch ends
    },

    /** {Integer} Which target check to use */
    TARGET_CHECK : qx.event.IEventHandler.TARGET_DOMNODE + qx.event.IEventHandler.TARGET_DOCUMENT,

    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE : true,

    /** {Map} Mapping of mouse events to touch events */
    MOUSE_TO_TOUCH_MAPPING :
    {
      "mousedown" : "touchstart",
      "mousemove" : "touchmove",
      "mouseup" : "touchend"
    },

    /** {Map} The direction of a swipe relative to the axis */
    SWIPE_DIRECTION :
    {
      x : ["left", "right"],
      y : ["up", "down"]
    },


    /** {Integer} The maximum distance of a tap. Only if the x or y distance of
     *      the performed tap is less or equal the value of this constant, a tap
     *      event is fired.
     */
    TAP_MAX_DISTANCE : qx.core.Environment.get("os.name") != "android" ? 10 : 40,

    /** {Integer} The minimum distance of a swipe. Only if the x or y distance
     *      of the performed swipe is greater as or equal the value of this
     *      constant, a swipe event is fired.
     */
    SWIPE_MIN_DISTANCE : qx.core.Environment.get("os.name") != "android" ? 11 : 41,

    /** {Integer} The minimum velocity of a swipe. Only if the velocity of the
     *      performed swipe is greater as or equal the value of this constant, a
     *      swipe event is fired.
     */
    SWIPE_MIN_VELOCITY : 0,

      /** {Integer} The delay between gesture start and the firing of a touchhold event.
       *      touchhold is only fired if no touchend or touchleave occured during the delay.
       *      When touchhold was fired a touchrelease event is fired on gesture end.
       */
    TOUCH_HOLD_DELAY: 50
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __onTouchEventWrapper : null,
    __onMouseEventWrapper : null,

    __manager : null,
    __window : null,
    __root : null,
    __startPageX : null,
    __startPageY : null,
    __startTime : null,
    __trackId : null,

    // Checks if the mouse movement is happening while simulating a touch event
    __isInTouch : false,

    __originalTarget : null,

    //touchhold/touchleave/touchrelease support
    __touchHoldTimer : null,
    __isTouchHold : false,
    __hasTouchLeft: false,


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLER INTERFACE
    ---------------------------------------------------------------------------
    */

    // interface implementation
    canHandleEvent : function(target, type) {},

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
      HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * Return the target of the event.
     *
     * @param domEvent {Event} DOM event
     * @return {Element} Event target
     */
    __getTarget : function(domEvent)
    {
      var target = qx.bom.Event.getTarget(domEvent);
      // Text node. Fix Safari Bug, see http://www.quirksmode.org/js/events_properties.html
      if ((qx.core.Environment.get("engine.name") == "webkit"))
      {
        if (target && target.nodeType == 3) {
          target = target.parentNode;
        }
      }
      return target;
    },


    /**
     * Fire a touch event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param type {String ? null} type of the event
     * @param target {Element ? null} event target
     * @param eventTypeClass {Class ? qx.event.type.Touch} the event type class
     */
    __fireEvent : function(domEvent, type, target, eventTypeClass)
    {
      if (!target) {
        target = this.__getTarget(domEvent);
      }

      var type = type || domEvent.type;

      if (target && target.nodeType)
      {
        qx.event.Registration.fireEvent(
          target,
          type,
          eventTypeClass||qx.event.type.Touch,
          [domEvent, target, null, true, true]
        );
      }

      // Fire user action event
      qx.event.Registration.fireEvent(this.__window, "useraction", qx.event.type.Data, [type]);
    },


    /**
     * Checks if a gesture was made and fires the gesture event.
     *
     * @param domEvent {Event} DOM event
     * @param type {String ? null} type of the event
     * @param target {Element ? null} event target
     * @param touch {Object} the tracked touch
     */
    __checkAndFireGesture : function(domEvent, type, target, touch)
    {
      if (!target) {
        target = this.__getTarget(domEvent);
      }
      var type = type || domEvent.type;

      if (type == "touchstart")
      {
        this.__gestureStart(domEvent, target, touch);
      }
      else if (type == "touchmove") {
        this.__gestureChange(domEvent, target, touch);
      }
      else if (type == "touchend")
      {
        this.__gestureEnd(domEvent, target, touch);
      }
      //TODO what about touchcancel (cancel running gesture?)
    },


    /**
     * Helper method for gesture start.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     * @param touch {Object} the tracked touch
     */
    __gestureStart : function(domEvent, target, touch)
    {
      this.__startPageX = touch.screenX;
      this.__startPageY = touch.screenY;
      this.__startTime = new Date().getTime();
      this.__startTouchHoldTimer(domEvent,target);
    },


    /**
     * Helper method for gesture change.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     * @param touch {Object} the tracked touch
     */
    __gestureChange : function(domEvent, target, touch)
    {
      if(this.__isTouchHold&&!this.__hasTouchLeft){
        this.__checkTouchLeave(domEvent,target,touch);
      }
    },


    /**
     * Helper method for gesture end.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     * @param touch {Object} the tracked touch
     */
    __gestureEnd : function(domEvent, target, touch)
    {
      this.__checkTouchRelease(domEvent,target);

      var deltaCoordinates = {
        x : touch.screenX - this.__startPageX,
        y : touch.screenY - this.__startPageY
      };

      var clazz = qx.event.handler.Touch;
      if (this.__originalTarget == target
          && Math.abs(deltaCoordinates.x) <= clazz.TAP_MAX_DISTANCE
          && Math.abs(deltaCoordinates.y) <= clazz.TAP_MAX_DISTANCE) {
        this.__fireEvent(domEvent, "tap", target, qx.event.type.Tap);
      }
      else
      {
        var swipe = this.__getSwipeGesture(domEvent, target, deltaCoordinates);
        if (swipe) {
          domEvent.swipe = swipe;
          this.__fireEvent(domEvent, "swipe", target, qx.event.type.Swipe);
        }
      }
    },


    /**
     * Returns the swipe gesture when the user performed a swipe.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     * @param deltaCoordinates {Map} delta x/y coordinates since the gesture started.
     * @return {Map} returns the swipe data when the user performed a swipe, null if the gesture was no swipe.
     */
    __getSwipeGesture : function(domEvent, target, deltaCoordinates)
    {
      var clazz = qx.event.handler.Touch;
      var duration = new Date().getTime() - this.__startTime;
      var deltaX=Math.abs(deltaCoordinates.x);
      var deltaY=Math.abs(deltaCoordinates.y);
      var axis =  deltaX>= deltaY ? "x" : "y";
      var distance = deltaCoordinates[axis];
      var direction = clazz.SWIPE_DIRECTION[axis][distance < 0 ? 0 : 1]
      var velocity = (duration !== 0) ? distance/duration : 0;
      var directionAccuracy=0;
      if(axis=="x"){
        directionAccuracy=deltaX!==0?1-(deltaY/deltaX):0;
      } else {
        directionAccuracy=deltaY!==0?1-(deltaX/deltaY):0;
      }
      var swipe = null;
      if (Math.abs(velocity) >= clazz.SWIPE_MIN_VELOCITY
          && Math.abs(distance) >= clazz.SWIPE_MIN_DISTANCE)
      {
        swipe = {
            startTime : this.__startTime,
            duration : duration,
            axis : axis,
            direction : direction,
            directionAccuracy: directionAccuracy,
            distance : distance,
            velocity : velocity
        };
      }
      return swipe;
    },

    /**
     * Fires a touchhold event
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    __touchHold: function(domEvent,target){
      if(target==this.__originalTarget){
        this.__isTouchHold = true;
        this.__hasTouchLeft = false;
        this.__touchHoldLoc= qx.bom.element.Location.get(this.__originalTarget);
        this.__fireEvent(domEvent, "touchhold", this.__originalTarget);
      }
    },

    /**
     * Fires a touchleve event if touchhold has been fired before and the touch is outside of the target
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     * @param touch the tracked touch
     */
    __checkTouchLeave: function(domEvent,target,touch){
      var hasLeft=(target!=this.__originalTarget);
      if(!hasLeft){
        var loc= this.__touchHoldLoc;
        var x=touch.pageX;
        var y=touch.pageY;
        hasLeft= (x<loc.left||x>loc.right||y<loc.top||y>loc.bottom);
      }
      if(hasLeft){
        this.__touchHoldLoc=null;
        this.__hasTouchLeft=true;
        this.__fireEvent(domEvent, "touchleave", this.__originalTarget);
      }
    },

    /**
     * Fires a touchrelease event if touchhold has been fired before
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    __checkTouchRelease: function(domEvent,target){
      this.__cancelTouchHoldTimer();
      this.__hasTouchLeft=false;
      if(this.__isTouchHold)
      {
        this.__isTouchHold=false;
        this.__fireEvent(domEvent, "touchrelease", this.__originalTarget);
      }
    },

    /**
     * Starts a timer that fires a touchhold event.
     *
     * @param domEvent {Event} DOM event
     * @param target {Element} event target
     */
    __startTouchHoldTimer: function(domEvent,target){
      this.__cancelTouchHoldTimer();
      var self = this;
      this.__touchHoldTimer = window.setTimeout(function()
      {
        self.__touchHold(domEvent,target);
      }, qx.event.handler.Touch.TOUCH_HOLD_DELAY);
    },

    /**
     * Cancels an existing timer for touchhold event.
     */
    __cancelTouchHoldTimer: function(){
      if (this.__touchHoldTimer)
      {
        window.clearTimeout(this.__touchHoldTimer);
        this.__touchHoldTimer = null;
      }
    },

    /**
     * Normalizes a mouse event to a touch event.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     */
    __normalizeMouseEvent : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function(domEvent)
      {
        var type = domEvent.type;
        var eventMapping = qx.event.handler.Touch.MOUSE_TO_TOUCH_MAPPING;
        if (eventMapping[type])
        {
          type = eventMapping[type];
          // Remember if we are in a touch event
          if (type == "touchstart" && this.__isLeftMouseButton(domEvent)) {
            this.__isInTouch = true;
          } else if (type == "touchend") {
            this.__isInTouch = false;
          }

          var touchObject = this.__createTouchObject(domEvent);
          var touchArray = (type == "touchend" ? [] : [touchObject]);

          // add the touches to the native mouse event
          domEvent.touches = touchArray;
          domEvent.targetTouches = touchArray;
          domEvent.changedTouches = [touchObject];
        }
        return type;
      },

      "default" : qx.lang.Function.empty
    }),


    /**
     * Checks if the left mouse button is pressed.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     * @return {Boolean} Whether the left mouse button is pressed
     */
    __isLeftMouseButton : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function(domEvent)
      {
        if ((qx.core.Environment.get("engine.name") == "mshtml")) {
          var buttonIndex = 1;
        } else {
          var buttonIndex = 0;
        }
        return domEvent.button == buttonIndex;
      },

      "default" : qx.lang.Function.empty
    }),


    /**
     * Creates and returns a Touch mock object.
     * Fore more information see:
     * http://developer.apple.com/safari/library/documentation/UserExperience/Reference/TouchClassReference/Touch/Touch.html
     *
     * @signature function(domEvent)
     * @param domEvent {Event} DOM event
     * @return {Object} The Touch mock object
     */
    __createTouchObject : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function(domEvent)
      {
        var target = this.__getTarget(domEvent);
        return {
          clientX : domEvent.clientX,
          clientY : domEvent.clientY,
          screenX : domEvent.screenX,
          screenY : domEvent.screenY,
          pageX : domEvent.pageX,
          pageY : domEvent.pageY,
          identifier : 1,
          target : target
        };
      },

      "default" : qx.lang.Function.empty
    }),


    /*
    ---------------------------------------------------------------------------
      OBSERVER INIT
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the native touch event listeners.
     */
    _initTouchObserver : function()
    {
      this.__onTouchEventWrapper = qx.lang.Function.listener(this._onTouchEvent, this);

      var Event = qx.bom.Event;

      Event.addNativeListener(this.__root, "touchstart", this.__onTouchEventWrapper);
      Event.addNativeListener(this.__root, "touchmove", this.__onTouchEventWrapper);
      Event.addNativeListener(this.__root, "touchend", this.__onTouchEventWrapper);
      Event.addNativeListener(this.__root, "touchcancel", this.__onTouchEventWrapper);
    },


    /**
     * Initializes the native mouse event listeners.
     */
    _initMouseObserver : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function()
      {
        if (!qx.core.Environment.get("event.touch"))
        {
          this.__onMouseEventWrapper = qx.lang.Function.listener(this._onMouseEvent, this);

          var Event = qx.bom.Event;

          Event.addNativeListener(this.__root, "mousedown", this.__onMouseEventWrapper);
          Event.addNativeListener(this.__root, "mousemove", this.__onMouseEventWrapper);
          Event.addNativeListener(this.__root, "mouseup", this.__onMouseEventWrapper);
        }
      },
      "default" : qx.lang.Function.empty
    }),


    /*
    ---------------------------------------------------------------------------
      OBSERVER STOP
    ---------------------------------------------------------------------------
    */

    /**
     * Disconnects the native touch event listeners.
     */
    _stopTouchObserver : function()
    {
      var Event = qx.bom.Event;

      Event.removeNativeListener(this.__root, "touchstart", this.__onTouchEventWrapper);
      Event.removeNativeListener(this.__root, "touchmove", this.__onTouchEventWrapper);
      Event.removeNativeListener(this.__root, "touchend", this.__onTouchEventWrapper);
      Event.removeNativeListener(this.__root, "touchcancel", this.__onTouchEventWrapper);
    },


    /**
     * Disconnects the native mouse event listeners.
     */
    _stopMouseObserver : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : function()
      {
        if (!qx.core.Environment.get("event.touch"))
        {
          var Event = qx.bom.Event;

          Event.removeNativeListener(this.__root, "mousedown", this.__onMouseEventWrapper);
          Event.removeNativeListener(this.__root, "mousemove", this.__onMouseEventWrapper);
          Event.removeNativeListener(this.__root, "mouseup", this.__onMouseEventWrapper);
        }
      },
      "default" : qx.lang.Function.empty
    }),


    /*
    ---------------------------------------------------------------------------
      NATIVE EVENT OBSERVERS
    ---------------------------------------------------------------------------
    */

    /**
     * Handler for the native touch events.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} The touch event from the browser.
     */
    _onTouchEvent : qx.event.GlobalError.observeMethod(function(domEvent)
    {
      this._commonTouchEventHandler(domEvent);
    }),


    /**
     * Handler for the native mouse events.
     *
     * @signature function(domEvent)
     * @param domEvent {Event} The mouse event from the browser.
     */
    _onMouseEvent : qx.core.Environment.select("qx.mobile.emulatetouch",
    {
      "true" : qx.event.GlobalError.observeMethod(function(domEvent)
      {
        if (!qx.core.Environment.get("event.touch"))
        {
          if (domEvent.type == "mousemove" && !this.__isInTouch) {
            return;
          }
          // only fire a "tap" event on the left mouse button
          if (!this.__isLeftMouseButton(domEvent)) {
            return;
          }
          var type = this.__normalizeMouseEvent(domEvent);
          this._commonTouchEventHandler(domEvent, type);
        }
      }),

      "default" : qx.lang.Function.empty
    }),


    /**
     * Called by an event handler.
     *
     * @param domEvent {Event} DOM event
     * @param type {String ? null} type of the event
     */
    _commonTouchEventHandler : function(domEvent, type)
    {
      var type = type || domEvent.type;
      var touch;

      if (type == "touchstart") {
        if(this.__trackId){
          return;//we are already tracking a finger, ignore additional touchstart event
        } else {
          touch = domEvent.changedTouches[0];
          this.__trackId = touch.identifier;//start tracking
        }
        this.__originalTarget = this.__getTarget(domEvent);
      } else {
        touch=this.__findTouch(domEvent.changedTouches,this.__trackId);
        if(!touch){
          return;//the finger we are tracking was not changed
        } else if(type=="touchend"||type=="touchcancel"){
           this.__trackId=null;//stop tracking
        }
      }
      this.__fireEvent(domEvent, type);
      this.__checkAndFireGesture(domEvent, type, null,touch);
    },

    /**
     * Finds a touch with id in touchlist
     * @param touchlist list of touches from the touch event
     * @param id
     * @return the found touch or null if no matching touch was found
     */
    __findTouch : function (touchlist,id){
      for(var i=0,l=touchlist.length;i<l;i++){
        if( touchlist[i].identifier ==id){
          return touchlist[i];
        }
      }
      return null;
    }
  },


  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__cancelTouchHoldTimer();
    this._stopTouchObserver();
    this._stopMouseObserver();

    this.__manager = this.__window = this.__root = this.__originalTarget = null;
  },


  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);

    // Prevent scrolling on the document to avoid scrolling at all
    // TODO: Seems like Android does not prevent scrolling on touchmove
    //       Perhaps we should use "touchstart" here?
    if (qx.core.Environment.get("event.touch")) {
      if (qx.core.Environment.get("qx.mobile.nativescroll") == false)
      {

        document.addEventListener("touchstart", function(e) {
          var target=e.touches[0].target;
          if(target.tagName && target.tagName.match(/input|textarea|select/i)){
            return;//never prevent touchstart on an input, it would prevent required native behaviour like showing the keyboard on ios5
          }
          e.preventDefault();
        });
        document.addEventListener("touchmove", function(e) {
          e.preventDefault();
        });
      }

      // get the handler to asure that the instance is created
      qx.event.Registration.getManager(document).getHandler(statics);
    }
  }
});