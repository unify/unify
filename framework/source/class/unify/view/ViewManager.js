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
    this.debug("Initializing: " + this.__managerId);
    
    // Create root element of manager (used as parent for view elements)
    var elem = this.__element = document.createElement("div");
    elem.className = "view-manager";
    elem.id = managerId;

    // Register to navigation events
    qx.event.Registration.addListener(elem, "click", this.__onClick, this);
    qx.event.Registration.addListener(elem, "tap", this.__onTap, this);
    qx.event.Registration.addListener(elem, "touchhold", this.__onTouchHold, this);
    qx.event.Registration.addListener(elem, "touchrelease", this.__onTouchRelease, this);

    // Create instance specific data structures
    this.__views = {};
    this.__deep = {};
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** 
     * Whether switching into views of other view managers means restoring the complete
     * position there. This basically stores the navigation path before switching and 
     * restores it when switching back to the same view.
     */
    enableDeepSwitch :
    {
      check : "Boolean",
      init : false
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
    changePath : "qx.event.type.Event"
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
    
    /** {Map[]} List of maps storing the local path (keys: view, segment, param) */
    __path : null,
    
    /** {Boolean} Whether the view manager is correctly initialized */
    __initialized : false,
    
    
    /**
     * Returns the root element of the view manager (this is used as
     * a parent element for all added view instances)
     * 
     * @return {Element} DOM element of view manager
     */
    getElement : function() {
      return this.__element;
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
      var viewObj = this.__views[defaultViewId].getInstance();
      this.__path = [{
        view : defaultViewId,
        segment : viewObj.getDefaultSegment(),
        param : null
      }];      

      viewObj.setSegment(viewObj.getDefaultSegment());
      viewObj.resetParam();
      this.__setView(viewObj);

      this.fireEvent("changePath");      
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

    /** {Map} Used for storage of deep path for children e.g. used in switching of tab views */
    __deep : null,

    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     */
    add : function(viewClass, isDefault)
    {
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
    getById : function(id) {
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
     * Go to an absolute path in this view manager with the option to
     * delegate structure to other view managers if specific views are
     * not known locally
     * 
     * @param path {Map[]} Array of path fragment configs (keys: view, segment, param)
     */
    go : function(path)
    {
      var views = this.__views;
      var delegatePath = [];
      var fragment, viewClass, viewObj, lastViewObj;
      for (var i=path.length-1; i>=0; i--)
      {
        fragment = path[i];
        viewClass = views[fragment.view];
        
        if (viewClass)
        {
          viewObj = viewClass.getInstance();
          viewObj.setSegment(fragment.segment);
          viewObj.setParam(fragment.param);
          
          // Only process last two items
          if (lastViewObj) 
          {
            lastViewObj.setParent(viewObj);
            break;
          }
          
          lastViewObj = viewObj;
        }
        else
        {
          // Move fragment from local path into delegation
          delegatePath.unshift(path.pop());
        }
      }
      
      // Switch to last view in path
      if (lastViewObj) {
        this.__setView(lastViewObj);
      }

      // Store path and fire change event
      this.__path = path;
      this.fireEvent("changePath");
      
      // Delegate remaining path fragments
      if (delegatePath.length > 0)
      {
        this.debug("Delegating " + delegatePath.length + " fragments to other view managers...");
        // TODO
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
    __followable : "a[href],[rel],[goto],[exec]",

    /**
     * Prevents clicks from executing native behavior
     * 
     * @parm e {qx.event.type.Mouse} Mouse event object
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
      var href = elem.getAttribute("href");
      var rel = elem.getAttribute("rel");

      var dest = href ? href.substring(1) : elem.getAttribute("goto");
      var config = unify.view.Path.parseFragment(dest);

      var view = config.view;
      var segment = config.segment;
      var param = config.param;

      var viewClass = this.__views[view];
      var currentViewObj = this.__view;
      var path = this.__path;

      var firePathChange = false;
      
      if (rel == "param") 
      {
        // Replace param in path
        path[path.length-1].param = param;
        firePathChange = true;
        
        currentViewObj.setParam(param);
      } 
      else if (rel == "segment") 
      {
        // Replace segment in path
        path[path.length-1].segment = segment;
        firePathChange = true;

        currentViewObj.setSegment(segment);
      }
      else if (rel == "up")
      {
        // Replace current view with its parent (slide out)
        // Parent should still be correctly configured (segment, param) in this case.
        var parentViewObj = currentViewObj.getParent();
        if (!parentViewObj) {
          throw new Error("Has no parent!");
        }

        // Reduce path
        var last = path.pop();
        firePathChange = true;
        
        // Finally do the switching
        this.__setView(parentViewObj, "out");

        // TODO: Handle this on animation stop! Via timeout?
        // Reconfigure 
        // Fix cases of tweet:123 => user => tweet:456 (then the parent parent tweet has wrong config when going up)
        var lastView = last.view;
        for (var i=path.length-1; i>=0; i--)
        {
          if (path[i].view == lastView)
          {
            this.debug("Reconfigure after loosing last");
            currentViewObj.setSegment(path[i].segment);
            currentViewObj.setParam(path[i].param);
            
            if (i == 0) {
              currentViewObj.resetParent();
            } else {
              currentViewObj.setParent(this.__views[path[i-1]].getInstance());
            }
            
            break;
          }
        }
      }
      else if (rel == "parent")
      {
        // Replace current view with view in the same view manager
        
        if (!viewClass) {
          throw new Error("Could not replace current view with view from another view manager: " + view);
        }
        
        path[path.length-1] = config;
        firePathChange = true;
        
        var viewObj = viewClass.getInstance();
        viewObj.setSegment(segment);
        viewObj.setParam(param);
        viewObj.setParent(currentViewObj.getParent());
        
        this.__setView(viewObj);
      }
      else if (viewClass)
      {
        // Dive into view in the same view manager (slide in)
        
        path.push(config);
        firePathChange = true;
        
        var viewObj = viewClass.getInstance();
        viewObj.setSegment(segment);
        viewObj.setParam(param);
        viewObj.setParent(currentViewObj);

        // Somehow a developer fault when giving no "rel" attribute, but
        // still "switching" to the same view (which would better called a reconfiguration)
        if (viewObj != currentViewObj)
        {
          this.__setView(viewObj, "in");
        }
      }
      else
      {
        var childViewManager = unify.view.Navigation.getInstance().getViewManager(view);
        if (childViewManager == null) {
          throw new Error("Could not find view manager for view: " + view);
        }
        
        if (this.getEnableDeepSwitch() && this.__deep[dest]) {
          childViewManager.go(this.__deep[dest]);
        } else {
          childViewManager.go([config]);
        }
      }
      
      if (firePathChange) {
        this.fireEvent("changePath");
      }
      
      // Reset event blocking flag
      this.__navigates = false;
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
