/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class manage other classes which extend from {@link StaticView}.
 */
qx.Class.define("unify.view.mobile.ViewManager",
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
    
    var elem = this.__element = document.createElement("div");
    elem.className = "view-manager";
    elem.id = managerId;

    qx.event.Registration.addListener(elem, "click", this.__onClick, this);
    qx.event.Registration.addListener(elem, "tap", this.__onTap, this);
    qx.event.Registration.addListener(elem, "touchhold", this.__onTouchHold, this);
    qx.event.Registration.addListener(elem, "touchrelease", this.__onTouchRelease, this);

    this.__id = managerId;
    this.debug("Initialize View Manager: " + this.__id);

    // Data structure for managed views
    this.__views = {};
    
    this.__path = [];
  },



  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** The active view */
    view :
    {
      check : "unify.view.mobile.StaticView",
      nullable : true,
      apply : "_applyView",
      event : "changeView"
    },
    
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
  
  
  
  
  events :
  {
    changePath : "qx.event.type.Event"
    
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** {Map} A map with all keys (by ID) */
    __views : null,

    __defaultView : null,

    __id : null,
    
    __element : null,
    


    /*
    ---------------------------------------------------------------------------
      VIEW MANAGMENT
    ---------------------------------------------------------------------------
    */

    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     */
    add : function(viewClass, isDefault)
    {
      var id = qx.lang.String.hyphenate(viewClass.basename).substring(1);
      this.debug("Adding view: " + id);
      
      if (isDefault) {
        this.__defaultView = id;
      }

      this.__views[id] = viewClass;
    },
    
    
    getElement : function() {
      return this.__element;
    },
    
    
    getId : function() {
      return this.__id;
    },
    

    init : function()
    {
      if (this.__defaultView && !this.getView()) 
      {
        var viewId = this.__defaultView;
        
        this.debug("Switch to defaultView: " + viewId);
        
        this.__path.push({
          view : viewId
        });
        this.setView(this.__views[viewId].getInstance());
        
        this.fireEvent("changePath");
      }
    },



    /**
     * Returns the view instance stored behind the given ID.
     *
     * @param id {String} Identifier of the view.
     * @return {unify.view.mobile.Abstract} Instance derived from the StaticView class.
     */
    getById : function(id) {
      return id && this.__views[id] || null;
    },
    
    
    hasView : function(id) {
      return id && !!this.__views[id];
    },


    /**
     * Returns default view id (first added view)
     *
     * @return {String} ID of default view
     */
    getDefaultView : function() {
      return this.__defaultView;
    },
    
    


    getPath : function() {
      return this.__path;
    },
    
    
    __path : null,
    __deep : null,
    __transition : null,
    
    
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
        this.setView(lastViewObj);
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
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether the app is following a link */
    __following : null,


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
      if (this.__following)
      {
        this.warn("Still following!");
        return;
      }

      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem)
      {
        // Stop further event processing
        e.stopPropagation();
        
        // Analyse element and process further
        var exec = elem.getAttribute("exec");
        if (exec) 
        {
          // Support executing public function on currently selected view
          this.getView()[exec]();
        }
        else
        {
          var href = elem.getAttribute("href");
          if (href != null && href != "" && href.charAt(0) != "#")
          {
            // Absolute link
            window.open(href);
          }
          else
          {
            // Lazy further processing
            this.__following = true;
            qx.lang.Function.delay(this.__onTapFollow, 0, this, elem);
          }
        }
      }
    },
    
    
    /**
     * Used for lazy execution of tap event
     *
     * @param elem {Element} Element which was tapped onto
     */
    __onTapFollow : function(elem)
    {
      var href = elem.getAttribute("href");
      var rel = elem.getAttribute("rel");

      var dest = href ? href.substring(1) : elem.getAttribute("goto");
      this.debug("Destination: " + dest);
      
      var config = unify.view.mobile.Navigation.getInstance().parseFragment(dest);

      var view = config.view != null ? config.view : null;
      var segment = config.segment != null ? config.segment : null;
      var param = config.param != null ? config.param : null;

      var viewClass = this.__views[view];
      var currentViewObj = this.getView();
      var path = this.__path;

      var firePathChange = false;
      
      if (rel == "param") 
      {
        // Replace param in path
        path[path.length-1].param = param;
        firePathChange = true;
        
        this.__transition = null;
        currentViewObj.setParam(param);
      } 
      else if (rel == "segment") 
      {
        // Replace segment in path
        path[path.length-1].segment = segment;
        firePathChange = true;

        this.__transition = null;
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
        this.__transition = "out";
        this.setView(parentViewObj);

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
        
        this.__transition = "replace";
        this.setView(viewObj);
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
          this.__transition = "in";
          this.setView(viewObj);
        }
      }
      else
      {
        var childViewManager = unify.view.mobile.Navigation.getInstance().getViewManager(view);
        if (childViewManager == null) {
          throw new Error("Could not find view manager for view: " + view);
        }
        
        if (this.getEnableDeepSwitch() && this.__deep[dest]) {
          childViewManager.go(this.__deep[dest]);
        } else {
          childViewManager.go([config]);
        }
      }
      
      if (firePathChange) 
      {
        this.debug("Fire path change!");
        this.fireEvent("changePath");
      }
      
      // Lazy further processing
      // Give the device some time for painting, garbage collection etc.
      // This omits an overload and execution stop during intensive phases.
      // Especially important on slower devices.
      qx.lang.Function.delay(this.__onTapDone, 300, this, +new Date);
    },
    

    /**
     * Called when tap is rendered
     *
     * @param start {Date} Render start time
     */
    __onTapDone : function(start)
    {
      this.debug("Painted in: " + (new Date - start - 300) + "ms");
      this.__following = false;
    },


    /**
     * Executed on every touch hold event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchHold : function(e)
    {
      if (this.__following) {
        return;
      } 

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
      if (this.__following) {
        return;
      } 

      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element2.Class.remove(elem, "pressed");
      }
    },    



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyView : function(value, old)
    {
      this.debug("Activating view: " + value);

      if (old) {
        old.resetActive();
      }

      // Resuming the view
      value.setActive(true);

      // Cache element/view references
      var toView = value;
      var fromView = old;
      var toLayer = toView && toView.getElement();
      var fromLayer = fromView && fromView.getElement();
      
      // Check parent
      if (toLayer.parentNode != this.__element) {
        this.__element.appendChild(toLayer);
      }
      
      var transition = this.__transition;

      // Detect animation
      if (transition == "in" || transition == "out")
      {
        if (qx.core.Variant.isSet("unify.postitionshift", "3d")) 
        {
          var positionBottomOut = "translate3d(0,100%,0)";
          var positionRightOut = "translate3d(100%,0,0)";
          var positionLeftOut = "translate3d(-100%,0,0)";
          var positionVisible = "translate3d(0,0,0)";
        } 
        else if (qx.core.Variant.isSet("unify.postitionshift", "2d")) 
        {
          var positionBottomOut = "translate(0,100%)";
          var positionRightOut = "translate(100%,0)";
          var positionLeftOut = "translate(-100%,0)";
          var positionVisible = "translate(0,0)";
        }

        if (transition == "in")
        {
          if (toView.isModal())
          {
            this.__animateLayer(toLayer, positionBottomOut, positionVisible, true, fromLayer);
          }
          else
          {
            this.__animateLayer(toLayer, positionRightOut, positionVisible, true);
            this.__animateLayer(fromLayer, positionVisible, positionLeftOut, false);
          }
        }
        else if (transition == "out")
        {
          if (fromView.isModal())
          {
            this.__animateLayer(fromLayer, positionVisible, positionBottomOut, false, toLayer);
          }
          else
          {
            this.__animateLayer(toLayer, positionLeftOut, positionVisible, true);
            this.__animateLayer(fromLayer, positionVisible, positionRightOut, false);
          }
        }
      }
      else
      {
        if (old) {
          qx.bom.element2.Class.remove(fromLayer, "current");
        }

        if (value) {
          qx.bom.element2.Class.add(toLayer, "current");
        }
      }

      // Fire appear/disappear events
      if (old) {
        fromView.fireEvent("disappear");
      }

      if (value) {
        toView.fireEvent("appear");
      }
    },
    
    
    /** {unify.ui.mobile.Layer} During layer animation: The previous layer */
    __fromLayer : null,

    /** {unify.ui.mobile.Layer} During layer animation: The next layer */
    __toLayer : null,

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
      var Registration = qx.event.Registration;
      var Style = qx.bom.element2.Style;
      var targetStyle = target.style;

      // Normalize cross-browser differences
      var property = Style.property("transform");
      var duration = Style.property("transitionDuration");

      // Method to cleanup after transition
      var cleanup = function()
      {
        // Disable transition again
        targetStyle[duration] = "0ms";

        // Remove listener
        Registration.removeListener(target, "transitionEnd", cleanup, this);
        
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
        targetStyle[property] = "";
      };

      // React on transition end
      Registration.addListener(target, "transitionEnd", cleanup, this);

      // Move to top
      targetStyle.zIndex = 1000;

      // Disable transition
      targetStyle[duration] = "0ms";

      // Apply initial value
      targetStyle[property] = from;

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

      // Enable transition
      targetStyle[duration] = "";

      // Apply target value
      targetStyle[property] = to;
    }    
  }
});
