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
    }
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
        this.__defaultView = viewClass;
      }

      this.__views[id] = viewClass;
    },
    
    
    getElement : function() {
      return this.__element;
    },
    
    
    getId : function() {
      return this.__id;
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
    
    

    /**
     * Selects the given DOM element. Automatically disables fade-out
     * selections during layer animation.
     *
     * @param elem {Element} DOM element to select
     */
    select : function(elem)
    {
      this.__cleanupAnimateSelectionRecovery();
      qx.bom.element2.Class.add(elem, "selected");
    },    
    
    
    /**
     * Update given views. 
     * 
     * The data structure should reflect the navigation structure.
     * 
     * @param views {Map[]} List of affected views
     * @return {}
     */
    update : function(views)
    {
      this.debug("Updating views...");
      
      var parent = null;
      
      for (var i=0, l=views.length; i<l; i++)
      {
        var config = views[i];

        // Create view instance, if not done yet
        var view = config.view.getInstance();

        // Update configuration
        parent != null ? view.setParent(parent) : view.resetParent();

        var segment = config.segment;
        segment != null ? view.setSegment(segment) : view.resetSegment();

        var param = config.param;
        param != null ? view.setParam(param) : view.resetParam();
        
        // Setup parent
        parent = view;
      }
      
      // Activate last view
      if (view) {
        this.setView(view);
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
        this.debug("Processing tap...");
        
        // Stop further event processing
        e.stopPropagation();
        
        
        var exec = elem.getAttribute("exec");
        if (exec) 
        {
          // FIXME 
          // Support executing public function on currently selected view
        }
        else
        {
          // Mark as following (read: active)
          this.__following = true;

          // Add CSS class for selection highlighting
          this.select(elem);

          // Lazy further processing
          qx.lang.Function.delay(this.__onTapFollow, 0, this, elem);
        }
      }
    },


    /**
     * Used for lazy execution of tap event (to render highlighting of selection first)
     *
     * @param elem {Element} Element which was tapped onto
     */
    __onTapFollow : function(elem)
    {
      unify.view.mobile.Navigation.getInstance().follow(elem);

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
      

      // FIXME
      var mode = null;

      // Detect animation
      if (mode == "in" || mode == "out")
      {
        var animationProperty = "transform";

        if (qx.core.Variant.isSet("unify.postitionshift", "3d")) {
          var positionBottomOut = "translate3d(0,100%,0)";
          var positionRightOut = "translate3d(100%,0,0)";
          var positionLeftOut = "translate3d(-100%,0,0)";
          var positionVisible = "translate3d(0,0,0)";
        } else if (qx.core.Variant.isSet("unify.postitionshift", "2d")) {
          var positionBottomOut = "translate(0,100%)";
          var positionRightOut = "translate(100%,0)";
          var positionLeftOut = "translate(-100%,0)";
          var positionVisible = "translate(0,0)";
        }

        if (mode == "in")
        {
          if (toView.isModal())
          {
            this.__animateLayer(toLayer, animationProperty, positionBottomOut, positionVisible, true, fromLayer);
          }
          else
          {
            this.__animateLayer(toLayer, animationProperty, positionRightOut, positionVisible, true);
            this.__animateLayer(fromLayer, animationProperty, positionVisible, positionLeftOut, false);
          }
        }
        else if (mode == "out")
        {
          if (fromView.isModal())
          {
            this.__animateLayer(fromLayer, animationProperty, positionVisible, positionBottomOut, false, toLayer);
          }
          else
          {
            this.__animateLayer(toLayer, animationProperty, positionLeftOut, positionVisible, true);
            this.__animateLayer(fromLayer, animationProperty, positionVisible, positionRightOut, false);
            this.__animateSelectionRecovery(fromView);
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

    /** {Boolean} The number of currently running animations */
    __running : 0,

    /** {Element} DOM element which is currently fadeout during selection recovery */
    __selectElem : null,
    



    /**
     * Recovers selection on current layer when transitioning from given view.
     *
     * @param fromView {unify.view.mobile.StaticView} View instance the user came from originally
     */
    __animateSelectionRecovery : function(fromView)
    {
      var Style = qx.bom.element2.Style;

      // Build expression for selection
      var fromViewId = fromView.getId();
      var fromViewParam = fromView.getParam();
      var target = fromViewId + (fromViewParam != null ? ":" + fromViewParam : "");

      // Select element and fade out selection slowly
      var selectElem = this.getLayer().getElement().querySelector('[goto="' + target + '"]');
      if (selectElem)
      {
        var duration = Style.property("transitionDuration");
        var selectElemStyle = selectElem.style;

        selectElemStyle[duration] = "0ms";
        qx.bom.element2.Class.add(selectElem, "selected");

        selectElem.offsetWidth+1;
        selectElemStyle[duration] = "1000ms";
        qx.bom.element2.Class.remove(selectElem, "selected");

        this.__selectElem = selectElem;
        qx.event.Registration.addListener(selectElem, "transitionEnd", this.__cleanupAnimateSelectionRecovery, this);
      }
    },


    /**
     * Callback handler for transition function of animation created during
     * {@link #__recoverSelection}. Clears event listeners and styles.
     */
    __cleanupAnimateSelectionRecovery : function()
    {
      var selectElem = this.__selectElem;
      if (selectElem)
      {
        qx.event.Registration.removeListener(selectElem, "transitionEnd", this.__cleanupAnimateSelectionRecovery, this);
        qx.bom.element2.Style.set(selectElem, "transitionDuration", "");

        // Force rendering. Required to re-select the element instantanously when clicked on it.
        // Otherwise it fades in again which is not what we want here.
        selectElem.offsetWidth;

        // Clear element marker
        this.__selectElem = null;
      }
    },


    /**
     * Animates a layer property
     *
     * @param target {Element} DOM element of layer
     * @param property {String} Style property to modify
     * @param from {var} Start value
     * @param to {var} End value
     * @param current {Boolean?false} Whether this layer is the current layer (read: new layer)
     * @param other {Element} DOM element of other layer (previous/next).
     */
    __animateLayer : function(target, property, from, to, current, other)
    {
      var Registration = qx.event.Registration;
      var Class = qx.bom.element2.Class;
      var Style = qx.bom.element2.Style;
      var targetStyle = target.style;

      // Increment running animation counter
      this.__running++;

      // Normalize cross-browser differences
      property = Style.property(property);
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
        var selectedElem;
        if (current && other)
        {
          qx.bom.element2.Class.remove(other, "current");
          selectedElem = other.querySelector(".selected");
        }

        // Make completely invisible if not current layer
        else if (!current)
        {
          qx.bom.element2.Class.remove(target, "current");
          selectedElem = target.querySelector(".selected");
        }

        // Remove selection
        if (selectedElem) {
          qx.bom.element2.Class.remove(selectedElem, "selected");
        }

        // Revert modifications
        targetStyle.zIndex = "";
        targetStyle[property] = "";

        // Decrement running animation counter
        this.__running--;
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
