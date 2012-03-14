/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011-2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * EXPERIMENTAL
 *
 * General view manager that handles a number of views to support
 * general navigation, animation between views etc.
 *
 * @see unify.view.StaticView
 */
core.Class("unify.view.ViewManager", {
  include : [unify.ui.container.Composite],
  implement : [unify.view.IViewManager],
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param managerId {String} globally unique ID of this manager
   * @param layout {unify.ui.layout.Base?null} Layout
   */
  construct : function(managerId, layout)
  {
    unify.ui.container.Composite.call(this, layout || new unify.ui.layout.Canvas());

    this.setUserData("viewmanager", this);

    if (core.Env.getValue("debug"))
    {
      if (managerId == null) {
        throw new Error("Invalid manager ID: " + managerId);
      }
    }

    // Store manager ID
    this.__managerId = managerId;
    
    // Add to registry
    var registry = unify.view.ViewManager.__managers;
    if (!registry) {
      registry = registry = unify.view.ViewManager.__managers = {};
    }
    if (core.Env.getValue("debug"))
    {
      if (registry[managerId]) {
        throw new Error("Manager ID is already in use by: " + registry[managerId]);
      }
    }
    registry[managerId] = this;
    
    // Create instance specific data structures
    this.__views = {};

    //initialize overflow hidden here, so that view transitions animations are hidden properly
    this._setStyle({overflow:"hidden"});
  },
  
  


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired whenever the view-local path was modified */
    changePath : lowland.events.DataEvent,
    
    /** Fired whenever the displayed view was modified */
    changeView : lowland.events.Event
  },
  
  
  
  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */
  
  properties :
  {
    // overwritten
    appearance : {
      init: "viewmanager"
    },
    
    /**
     * switch to disable view transition animations
     */
    animateTransitions: {
      type:"Boolean",
      init: true
    },
    
    /**
     * Duration of layer animation
     */
    animationDuration : {
      type: "Integer",
      init: 350
    },
    
    /** 
     * Related view manager which functions as a master (controller) for this view manager 
     */
    master : {
      type : unify.view.ViewManager,
      nullable : true,
      apply: this._applyMaster
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
      type : "String",
      init: "default",
      apply: this._applyDisplayMode,
      fire: "changeDisplayMode"
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
    
    getModal : function() {
      return (this.getDisplayMode() == "modal");
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
    
    /**
     * Initialize the view manager.
     * This adds the view manager to the layouting queues.
     */
    init : function() {
      if (!this.__path && this.getDisplayMode()!='modal') {
        this.__resetHelper();
      }

      unify.ui.layout.queue.Visibility.add(this);
      unify.ui.layout.queue.Layout.add(this);
      //unify.ui.layout.queue.Manager.flush();
      
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
      if (core.Env.getValue("debug"))
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
      this.fireEvent("changePath", this.__path);
    },

    /**
     * Navigates to the given path
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path) {
      if (core.Env.getValue("debug"))
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
      if (core.Env.getValue("debug"))
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
        unify.view.helper.ViewOverlayManager.getInstance().show(this.getId());
      }
      // Save path
      this.__path = path;
      
      this.fireEvent("changePath", this.__path);
    },
    
    /*
    ---------------------------------------------------------------------------
      MODAL VISIBILITY HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Hides the view manager and pauses active view
     *
     * @param callback {Function} optional callback to execute after hidianimation is done
     */
    hide : function(callback) {
      if (!this.getModal()) {
        this.base(arguments);
      } else {
        if(this.getDisplayMode() != "modal"){
          throw new Error("hideModal called on ViewManager without displaymode modal: "+this);
        }
        var view = this.__currentView;
        if (view) {
          view.setActive(false);
        }
        this.__path=null;
        this.__currentView=null;
        this.fireEvent("changePath", this.__path);
        
        var self = this;
        var selfArguments = arguments;
        var cb = function() {
          view.setActive(false);
          view.hide();
          unify.ui.container.Composite.prototype.hide.apply(self, selfArguments);
          if(callback){
            callback();
          }
        };
        
        if(this.getAnimateTransitions()){
          this.__animateModal(view,false,cb);
        } else {
          cb();
          /*view.setActive(false);
          view.hide();
          this.base(arguments);
          if(callback){
            callback();
          }*/
        }
      }
    },


    /**
     * Shows the view manager and resumes selected view
     */
    show : function() {
      if (!this.getModal()) {
        unify.ui.container.Composite.show.call(this);
      } else {
        // Be sure that we show a view (if possible)
        if(!this.__initialized){
          this.init();
        }
        // Re-activate view (normally only useful if it was paused before)
        var view = this.__currentView;
        if (core.Env.getValue("debug")) {
          this.debug("Show with: " + view);
        }
        if (view) {
          view.setActive(true);
        }
  
        unify.ui.container.Composite.prototype.show.call(this);
        if(this.getAnimateTransitions()) {
          this.__animateModal(view,true);
        } else {
          view.show();
        }
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      NAVIGATION RELATED EVENT HANDLERS
    ---------------------------------------------------------------------------
    */
    
    /** {Boolean} Whether the app is following a link */
    __navigates : false,

    /*
    ---------------------------------------------------------------------------
      PRESSED STYLE EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    
    /*
    ---------------------------------------------------------------------------
      VIEW MANAGMENT
    ---------------------------------------------------------------------------
    */

    /** {Map} A map with all keys (by ID) */
    __views : null,

    /** {String} ID of default view */
    __defaultViewId : null,

    /** current view instance */
    __currentView: null,
    
    /**
     * Registers a new view. All views must be registered before being used.
     *
     * @param viewClass {Class} Class of the view to register
     * @param isDefault {Boolean?false} Whether the added view functions as the default view for this manager.
     */
    register : function(viewClass, isDefault)
    {
      if (core.Env.getValue("debug"))
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
      var classname = viewClass.className;
      var id = classname.substring(classname.lastIndexOf(".")+1).hyphenate().substring(1).toLowerCase();
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
     * helper function to find out if this viewmanager displays its default view
     * 
     * @return {Boolean} true if current view is the default view
     */
    isInDefaultView: function(){
      return (this.__currentView && this.__currentView.getId()===this.__defaultViewId);  
    },
    
    /**
     * called when property displayMode changes its value.
     * adds/removes state 'popover' on this widget and all its children recursively
     * @param value {String} new displayMode
     * @param old {String} old displayMode
     */
    _applyDisplayMode : function(value,old){
      if(value=="popover"){
        this.addState('popover');
        this.__changeChildState(this,"popover");
      } else if (old=="popover"){
        this.__changeChildState(this,"popover",true);
        this.removeState('popover');
      }
    },

    /**
     * called when property master changes its value.
     * 
     * @param master {ViewManager} the new master viewmanager
     * @param old {ViewManager} the old maser viewmanager
     */
    _applyMaster : function(master,old){
      if(old){
        old.removeListener("changePath",this._onMasterChangePath,this);
      }
      if(master){
        master.addListener("changePath",this._onMasterChangePath,this);
      }
    },

    /**
     * event listener for master path changes.
     * 
     * @param e {DataEvent} the changepath event
     */
    _onMasterChangePath: function(e){
      var master=e.getTarget();
      if(master.isInDefaultView()){
        this.reset();//change to our default view aswell
      }
    },

    /**
     *  changes a state on all  children of a widget recursively.
     *  
     * @param widget {unify.ui.core.Widget} the parent widget
     * @param state {String} the state to change
     * @param remove {Boolean}  true: the state is removed; false: the state is added
     */
    __changeChildState: function (widget,state,remove){
      var children = widget.getChildren();
      if(children){
        for (var i = 0,l=children.length;i<l;i++){
          var child=children[i];
          if(remove){
            child.removeState(state);
          } else {
            child.addState(state);
          }
          this.__changeChildState(children[i],state,remove);
        }
      }
    },

    /**
     * called when a new child widget was added.
     *
     * adds state popover to that child and all its children if this viewmanager is in displaymode popover
     * @param child {unify.ui.core.Widget} child widget
     */
    _afterAddChild : function(child){
      if(this.getDisplayMode()=='popover'){
        child.addState('popover');
        this.__changeChildState(child,'popover');
      }
    },
    
    /**
     * {Map} Maps the position of the layer to the platform specific transform value.
     */
    __positions : {
      center: {left: 0, top: 0},
      left: {left: "-100%", top: 0},
      right: {left: "100%", top: 0},
      bottom: {left: 0, top: "100%"}
    },

    /**
     * Internal setter method for view switching
     *
     * @param view {unify.view.StaticView} View instance to switch to
     * @param transition {String?null} Transition name
     */
    __setView : function(view, transition)
    {
      console.log("SET VIEW ", this.constructor, view.constructor);
      // TODO: view.getElement() is also called if view is in popover
      //       Maybe it should be rendered lazy
      var oldView = this.__currentView;
      if (view == oldView) {
        return;
      }
      
      if (oldView) {
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
      if (this.indexOf(view) == -1 /*true || currentViewElement.parentNode != elem*/) {
        this.add(view, {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0
        });
      }
      
      // Transition specific layer switch
      var positions = this.__positions;

      if (this.getAnimateTransitions() && (transition == "in" || transition == "out"))
      {
        this.__animateLayers(view, oldView, transition);
      } else {
        
        if (oldView) {
          oldView.setVisibility("hidden");
        }
        if (view) {
          var pos = this.__positions.center;
          view.setStyle({
            transform: unify.bom.Transform.accelTranslate(pos.left, pos.top)
          });
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
    
    /**
     * Handling function to animate between views in a view manager
     *
     * @param toView {unify.view.StaticView} View to animate to
     * @param fromView {unify.view.StaticView} View to animate from
     * @param direction {String} Either "in" or "out", direction of animation
     */
    __animateLayers : function(toView, fromView, direction) {
      var self = this;
      var AnimationDuration = this.getAnimationDuration();
      direction = direction || "in";

      var visibilityAction = function() {
        var afterRenderAction = function() {
          var transitionEndFnt = function() {
            fromView.setVisibility("hidden");
          };
          fromView.addListenerOnce("animatePositionDone", transitionEndFnt, this);

          toView.setAnimatePositionDuration(AnimationDuration);
          toView.setAnimatePosition(self.__positions.center);
          fromView.setAnimatePositionDuration(AnimationDuration);
          fromView.setAnimatePosition((direction == "in") ? self.__positions.left : self.__positions.right);
        };
        
        if (toView.hasRenderedLayout()) {
          afterRenderAction();
        } else {
          toView.addListenerOnce("resize", afterRenderAction, this);
        }
      };
      
      if (toView) {
        var posTo = (direction == "in") ? this.__positions.right : this.__positions.left;
        toView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posTo.left, posTo.top)
        });
      }
      
      if (fromView) {
        var posFrom = this.__positions.center;
        fromView.setStyle({
          transform: unify.bom.Transform.accelTranslate(posFrom.left, posFrom.top)
        });
      }
      
      if (toView.getVisibility() != "visible") {
        toView.addListenerOnce("changeVisibility", visibilityAction);
        
        toView.setVisibility("visible");
      } else {
        visibilityAction();
      }
    },

    /**
     * Animate modal view
     *
     * @param view {unify.view.StaticView} View to animate
     * @param show {Boolean} true for show, false for hide
     * @param callback {Function} optional callback to execute after animation
     */
    __animateModal: function(view,show,callback){
      var self = this;
      var AnimationDuration = this.getAnimationDuration();

      var visibilityAction = function() {
        var afterRenderAction = function() {
          if (callback) {
            view.addListenerOnce("animatePositionDone", callback, this);
          }
          view.setAnimatePositionDuration(AnimationDuration);
          view.setAnimatePosition((show) ? self.__positions.center : self.__positions.bottom);
        }

        if (view.hasRenderedLayout()) {
          afterRenderAction();
        } else {
          view.addListenerOnce("resize", afterRenderAction, this);
        }
      };

      var startPos = (show) ? this.__positions.bottom : this.__positions.center;
      if (!view) {
        console.trace();
      }
      view.setStyle({
        transform: unify.bom.Transform.accelTranslate(startPos.left, startPos.top)
      });


      if (view.getVisibility() != "visible") {
        view.addListenerOnce("changeVisibility", visibilityAction);

        view.setVisibility("visible");
      } else {
        visibilityAction();
      }
    }
  }
});

unify.core.Statics.annotate(unify.view.ViewManager, {
  /**
   * Returns the manager with the given ID
   *
   * @param managerId {String} The ID of the view manager
   * @return {unify.view.ViewManager} The view manager instance
   */
  get : function(managerId)
  {
    var mgr = unify.view.ViewManager.__managers[managerId];
    if (core.Env.getValue("debug"))
    {
      if (!mgr) {
        throw new Error("Unknown view manager: " + managerId);
      }
    }
    
    return mgr;
  }
});
