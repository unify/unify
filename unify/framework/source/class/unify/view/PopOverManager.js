/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com
               2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Manager for view managers which functions as a so-called pop over.
 *
 */

core.Class("unify.view.PopOverManager", {
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  construct : function()
  {
    this.base(arguments);
    
    this.__root = qx.core.Init.getApplication().getRoot();
    this.__visibleViewManagers = [];
    this.__overlays={};
    this.__styleRegistry = {};
    
    var setStyles = qx.lang.Function.bind(qx.bom.element.Style.setStyles, qx.bom.element.Style);
    
    var pblocker = this.__pblocker = document.createElement("div");
    setStyles(pblocker, {
      "position": "absolute",
      "left": 0,
      "top": 0,
      "width": "100%",
      "height": "100%",
      "display": "none"
    });
    pblocker.id = "popover-blocker";
    var mblocker = this.__mblocker = document.createElement("div");
    setStyles(mblocker, {
      "position": "absolute",
      "left": 0,
      "top": 0,
      "width": "100%",
      "height": "100%",
      "display": "none",
      "backgroundColor": "#000",
      "opacity": 0.5
    });
    mblocker.id = "modal-blocker";
    qx.event.Registration.addListener(pblocker,'tap',this.__onTapBlocker,this);
    this.__root.getElement().appendChild(pblocker);
    this.__root.getElement().appendChild(mblocker);
  },
  
  events : {
    /** Show popup event */
    "show" : "qx.event.type.Data",
    
    /** Hide popup event */
    "hide" : "qx.event.type.Data"
  },

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
    
  members :
  {
    __root : null,
    __visibleViewManagers : null,
    __pblocker : null,
    __mblocker : null,
    
    /** {Map} ID to view manager registry */
    __viewManagers : null,
    
    
    /** {Map} Style registry */
    __styleRegistry : null,
    
    /**
     * Set styles for a specific viewManager
     *
     * @param viewManager {unify.view.ViewManager} View manager to get styles for
     * @param styleMap {Map[]} CSS style map for specific view manager
     */
    setStyles : function(viewManager, styleMap) {
      this.__styleRegistry[viewManager] = styleMap;
    },
    
    /**
     * Return styles set via setStyles for a specific viewManager
     *
     * @param viewManager {unify.view.ViewManager} View manager to get styles for
     * @return {Map[]} CSS style map for specific view manager
     */
    getStyles : function(viewManager) {
      return this.__styleRegistry[viewManager];
    },
    
    /**
     * Applies correct zIndex to all visible pop-overs
     * and positions blocker below the topmost visible popover.
     */
    __sortPopOvers : function()
    {
      var zIndexBase=100;//TODO read base value from config or some other global strategy to play nice with other zIndex dependant features like transition animations
      var visible = this.__visibleViewManagers;
      var pblocker = this.__pblocker;
      var mblocker = this.__mblocker;

      var numVisible=visible.length;
      for (var i=0; i<numVisible; i++) {
        var viewManager=visible[i];
        var elem=viewManager;
        if(viewManager.getDisplayMode && viewManager.getDisplayMode()=='popover'){
          elem=this.__overlays[viewManager];//adjust overlay for popovers
        }
        elem.setStyle({zIndex: zIndexBase + 2*i});//leave a gap of 1 between layers so the blocker fits between 2 visible popovers
      }

      if(numVisible>0){
        var mSet=false;
        var pSet=false;
        for(var i=numVisible-1;i>=0;i--){
          var mode=visible[i].getDisplayMode && visible[i].getDisplayMode() || "popover";

          if(!mSet && mode == 'modal'){
            mblocker.style.zIndex = (zIndexBase-1)+2*i;
            mblocker.style.display = 'block';
            mSet=true;
          } else if (!pSet && mode =='popover'){
            pblocker.style.zIndex = (zIndexBase-1)+2*i;
            pblocker.style.display = 'block';
            pSet=true;
          }
          if(mSet&&pSet){
            break;
          }
        }
        if(!mSet){
          mblocker.style.zIndex =undefined;
          mblocker.style.display='none';
        }
        if(!pSet){
          pblocker.style.zIndex = undefined;
          pblocker.style.display='none';
        }
      } else {
        pblocker.style.zIndex = undefined;
        mblocker.style.zIndex = undefined;
        pblocker.style.display='none';
        mblocker.style.display='none';
      }
    },

    /**
     * Closes topmost popover
     */
    __onTapBlocker : function(){
      var numVisible=this.__visibleViewManagers.length;
      if(numVisible>0){
        var topMost=this.__visibleViewManagers[numVisible-1];

        if (!topMost.getId) {
          if (!topMost.getBlockerClose()) {
            return;
          }
        } else {
          topMost = topMost.getId();
        }
        this.hide(topMost.getId && topMost.getId() || topMost);
      } else {
        this.error("tapped on blocker without visible viewmanager");
        //sort popovers again to make sure the blocker is gone
        this.__sortPopOvers();
      }
    },

    /**
     * Shows the view manager with the given ID.
     *
     * @param target {String|unify.ui.container.Overlay} ID of view manager as string or overlay widget
     * @param trigger {unify.ui.Widget?null} Widget that triggers the opening of the popover
     */
    show : function(target, trigger) {
      if (typeof(target) == "string") {
        this._showView(target, trigger);
      } else {
        this._showWidget(target, trigger);
      }
    },

    _showWidget : function(widget, trigger) {
      if (qx.core.Environment.get("qx.debug")) {
        this.debug("Show: " + widget);
      }
      
      if (trigger) {
        widget.setTrigger(trigger);
      }
      this.__root.add(widget);
      
      this.__visibleViewManagers.push(widget);
      this.__sortPopOvers();
      this.fireDataEvent("show", widget);
      widget.show();
    },

    /**
     * Shows the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     * @param trigger {unify.ui.Widget?null} Widget that triggers the opening of the popover
     */
    _showView : function(id, trigger) {
      var viewManager = unify.view.ViewManager.get(id);
      var displayMode=viewManager.getDisplayMode();
      if (!viewManager.isInitialized()) {
        viewManager.init();
      }
      
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      if (this.__visibleViewManagers.indexOf(viewManager) >-1) {
        if (qx.core.Environment.get("qx.debug")){
            this.debug("called show with viewmanager that is already visible: "+id);
        }
        return;//already visible
      }
      if (qx.core.Environment.get("qx.debug")) {
        this.debug("Show: " + id);
      }

      var overlay;
      if(displayMode=='popover'){

        overlay=this.__getOverlay(viewManager);

        overlay.setTrigger(trigger?trigger:null);

        var registeredStyle=this.__styleRegistry[viewManager];
        if(registeredStyle){
          overlay.getChildrenContainer().setStyle(registeredStyle);
        }
        overlay.add(viewManager,{top:0,left:0,right:0,bottom:0});
        this.__root.add(overlay);
      } else if(displayMode=="modal"){
        if(this.__root!=viewManager.getLayoutParent()){
          this.__root.add(viewManager,this.__styleRegistry[viewManager] ||{top:0,left:0,right:0,bottom:0});
        }
      }
      this.__visibleViewManagers.push(viewManager);
      this.__sortPopOvers();
      if(displayMode=="modal"){
        viewManager.showModal();
      } else {
        viewManager.show();
      }
      this.fireDataEvent("show", id);
      if(overlay){
         overlay.show();
      }
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param target {String|unify.ui.container.Overlay} ID of view manager as string or overlay widget
     * @param skipAnimation {Boolean?false} True if the animation should be skipped
     */
    hide : function(target, skipAnimation) {
      if (typeof(target) == "string") {
        this._hideView(target, skipAnimation);
      } else {
        this._hideWidget(target);
      }
    },
    
    _hideWidget : function(target) {
      var self = this;
      
      var hideCallback=function(){
        qx.lang.Array.remove(self.__visibleViewManagers, target);
        self.__sortPopOvers();
        
        self.fireDataEvent("hide", target);
      };

      target.addListenerOnce("hidden",hideCallback,this);
      target.hide();
    },
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     * @param skipAnimation {Boolean} True if the animation should be skipped
     */
    _hideView : function(id,skipAnimation) {
      var viewManager=unify.view.ViewManager.get(id);

      if (qx.core.Environment.get("qx.debug"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      if (this.__visibleViewManagers.indexOf(viewManager) < 0) {
        if (qx.core.Environment.get("qx.debug")){
            this.debug("called hide with viewmanager that is not visible: "+id);
        }
        return;
      }
      var mode=viewManager.getDisplayMode();

      var self=this;
      var hideCallback=function(){
        qx.lang.Array.remove(self.__visibleViewManagers, viewManager);
        self.__sortPopOvers();
        
        self.fireDataEvent("hide", id);
      };

      if(mode=='popover'){
        var overlay=this.__overlays[viewManager];
        //TODO reenable animations in overlay and skipAnimation here
        /*
        if(skipAnimation){
          var animate=overlay.getEnableAnimation();
          overlay.setEnableAnimation(false);
          overlay.hide();
          overlay.setEnableAnimation(animate);
          hideCallback();
        } else {
          overlay.addListenerOnce("hidden",hideCallback,this);
          overlay.hide();
        }
        */
        overlay.addListenerOnce("hidden",hideCallback,this);
        overlay.hide();
      } else {
        viewManager.hideModal(hideCallback);
      }
    },

    /**
     * Get overlay element
     *
     * @param viewManager {unify.view.ViewManager} View manager to generate overlay for
     * @return {unify.ui.container.Overlay} Overlay widget
     */
    __getOverlay : function(viewManager){
      var overlay=this.__overlays[viewManager];
      if(!overlay){
        overlay=new unify.ui.container.Overlay();
        var appearanceId=viewManager.getId()+"-overlay";
        var appearance=qx.theme.manager.Appearance.getInstance().styleFrom(appearanceId);
        if(appearance){
          overlay.setAppearance(appearanceId);
        }
        this.__overlays[viewManager]=overlay;
      }
      return overlay;
    }
  }

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */
  /*  
  destruct : function() {
    qx.event.Registration.removeListener(this.__pblocker,'tap',this.__onTapBlocker,this);
    this.__root.getElement().removeChild(this.__pblocker);
    this.__root.getElement().removeChild(this.__mblocker);
    this.__root = this.__pblocker= this.__mblocker=this.__viewManagers=this.__overlays=this.__styleRegistry = null;
  } */
});

unify.core.Singleton.annotate(unify.view.PopOverManager);
