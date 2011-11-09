/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 */
qx.Class.define("unify.view.ViewManager", {
  extend : qx.core.Object,
  implement : [unify.view.IViewManager],
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param managerId {String} globally unique ID of this manager
   */
  construct : function(managerId)
  {
    this.base(arguments);

    if (qx.core.Environment.get("qx.debug"))
    {
      if (managerId == null) {
        throw new Error("Invalid manager ID: " + managerId);
      }
    }

    // Store manager ID
    this.__managerId = managerId;
    
    // Add to registry
    var registry = unify.view.ViewManager.__managers;
    if (qx.core.Environment.get("qx.debug"))
    {
      if (registry[managerId]) {
        throw new Error("Manager ID is already in use by: " + registry[managerId]);
      }
    }
    registry[managerId] = this;
    
    // Create instance specific data structures
    this.__views = {};
  },



  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */
  
  statics :
  {
    /** {Map} Maps the manager IDs to their instances */
    __managers : {},
    
    
    /**
     * Returns the manager with the given ID
     *
     * @param managerId {String} The ID of the view manager
     * @return {unify.view.ViewManager} The view manager instance
     */
    get : function(managerId)
    {
      var mgr = this.__managers[managerId];
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!mgr) {
          throw new Error("Unknown view manager: " + managerId);
        }
      }
      
      return mgr;
    }
  },
  
  


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired whenever the view-local path was modified */
    changePath : "qx.event.type.Data",
    changeView : "qx.event.type.Event"
  },
  
  
  
  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    /** 
     * Related view manager which functions as a master (controller) for this view manager 
     */
    master : 
    {
      check : "unify.view.ViewManager",
      nullable : true
    },

    /**
     * how this view manager is displayed
     * allowed values:
     *
     *   default: shares space with other ViewManagers
     *   popover: pop over all other ViewManagers with a blocking pane that closes the pop over on tap
     *   modal: shows over all other ViewManagers with a blocking pane that does nothing
     */
    displayMode : {
      check : "String",
      init: "default",
      //apply: "_applyDisplayMode",
      event: "changeDisplayMode"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __initialized : false,
    
    _createWidgetElement : function() {
      var e = this.__viewcontainer = new unify.ui.container.Composite(new qx.ui.layout.Canvas());
      var elem = e.getElement();
      elem.id = this.getId();
      e.setUserData("viewManager", this);
      
      return e;
    },
    
    _getWidgetElement : function() {
      var e = this.__widgetElement;
      if (e) {
        return e;
      }
      
      e = this.__widgetElement = this._createWidgetElement();
      
      return e;
    },
    
    getElement : function() {
      return this._getWidgetElement().getElement();
    },
    
    getWidgetElement : function() {
      return this._getWidgetElement();
    },
    
    setMasterView : function(isMaster) {
      this._getWidgetElement().setMasterView(isMaster);
    },
    
    /**
     * Returns the currently selected view instance
     *
     * @return {unify.view.StaticView} View instance which is currently selected
     */
    getCurrentView : function() {
      return this.__currentView;
    },
    
    /**
     * Returns the local path of the view manager
     *
     * @return {Map[]} List of dictonaries (with keys view, segment and param)
     */
    getPath : function() {
      return this.__path;
    },
    
    /**
     * Returns the ID of the view manager
     *
     * @return {String} The ID
     */
    getId : function() {
      return this.__managerId;
    },
    
    init : function() {
      this.debug("Init");
      if (!this.__path && this.getDisplayMode()!='modal') {
        this.__resetHelper();
      }

      qx.ui.core.queue.Visibility.add(this.__viewcontainer);
      qx.ui.core.queue.Layout.add(this.__viewcontainer);
      qx.ui.core.queue.Manager.flush();
      
      this.__initialized = true;
    },
    
    /**
     * Whether the view manager is initialized
     *
     * @return {Boolean} <code>true</code> if initialized
     */
    isInitialized : function() {
      return this.__initialized;
    },
    
    /**
     * Resets the view manager to the defaultView if it is not already selected.
     */
    reset : function()
    {
      if (!this.__initialized) {
        return;
      }
      
      // Check whether we are already at default view
      var path = this.__path;
      var defaultViewId = this.__defaultViewId;
      if (path==null||(path.length == 1 && path[0].view == defaultViewId)) {
        return;
      }

      this.__resetHelper();
    },
    
    /**
     * Internal helper to reset state of view and jump to the
     * default view (with its default segment).
     *
     */
    __resetHelper : function()
    {
      var defaultViewId = this.__defaultViewId;
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!defaultViewId) {
          throw new Error("Missing default view ID!");
        }
      }
      
      var viewObj = this.__views[defaultViewId].getInstance();

      this.__path = new unify.view.Path({
        view : defaultViewId,
        segment : viewObj.getDefaultSegment(),
        param : null
      });

      viewObj.setSegment(viewObj.getDefaultSegment()||null);
      viewObj.resetParam();
      this.__setView(viewObj);
      this.fireDataEvent("changePath", this.__path);
    },

    /**
     * Navigates to the given path
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path) {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!(path instanceof unify.view.Path)) {
          throw new Error("Invalid path to navigate() to: " + path);
        }
      }

      var length = path.length;
      if (length == 0) {
        this.warn("Empty path!");
        return;
      }
      
      var oldPath = this.__path;
      var oldLength = oldPath ? oldPath.length : 0;
      var layerTransition = null;
      var ChunkEquals = unify.view.Path.chunkEquals;

      // Detect transition
      if (oldLength > 0)
      {
        
        var minLength = Math.min(length, oldLength);
        
        if (minLength >= 0) {
          var equal = true;
          var pos = 0;
          while (equal) {
            if (ChunkEquals(path[pos],oldPath[pos])) {
              pos ++;
            } else {
              equal = false;
            }
          }

          // View is parent or child of old view
          if (pos == minLength) {
            if (length > oldLength) {
              layerTransition = "in";
            } else if (length < oldLength) {
              layerTransition = "out";
            }
          }
        }
      }
      
      // Find current view object
      var views = this.__views;
      var currentFragment = path[length-1];
      var currentViewCls = views[currentFragment.view || this.__currentView.getId()];
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!currentViewCls) {
          throw new Error("Invalid view: " + currentFragment.view + " in view manager " + this.getId());
        }
      }
      
      var currentViewObj = currentViewCls.getInstance();

      // Automatically fill segment if its empty
      // - 1. via currently selected segment
      // - 2. via default segment (if available)
      // Note: This hot-patches the path object after parsing
      if (currentFragment.segment == null)
      {
        var selectedSegment = currentViewObj.getSegment();
        if (selectedSegment) {
          currentFragment.segment = selectedSegment;
        }
        else
        {
          var defaultSegment = currentViewObj.getDefaultSegment();
          if (defaultSegment) {
            currentFragment.segment = defaultSegment;
          }
        }
      }

      // Verify that parent is correctly configured
      // This is required for correct back titles and smooth back animation
      var parentFragment = path[length-2];
      if (parentFragment)
      {
        var parentViewCls = views[parentFragment.view];
        if (!parentViewCls) {
          throw new Error("Invalid view: " + parentFragment.view + " in view manager " + this.getId());
        } else if (parentViewCls === currentViewCls) {
          throw new Error("Parent view class could not be identical to current view class!");
        }

        var parentViewObj = parentViewCls.getInstance();

        parentViewObj.setSegment(parentFragment.segment||null);
        parentViewObj.setParam(parentFragment.param||null);
        currentViewObj.setParent(parentViewObj);
      }

      // Now update the current view and switch to it
      currentViewObj.setSegment(currentFragment.segment||null);
      currentViewObj.setParam(currentFragment.param||null);//TODO check falsy strings?
      this.__setView(currentViewObj, layerTransition);
      var mode=this.getDisplayMode();
      if(mode=='modal'){
        unify.view.PopOverManager.getInstance().show(this.getId());
      }
      // Save path
      this.__path = path;
      this.fireDataEvent("changePath", this.__path);
    },
    
    
    
    /*
    ---------------------------------------------------------------------------
      NAVIGATION RELATED EVENT HANDLERS
    ---------------------------------------------------------------------------
    */
    
    /** {Boolean} Whether the app is following a link */
    __navigates : false,

    /** {String} CSS selector with elements which are followable by the navigation manager */
    __followable : "a[href],[rel],[goto],[exec],[show],[hide]",


    /**
     * Modifies click handling to include the context of the current view
     *
     * @param e {qx.event.type.Touch} Touch event
     */
    _onTap : function(e)
    {
      // Redirct to tapHelper from MNavigatable
      this._tapHelper(e);
    },




    /*
    ---------------------------------------------------------------------------
      PRESSED STYLE EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Executed on every touch hold event
     *
     * @param e {qx.event.type.Touch} Touch event
     */
    _onTouchHold : function(e)
    {
      return; //TODO
      
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element.Class.add(elem, "pressed");
      }
    },


    /**
     * Executed on every touch release event
     *
     * @param e {qx.event.type.Touch} Touch event
     */
    _onTouchRelease : function(e)
    {
      return; //TODO
      
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element.Class.remove(elem, "pressed");
      }
    },
    
    /**
     * Shows the view
     */
    show : function() {
      this._getWidgetElement().show();
    },
    
    /**
     * Hides the view
     */
    hide : function() {
      this._getWidgetElement().hide();
    },
    
    /*
    ---------------------------------------------------------------------------
      VIEW MANAGMENT
    ---------------------------------------------------------------------------
    */

    /** {Map} A map with all keys (by ID) */
    __views : null,

    /** {String} ID of default view */
    __defaultViewId : null,

    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     * @param isDefault {Boolean?false} Whether the added view functions as the default view for this manager.
     */
    add : function(viewClass, isDefault)
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!viewClass) {
          throw new Error("Invalid view class to add(): " + viewClass);
        }
      }
      var instance=viewClass.getInstance();
      var instanceManager=instance.getManager();
      if(instanceManager!=null){
        throw new Error('view is already managed!: '+viewClass+' manager:  '+instanceManager.getId());
      }
      instance.setManager(this);
      var id = qx.lang.String.hyphenate(viewClass.basename).substring(1).toLowerCase();
      if (isDefault) {
        this.__defaultViewId = id;
      }

      this.__views[id] = viewClass;
    },
    
    /**
     * Returns the view instance stored behind the given ID.
     *
     * @param id {String} Identifier of the view.
     * @return {unify.view.Abstract} Instance derived from the StaticView class.
     */
    getView : function(id) {
      return id && this.__views[id] || null;
    },
    
    /**
     * {Map} Maps the position of the layer to the platform specific transform value.
     */
    __positions : qx.core.Environment.select("unify.positionshift",
    {
      "3d" :
      {
        bottom : "translate3d(0,100%,0)",
        right : "translate3d(100%,0,0)",
        left : "translate3d(-100%,0,0)",
        center : "translate3d(0,0,0)"
      },

      "2d" :
      {
        bottom : "translate(0,100%)",
        right : "translate(100%,0)",
        left : "translate(-100%,0)",
        center : "translate(0,0)"
      }
    }),
    
    /**
     * Internal setter method for view switching
     *
     * @param view {unify.view.StaticView} View instance to switch to
     * @param transition {String?null} Transition name
     */
    __setView : function(view, transition)
    {
      // TODO: view.getElement() is also called if view is in popover
      //       Maybe it should be rendered lazy
      var oldView = this.__currentView;
      if (view == oldView) {
        return;
      }

      if (oldView) 
      {
        oldView.resetActive();
      }
      
      // Store current view
      this.__currentView = view;


      // Resuming the view
      view.setActive(true);

      // Cache element/view references
      var currentViewElement = view;// && view.getElement();
      var oldViewElement = oldView;// && oldView.getElement();

      // Insert target layer into DOM
      var elem=this._getWidgetElement();//use getElement is important, __element might not be initialized here
      if (elem.indexOf(view) == -1 /*true || currentViewElement.parentNode != elem*/) {
        elem.add(view, {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        });
      }

      // Transition specific layer switch
      var positions = this.__positions;

      if (transition == "in" || transition == "out")
      {
        this.__animateLayers(view, oldView, transition);
      } else {
        if (oldView) {
          oldView.setVisibility("hidden");
        }
        if (view) {
          view.setVisibility("visible");
        }
      }

      // Fire appear/disappear events
      if (oldView) {
        oldView.fireEvent("disappear");
      }

      if (view) {
        view.fireEvent("appear");
      }
      this.fireEvent("changeView");
    },
    
    __animateLayers : function(toView, fromView, direction) {
      var self = this;
      var AnimationDuration = qx.theme.manager.Appearance.getInstance().styleFrom("view").WebkitTransitionDuration;
      
      direction = direction || "in";
      
      toView.setStyle({
        "webkitTransitionDuration": "0ms",
        "webkitTransform": (direction == "in") ? this.__positions.right : this.__positions.left
      });
      
      fromView.setStyle({
        "webkitTransitionDuration": "0ms",
        "webkitTransform": this.__positions.center
      });
      
      var visibilityAction = function() {
        // Force rendering
        var toViewElement = toView.getElement();
        toViewElement.offsetWidth + toViewElement.offsetHeight;
        
        var fromViewElement = fromView.getElement();
        var transitionEndFnt = function() {
          qx.bom.Event.removeNativeListener(fromViewElement, "webkitTransitionEnd", transitionEndFnt);
          fromView.setVisibility("hidden");
        };
        qx.bom.Event.addNativeListener(fromViewElement, "webkitTransitionEnd", transitionEndFnt);
        
        toView.setStyle({
          "webkitTransitionDuration" : AnimationDuration,
          "webkitTransform": self.__positions.center
        });
        fromView.setStyle({
          "webkitTransitionDuration" : AnimationDuration,
          "webkitTransform": (direction == "in") ? self.__positions.left : self.__positions.right
        });
      };
      
      if (toView.getVisibility() != "visible") {
        toView.addListenerOnce("changeVisibility", visibilityAction);
        
        toView.setVisibility("visible");
      } else {
        visibilityAction();
      }
    }
  }
});