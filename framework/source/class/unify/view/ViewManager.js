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
      apply: "_applyDisplayMode",
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
        elem=this._createElement();
      }
      return elem;
    },
    
    /**
     * creates the root element of the view manager
     */
    _createElement: function(){
      // Create root element of manager (used as parent for view elements)
      var elem = this.__element = document.createElement("div");
      var Class = qx.bom.element.Class;
      Class.add(elem,"view-manager");
      Class.add(elem,"display-mode-"+this.getDisplayMode());
      elem.id = this.__managerId;
      // Register to navigation events
      qx.event.Registration.addListener(elem, "click", this.__onClick, this);
      qx.event.Registration.addListener(elem, "utap", this.__onTap, this);
      qx.event.Registration.addListener(elem, "utouchhold", this.__onTouchHold, this);
      qx.event.Registration.addListener(elem, "utouchrelease", this.__onTouchRelease, this);
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
    
    
    /**
     * Returns the currently selected view instance
     *
     * @return {unify.view.StaticView} View instance which is currently selected
     */
    getCurrentView : function() {
      return this.__currentView;
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
        if (!this.__path && this.getDisplayMode()!='modal') {
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
        if (defaultViewId == null) {
          throw new Error("Missing default view ID!");
        }
      }
      
      var viewObj = this.__views[defaultViewId].getInstance();

      this.__path = new unify.view.Path({
        view : defaultViewId,
        segment : viewObj.getDefaultSegment(),
        param : null
      });

      viewObj.setSegment(viewObj.getDefaultSegment());
      viewObj.resetParam();
      this.__setView(viewObj);
      this.fireDataEvent("changePath", this.__path);
    },

    _applyDisplayMode : function(value,old){
      var elem = this.__element;
      if(elem){
        var Class = qx.bom.element.Class;
        Class.remove(elem,"display-mode-"+old);
        Class.add(elem,"display-mode-"+value);
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
      if (qx.core.Environment.get("qx.debug"))
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

        parentViewObj.setSegment(parentFragment.segment);
        parentViewObj.setParam(parentFragment.param);
        currentViewObj.setParent(parentViewObj);
      }

      // Now update the current view and switch to it
      currentViewObj.setSegment(currentFragment.segment);
      currentViewObj.setParam(currentFragment.param);
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
      VISIBILITY HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Hides the view manager and pauses active view
     *
     * @param callback {Function} optional callback to execute after hidianimationng is done
     */
    hide : function(callback)
    {
      var elem = this.__element;

      if (!elem) {
        return;//nothing to hide
      }

      var view = this.__currentView;
      if (view) {
        view.setActive(false);
      }
      var mode=this.getDisplayMode();
      if(mode=='modal'){
        this.__path=null;
        this.__currentView=null;
        this.fireDataEvent("changePath", this.__path);
        var pos=this.__positions;
        this.__animateModal(view.getElement(),pos.center,pos.bottom,false,callback);
      } else {
        elem.style.display='none';
        if(callback){
          callback();
        }
      }
    },


    /**
     * Shows the view manager and resumes selected view
     */
    show : function()
    {
      var mode=this.getDisplayMode();
      var elem = this.getElement();

      // Be sure that we show a view (if possible)
      this.init();

      // Re-activate view (normally only useful if it was paused before)
      var view = this.__currentView;
      this.debug("Show with: " + view);
      if (view) {
        view.setActive(true);
      }

      if(mode=='modal'){
        var pos=this.__positions;
        this.__animateModal(view.getElement(),pos.bottom,pos.center,true);
      } else {
         elem.style.display = mode=='default'?"":"block";
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
    __followable : "a[href],[rel],[goto],[exec],[show],[hide]",

    /**
     * Prevents clicks from executing native behavior
     *
     * @param e {qx.event.type.Mouse} Mouse event object
     */
    __onClick : function(e)
    {
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), "a[href]");
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
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem &&!elem.getAttribute('disabled'))
      {
        // Stop further event processing
        e.stopPropagation();

        // Support executing public function on currently selected view
        var exec = elem.getAttribute("exec");
        if (exec)
        {
          this.__currentView[exec](elem);
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
          if(this.getDisplayMode()=='default'){
            this.hide();
          } else {
            unify.view.PopOverManager.getInstance().hide(this.getId());
          }
        } else {
          this.navigate(this.__path.slice(0, -1));
        }
        return;
      }
      
      // Support for showing/hiding another view manager (without a specific view e.g. a pop over)
      // TODO: Are there other kinds of view managers which might be shown here (not just popups)?
      var show = elem.getAttribute("show");
      if (show != null)
      {
        unify.view.PopOverManager.getInstance().show(show);
        return;
      }

      var hide = elem.getAttribute("hide");
      if (hide != null)
      {
        unify.view.PopOverManager.getInstance().hide(hide);
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

      if (qx.core.Environment.get("qx.debug"))
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
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element.Class.add(elem, "pressed");
      }
    },


    /**
     * Executed on every touch release event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchRelease : function(e)
    {
      var elem = unify.bom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element.Class.remove(elem, "pressed");
      }
    },




    /*
    ---------------------------------------------------------------------------
      LAYER LOGIC / ANIMATION
    ---------------------------------------------------------------------------
    */

    /** {unify.view.StaticView} Current view */
    __currentView : null,

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
      var currentViewElement = view && view.getElement();
      var oldViewElement = oldView && oldView.getElement();

      // Insert target layer into DOM
      var elem=this.getElement();//use getElement is important, __element might not be initialized here
      if (currentViewElement.parentNode != elem) {
        elem.appendChild(currentViewElement);
      }

      // Transition specific layer switch
      var positions = this.__positions;

      if (transition == "in")
      {
        this.__animateLayer(currentViewElement, positions.right, positions.center, true);
        this.__animateLayer(oldViewElement, positions.center, positions.left, false);
      }
      else if (transition == "out")
      {
        this.__animateLayer(currentViewElement, positions.left, positions.center, true);
        this.__animateLayer(oldViewElement, positions.center, positions.right, false);
      }
      else
      {
        if (oldViewElement) {
          qx.bom.element.Class.remove(oldViewElement, "current");
        }

        if (currentViewElement) {
          qx.bom.element.Class.add(currentViewElement, "current");
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
      var transformProperty = qx.bom.element.Style.property("transform");
      var durationProperty = qx.bom.element.Style.property("transitionDuration");

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
          qx.bom.element.Class.remove(other, "current");
        }

        // Make completely invisible if not current layer
        else if (!current)
        {
          qx.bom.element.Class.remove(target, "current");
        }

        // Revert modifications
        targetStyle[transformProperty] = "";
      };

      // React on transition end
      qx.event.Registration.addListener(target, "transitionEnd", cleanup, this);

      //disable transition and hard switch to initial value
      targetStyle[durationProperty] = "0ms";
      targetStyle[transformProperty] = from;

      // Initial display when current layer
      if (current)
      {
        qx.bom.element.Class.add(target, "current");

        // Force rendering
        target.offsetWidth + target.offsetHeight;
      }

      // Or show other layer when not the current one
      else if (other)
      {
        qx.bom.element.Class.add(other, "current");
      }

      // Enable transition and slide to target value
      targetStyle[durationProperty] = "";
      targetStyle[transformProperty] = to;
    },

    /**
     * Animates a layer property in display-mode modal
     *
     * //TODO show animation sometimes has an ugly flick. Investigate further and fix it
     *
     * @param target {Element} DOM element of layer
     * @param from {var} Start value
     * @param to {var} End value
     * @param current {Boolean?false} Whether this layer is the current layer (read: new layer)
     * @param callback {Function} optional callback to execute after animation
     */
    __animateModal: function(target,from,to,current,callback){
      var targetStyle = target.style;
      var managerStyle=this.__element.style;
      // Normalize cross-browser differences
      var transformProperty = qx.bom.element.Style.property("transform");
      var durationProperty = qx.bom.element.Style.property("transitionDuration");

      // Method to cleanup after transition
      var cleanup = function()
      {
        if(!current){
          qx.bom.element.Class.remove(target, "current");
        }
        // Remove listener
        qx.event.Registration.removeListener(target, "transitionEnd", cleanup, this);

        // Disable transition again
        targetStyle[durationProperty] = "0ms";

        // Revert modifications
        targetStyle[transformProperty] = "";

        if(callback){
          callback();
        }

      };

      // React on transition end
      qx.event.Registration.addListener(target, "transitionEnd", cleanup, this);

      // disable transition and hard switch to initial value
      targetStyle[durationProperty] = "0ms";
      targetStyle[transformProperty] = from;

      if(current){
        managerStyle.display='block';
      }
      // Force rendering
      target.offsetWidth + target.offsetHeight;

      // Enable transition and slide to target value
      targetStyle[durationProperty] = "";
      targetStyle[transformProperty] = to;

      if(current){
        qx.bom.element.Class.add(target, "current");
      }
   }
  }
});
