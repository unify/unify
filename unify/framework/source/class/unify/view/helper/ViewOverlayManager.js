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

qx.Class.define("unify.view.helper.ViewOverlayManager", {
  extend : qx.core.Object,
  type : "singleton",
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  construct : function()
  {
    this.base(arguments);
    
    this.__visibleViewManagers = [];
    this.__styleRegistry = {};
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
    __visibleViewManagers : null,
    
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
     * Shows the view manager with the given ID.
     *
     * @param id {String} ID of view manager as string or overlay widget
     * @param trigger {unify.ui.Widget?null} Widget that triggers the opening of the popover
     */
    show : function(id, trigger) {
      var viewManager = unify.view.ViewManager.get(id);
      var displayMode = viewManager.getDisplayMode();
      
      if (!viewManager.isInitialized()) {
        viewManager.init();
      }
      
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      
      if (this.__visibleViewManagers.indexOf(viewManager) > -1) {
        if (qx.core.Environment.get("qx.debug")){
          this.debug("called show with viewmanager that is already visible: "+id);
        }
        
        return; // already visible
      }
      
      if (qx.core.Environment.get("qx.debug")) {
        this.debug("Show: " + id);
      }

      var overlay;
      //if(displayMode=='popover'){

        overlay = this.__getOverlay(viewManager);
        overlay.set({
          modal: (displayMode == "modal")
        });

        var registeredStyle = this.__styleRegistry[viewManager];
        if(registeredStyle){
          overlay.getChildrenContainer().setStyle(registeredStyle);
        }
        overlay.add(viewManager, { top:0, left:0, right:0, bottom:0 });
        
        if (this.__root != overlay.getLayoutParent()) {
          this.__root.add(overlay);
        }
        
      /*} else if(displayMode=="modal") {
        if(this.__root!=viewManager.getLayoutParent()){
          this.__root.add(viewManager,this.__styleRegistry[viewManager] ||{top:0,left:0,right:0,bottom:0});
        }
      }*/
      
      var PopOverManager = unify.ui.core.PopOverManager.getInstance();
      PopOverManager.addListenerOnce("show", function(e) {
        
      }, this);
      PopOverManager.show(overlay, trigger);
      
      if(displayMode=="modal") {
        viewManager.showModal();
      } else {
        viewManager.show();
      }
      
      this.fireDataEvent("show", id);
      
      if(overlay) {
         overlay.show();
      }
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager as string or overlay widget
     * @param skipAnimation {Boolean?false} True if the animation should be skipped
     */
    hide : function(id, skipAnimation) {
      var viewManager = unify.view.ViewManager.get(id);

      if (qx.core.Environment.get("qx.debug")) {
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
      var mode = viewManager.getDisplayMode();

      var self=this;
      var hideCallback=function(){
        qx.lang.Array.remove(self.__visibleViewManagers, viewManager);
        self.__sortPopOvers();
        
        self.fireDataEvent("hide", id);
      };

      /*if(mode=='popover'){*/
        var overlay=this.__overlays[viewManager];
        var PopOverManager = unify.ui.core.PopOverManager.getInstance();
        PopOverManager.addListenerOnce("", function() {}, this);
        PopOverManager.hide(overlay);
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
      /*} else {
        viewManager.hideModal(hideCallback);
      }*/
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
        this.__overlays[viewManager] = overlay;
      }
      return overlay;
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */
    
  destruct : function() {
    this.__root = this.__pblocker= this.__mblocker=this.__viewManagers=this.__overlays=this.__styleRegistry = null;
  } 
});
