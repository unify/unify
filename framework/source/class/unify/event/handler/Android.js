/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class provides android special key event handler.
 *
 * Supported event types: backKeyDown, searchKeyDown, menuKeyDown.
 */
qx.Class.define("unify.event.handler.Android",
{
  extend: qx.core.Object,
  implement: qx.event.IEventHandler,
  
  
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
  construct: function(manager) 
  {
    this.base(arguments);
    
    // Define shorthands
    this.__window = manager.getWindow();
    this.__root = this.__window.document;
    
    // Initialize observers
    this.__initObserver();
  },
  
  
  /*
  *****************************************************************************
    STATICS
  *****************************************************************************
  */
  
  statics:
  {
    /** {Integer} Priority of this handler */
    PRIORITY: qx.event.Registration.PRIORITY_NORMAL,
    
    /** {Map} Supported event types */
    SUPPORTED_TYPES:
    {
      backKeyDown : 1, 
      searchKeyDown : 1, 
      menuKeyDown : 1
    },
    
    /** {Integer} Whether the method "canHandleEvent" must be called */
    IGNORE_CAN_HANDLE: true
  },
  

  
  /*
  *****************************************************************************
    MEMBERS
  *****************************************************************************
  */
  
  members:
  {
    __onEventWrapper: null,
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
      var onEventWrapper = this.__onEventWrapper = qx.lang.Function.listener(this.__onKeyEvent, this);
      var Event = qx.bom.Event;
      var root = this.__root;
      
      Event.addNativeListener(root, "backKeyDown", onEventWrapper);
      Event.addNativeListener(root, "searchKeyDown", onEventWrapper);
      Event.addNativeListener(root, "menuKeyDown", onEventWrapper);
    },
    
    
    /**
     * Disconnects the native gesture event listeners.
     */
    __stopObserver: function() 
    {
      var Event = qx.bom.Event;
      var root = this.__root;
      var onEventWrapper = this.__onEventWrapper;
      
      Event.removeNativeListener(root, "backKeyDown", onEventWrapper);
      Event.removeNativeListener(root, "searchKeyDown", onEventWrapper);
      Event.removeNativeListener(root, "menuKeyDown", onEventWrapper);
    },
    
    
    /**
     * Global handler for the gesture event.
     *
     * @param nativeEvent {Event} native event
     */
    __onKeyEvent : qx.event.GlobalError.observeMethod(function(nativeEvent) 
    {
      qx.event.Registration.fireEvent(nativeEvent.target, nativeEvent.type);
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
    this.__window = this.__root = null;
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
