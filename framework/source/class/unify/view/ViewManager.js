/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * This class manage other classes which extend from {@link StaticView}.
 */
qx.Class.define("unify.view.ViewManager",
{
  extend : qx.core.Object,


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

    if (qx.core.Variant.isSet("qx.debug", "on"))
    {
      if (managerId == null) {
        throw new Error("Invalid manager ID: " + managerId);
      }
    }

    // Store manager ID
    this.__managerId = managerId;
    
    // Add to registry
    var registry = unify.view.ViewManager.__managers;
    if (qx.core.Variant.isSet("qx.debug", "on"))
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
      if (qx.core.Variant.isSet("qx.debug", "on"))
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
    changePath : "qx.event.type.Data"
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
     * Whether this view manager's view controller is displayed standalone e.g. 
     * the master view manager is not visible at the moment 
     */
    standalone :
    {
      check : "Boolean",
      init : false,
      apply : "_applyStandalone"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      MANAGER CORE
    ---------------------------------------------------------------------------
    */

    /** {String} ID of this manager */
    __managerId : null,

    /** {Element} Root element used for all views of this manager */
    __element : null,

    /** {unify.view.Path} Path object (covering only manager local path) */
    __path : null,

    /** {Boolean} Whether the view manager is correctly initialized */
    __initialized : false,


    /**
     * Returns whether the DOM element is created.
     *
     * @return {Boolean} Whether the DOM element is created
     */
    isCreated : function() {
      return !!this.__element;
    },


    /**
     * Returns the root element of the view manager (this is used as
     * a parent element for all added view instances)
     *
     * @return {Element} DOM element of view manager
     */
    getElement : function() 
    {
      var elem = this.__element;
      if (!elem)
      {
        // Create root element of manager (used as parent for view elements)
        elem = this.__element = document.createElement("div");
        elem.className = "view-manager";
        elem.id = this.__managerId;

        // Register to navigation events
        qx.event.Registration.addListener(elem, "click", this.__onClick, this);
        qx.event.Registration.addListener(elem, "tap", this.__onTap, this);
        qx.event.Registration.addListener(elem, "touchhold", this.__onTouchHold, this);
        qx.event.Registration.addListener(elem, "touchrelease", this.__onTouchRelease, this);      
      }
      
      return elem;
    },


    /**
     * Returns the ID of the view manager
     *
     * @return {String} The ID
     */
    getId : function() {
      return this.__managerId;
    },


    /**
     * Returns the local path of the view manager
     *
     * @return {Map[]} List of dictonaries (with keys view, segment and param)
     */
    getPath : function() {
      return this.__path;
    },




    /*
    ---------------------------------------------------------------------------
      INITIALIZATION / RESET
    ---------------------------------------------------------------------------
    */

    /**
     * Initializes the manager and selects the default view if no other
     * view was yet set.
     */
    init : function()
    {
      if (!this.__initialized)
      {
        // First set flag to true to omit recursions
        this.__initialized = true;

        // But only reset here if there is no other path set already
        if (!this.__path) {
          this.__resetHelper();
        }
      }
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
      if (path.length == 1 && path[0].view == defaultViewId) {
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
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (defaultViewId == null) {
          throw new Error("Missing default view ID!");
        }
      }
      
      var viewObj = this.__views[defaultViewId].getInstance();
      viewObj.setManager(this);
      this.__path = new unify.view.Path({
        view : defaultViewId,
        segment : viewObj.getDefaultSegment(),
        param : null
      });

      viewObj.setSegment(viewObj.getDefaultSegment());
      viewObj.resetParam();
      this.__setView(viewObj);

      this.fireDataEvent("changePath", self.__path);
    },
    
    
    
    
    /*
    ---------------------------------------------------------------------------
      MASTER MANAGMENT
    ---------------------------------------------------------------------------
    */
        
    // property apply
    _applyStandalone : function(value, old)
    {
      var view = this.__view;
      if (view) 
      {
        var master = this.getMaster();
        value && master ? view.setMaster(master) : view.resetMaster();
      }
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
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewClass) {
          throw new Error("Invalid view class to add(): " + viewClass);
        }
      }
      
      var id = qx.lang.String.hyphenate(viewClass.basename).substring(1);
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
     * Whether the given view ID is controlled by this manager.
     *
     * @param id {String} Identifier of the view.
     * @return {Boolean} <code>true</code> when the view is controlled by this manager.
     */
    hasView : function(id) {
      return id && !!this.__views[id];
    },


    /**
     * Returns default view id (first added view)
     *
     * @return {String} ID of default view
     */
    getDefaultViewId : function() {
      return this.__defaultViewId;
    },


    /**
     * Navigates to the given path
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!(path instanceof unify.view.Path)) {
          throw new Error("Invalid path to navigate() to: " + path);
        }
      }
      
      var length = path.length;
      if (length == 0) 
      {
        this.warn("Empty path!");
        return;
      }
      
      var oldPath = this.__path;
      var oldLength = oldPath ? oldPath.length : 0;
      var layerTransition = null;

      // Detect transition
      if (oldLength > 0)
      {
        if (length > oldLength) {
          layerTransition = "in";
        } else if (length < oldLength) {
          layerTransition = "out";
        }
      }

      // Find current view object
      var views = this.__views;
      var currentFragment = path[length-1];
      var currentViewCls = views[currentFragment.view || this.__view.getId()];
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!currentViewCls) {
          throw new Error("Invalid view: " + currentFragment.view + " in view manager " + this.getId());
        }
      }
      
      var currentViewObj = currentViewCls.getInstance();
      currentViewObj.setManager(this);

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
        parentViewObj.setManager(this);
        parentViewObj.setSegment(parentFragment.segment);
        parentViewObj.setParam(parentFragment.param);
        currentViewObj.setParent(parentViewObj);
      }

      // Now update the current view and switch to it
      currentViewObj.setSegment(currentFragment.segment);
      currentViewObj.setParam(currentFragment.param);
      this.__setView(currentViewObj, layerTransition);

      // Save path
      this.__path = path;
      this.fireDataEvent("changePath", this.__path);
    },






    /*
    ---------------------------------------------------------------------------
      VISIBILITY HANDLING
    ---------------------------------------------------------------------------
    */
    
    /**
     * Hides the view manager and pauses active view
     */
    hide : function()
    {
      var elem = this.__element;
      if (elem) {
        elem.style.display = "none";
      }

      var view = this.__view;
      if (view) {
        view.setActive(false);
      }
    },
    
    
    /**
     * Shows the view manager and resumes selected view
     */
    show : function()
    {
      var elem = this.getElement();
      elem.style.display = "";
      
      this.init();
      var view = this.__view;
      if (view) {
        view.setActive(true);
      }
    },



    /*
    ---------------------------------------------------------------------------
      NAVIGATION RELATED EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether the app is following a link */
    __navigates : false,

    /** {String} CSS selector with elements which are followable by the navigation manager */
    __followable : "a[href],[rel],[goto],[exec],[show]",

    /**
     * Prevents clicks from executing native behavior
     *
     * @param e {qx.event.type.Mouse} Mouse event object
     */
    __onClick : function(e)
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), "a[href]");
      if (elem) {
        e.preventDefault();
      }
    },


    /**
     * Modifies click handling to include the context of the current view
     *
     * @param e {qx.event.type.Touch} Touch event
     */
    __onTap : function(e)
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem)
      {
        // Stop further event processing
        e.stopPropagation();

        // Support executing public function on currently selected view
        var exec = elem.getAttribute("exec");
        if (exec)
        {
          this.__view[exec]();
        }
        else
        {
          // Detect absolute links
          var href = elem.getAttribute("href");
          if (href != null && href != "" && href.charAt(0) != "#") {
            window.open(href);
          }

          // Lazily navigate (omits navigation during activity)
          else if (!this.__navigates)
          {
            this.__navigates = true;
            qx.lang.Function.delay(this.__onTapNavigate, 0, this, elem);
          }
        }
      }
    },


    /**
     * Used for lazy execution of tap event
     *
     * @param elem {Element} Element which was tapped onto
     */
    __onTapNavigate : function(elem)
    {
      // Reset event blocking flag
      this.__navigates = false;

      // Check up-navigation request first
      var rel = elem.getAttribute("rel");
      if (rel == "parent" || rel == "close") 
      {
        if(this.__path.length == 1) {
          this.hide();
        } else {
          this.navigate(this.__path.slice(0, -1));
        }

        return;
      }
      
      // Support auto popup of master view manager
      if (rel == "master")
      {
        var masterViewManager = this.getMaster();
        if (!masterViewManager) {
          throw new Error("There is no master view manager!");
        }
        
        unify.view.PopOverManager.getInstance().show(masterViewManager.getId());
        return;
      }
      
      // Support for showing another view manager (without a specific view e.g. a pop over)
      var show = elem.getAttribute("show");
      if (show != null)
      {
        // TODO: Are there other kinds of view managers which might be shown here (not just popups)?
        unify.view.PopOverManager.getInstance().show(show);
        return;
      }

      // Read attributes
      var href = elem.getAttribute("href");
      var dest = href ? href.substring(1) : elem.getAttribute("goto");
      if (dest == null) {
        throw new Error("Empty destination found!");
      }

      // Valid Paths (leading with a "#" in href attributes):
      // localView.segment:param (in transition)
      // otherView.segment:param (globally known view => delegate to navigation)
      // .segment:param (switch segment and param, no transition)
      // .segment (switch segment, no transition)
      // :param (switch param, no transition)

      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (rel) {
          throw new Error("Invalid 'rel' attribute: " + rel);
        }
      }
      
      var config = unify.view.Path.parseFragment(dest);
      var view = config.view;
      if (view && !this.__views[view])
      {
        unify.view.Navigation.getInstance().navigate(new unify.view.Path(config));
      }
      else
      {
        // Read current path and make non-deep copy of path
        var path = this.__path;
        var clone = path.concat();
        var cloneLast = clone.length-1;
        
        // Select right modification point
        if (rel == "same") 
        {
          clone[cloneLast] = config;
        } 
        else if (config.view) 
        {
          clone.push(config);
        } 
        else 
        {
          if (config.segment) {
            clone[cloneLast].segment = config.segment;
          }

          if (config.param) {
            clone[cloneLast].param = config.param;
          }
        }

        // Finally do the navigate()
        this.navigate(clone);
      }
    },




    /*
    ---------------------------------------------------------------------------
      PRESSED STYLE EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Executed on every touch hold event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchHold : function(e)
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element2.Class.add(elem, "pressed");
      }
    },


    /**
     * Executed on every touch release event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchRelease : function(e)
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element2.Class.remove(elem, "pressed");
      }
    },




    /*
    ---------------------------------------------------------------------------
      LAYER LOGIC / ANIMATION
    ---------------------------------------------------------------------------
    */

    /** {unify.view.StaticView} Current view */
    __view : null,

    /**
     * {Map} Maps the position of the layer to the platform specific transform value.
     */
    __positions : qx.core.Variant.select("unify.postitionshift",
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
      var oldView = this.__view;
      if (view == oldView) {
        return;
      }

      if (oldView) {
        oldView.resetActive();
      }

      // Store current view
      this.__view = view;

      // Resuming the view
      view.setActive(true);

      // Cache element/view references
      var currentViewElement = view && view.getElement();
      var oldViewElement = oldView && oldView.getElement();

      // Insert target layer into DOM
      if (currentViewElement.parentNode != this.__element) {
        this.__element.appendChild(currentViewElement);
      }

      // Transition specific layer switch
      var positions = this.__positions;

      if (transition == "in")
      {
        if (view.isModal())
        {
          this.__animateLayer(currentViewElement, positions.bottom, positions.center, true, oldViewElement);
        }
        else
        {
          this.__animateLayer(currentViewElement, positions.right, positions.center, true);
          this.__animateLayer(oldViewElement, positions.center, positions.left, false);
        }
      }
      else if (transition == "out")
      {
        if (oldView.isModal())
        {
          this.__animateLayer(oldViewElement, positions.center, positions.bottom, false, currentViewElement);
        }
        else
        {
          this.__animateLayer(currentViewElement, positions.left, positions.center, true);
          this.__animateLayer(oldViewElement, positions.center, positions.right, false);
        }
      }
      else
      {
        if (oldViewElement) {
          qx.bom.element2.Class.remove(oldViewElement, "current");
        }

        if (currentViewElement) {
          qx.bom.element2.Class.add(currentViewElement, "current");
        }
      }

      // Fire appear/disappear events
      if (oldView) {
        oldView.fireEvent("disappear");
      }

      if (view) {
        view.fireEvent("appear");
      }
    },


    /**
     * Animates a layer property
     *
     * @param target {Element} DOM element of layer
     * @param from {var} Start value
     * @param to {var} End value
     * @param current {Boolean?false} Whether this layer is the current layer (read: new layer)
     * @param other {Element} DOM element of other layer (previous/next).
     */
    __animateLayer : function(target, from, to, current, other)
    {
      var targetStyle = target.style;

      // Normalize cross-browser differences
      var transformProperty = qx.bom.element2.Style.property("transform");
      var durationProperty = qx.bom.element2.Style.property("transitionDuration");

      // Method to cleanup after transition
      var cleanup = function()
      {
        // Disable transition again
        targetStyle[durationProperty] = "0ms";

        // Remove listener
        qx.event.Registration.removeListener(target, "transitionEnd", cleanup, this);

        // Hide the other layer when this is the current one
        // Otherwise hide this layer when not the current one
        if (current && other)
        {
          qx.bom.element2.Class.remove(other, "current");
        }

        // Make completely invisible if not current layer
        else if (!current)
        {
          qx.bom.element2.Class.remove(target, "current");
        }

        // Revert modifications
        targetStyle.zIndex = "";
        targetStyle[transformProperty] = "";
      };

      // React on transition end
      qx.event.Registration.addListener(target, "transitionEnd", cleanup, this);

      // Move to top, disable transition and hard switch to initial value
      targetStyle.zIndex = 1000;
      targetStyle[durationProperty] = "0ms";
      targetStyle[transformProperty] = from;

      // Initial display when current layer
      if (current)
      {
        qx.bom.element2.Class.add(target, "current");

        // Force rendering
        target.offsetWidth + target.offsetHeight;
      }

      // Or show other layer when not the current one
      else if (other)
      {
        qx.bom.element2.Class.add(other, "current");
      }

      // Enable transition and slide to target value
      targetStyle[durationProperty] = "";
      targetStyle[transformProperty] = to;
    }
  }
});
