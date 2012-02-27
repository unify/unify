/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2010-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

(function(global) {

  lowland.bom.Events.listen(global.window, "click", function(e) {
    lowland.bom.Events.dispatch(e.target, "tap");
  });

  /*core.Class("unify.ui.core.EventHandler", {
    construct : function(element) {
      lowland.bom.Events.listen(element, "click", this.__click);
    },
    
    members : {
      __click : function() {
        console.log("CLICK ", arguments);
      }
    }
  });*/

})(this);

/*
  //extend : qx.core.Object,
  //implement : qx.event.IEventHandler,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************

  construct : function()
  {
    this.base(arguments);

    this.__manager = qx.event.Registration.getManager(window);
  },



  /*
  *****************************************************************************
     STATICS
  *****************************************************************************

  statics :
  {
    /** {Integer} Priority of this handler /
    PRIORITY : qx.event.Registration.PRIORITY_FIRST,

    /** {Map} Supported event types. Identical to events map of unify.ui.core.Widget /
    SUPPORTED_TYPES :
    {
      // touch events
      touchstart : 1,
      touchend : 1,
      touchmove : 1,
      touchcancel : 1,
      touchhold : 1,
      touchleave : 1,
      touchrelease : 1,
      tap : 1,
      swipe : 1,
      
      // mouse support
      mousewheel : 1,
      mouseover : 1,
      mouseout : 1,
      mousedown : 1,
      mouseup : 1,
      
      // key events
      keyup : 1,
      keydown : 1,
      keypress : 1,
      keyinput : 1,
      
      // focus events
      focusin : 1,
      focusout : 1,
      focus : 1,
      blur : 1,
      activate : 1,
      deactivate : 1
    },

    /** {Integer} Whether the method "canHandleEvent" must be called /
    IGNORE_CAN_HANDLE : false
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  /

  members :
  {
    __manager : null,


    // interface implementation
    canHandleEvent : function(target, type) {
      return target instanceof unify.ui.core.Widget;
    },


    /**
     * Dispatches a DOM event on a widget.
     *
     * @param domEvent {qx.event.type.Event} The event object to dispatch.
     /
    _dispatchEvent : function(domEvent)
    {
      // EVENT TARGET
      var domTarget = domEvent.getTarget();

      var widgetTarget = unify.ui.core.Widget.getByElement(domTarget);
      var targetChanged = false;


      // EVENT RELATED TARGET
      if (domEvent.getRelatedTarget)
      {
        var domRelatedTarget = domEvent.getRelatedTarget();

        var widgetRelatedTarget = unify.ui.core.Widget.getByElement(domRelatedTarget);

        if (widgetRelatedTarget)
        {
          // If target and related target are identical ignore the event
          if (widgetRelatedTarget === widgetTarget) {
            return;
          }
        }
      }

      // EVENT CURRENT TARGET
      var currentTarget = domEvent.getCurrentTarget();

      var currentWidget = unify.ui.core.Widget.getByElement(currentTarget);
      if (!currentWidget) {
        return;
      }

      // PROCESS LISTENERS
      
      var type = domEvent.getType();

      // Load listeners
      var capture = domEvent.getEventPhase() == qx.event.type.Event.CAPTURING_PHASE;
      var listeners = this.__manager.getListeners(currentWidget, type, capture);
      if (!listeners || listeners.length === 0) {
        return;
      }

      // Create cloned event with correct target
      var widgetEvent = qx.event.Pool.getInstance().getObject(domEvent.constructor);
      domEvent.clone(widgetEvent);

      widgetEvent.setTarget(widgetTarget);
      widgetEvent.setRelatedTarget(widgetRelatedTarget||null);
      widgetEvent.setCurrentTarget(currentWidget);

      // Keep original target of DOM event, otherwise map it to the original
      var orig = domEvent.getOriginalTarget();
      if (orig)
      {
        var widgetOriginalTarget = unify.ui.core.Widget.getByElement(orig);

        widgetEvent.setOriginalTarget(widgetOriginalTarget);
      }
      else
      {
        widgetEvent.setOriginalTarget(domTarget);
      }

      // Dispatch it on all listeners
      for (var i=0, l=listeners.length; i<l; i++)
      {
        var context = listeners[i].context || currentWidget;
        listeners[i].handler.call(context, widgetEvent);
      }

      // Synchronize propagation stopped/prevent default property
      if (widgetEvent.getPropagationStopped()) {
        domEvent.stopPropagation();
      }

      if (widgetEvent.getDefaultPrevented()) {
        domEvent.preventDefault();
      }

      // Release the event instance to the event pool
      qx.event.Pool.getInstance().poolObject(widgetEvent);
    },


    // interface implementation
    registerEvent : function(target, type, capture)
    {
      var elem;

      elem = target.getElement();
      
      if (elem) {
        qx.event.Registration.addListener(elem, type, this._dispatchEvent, this, capture);
      }
    },


    // interface implementation
    unregisterEvent : function(target, type, capture)
    {
      var elem;

      elem = target.getElement();

      if (elem) {
        qx.event.Registration.addListener(elem, type, this._dispatchEvent, this, capture);
      }
    }
  },





  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  /

  destruct : function() {
    this.__manager = null;
  },





  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  /

  defer : function(statics) {
    qx.event.Registration.addHandler(statics);
  }
});
*/
