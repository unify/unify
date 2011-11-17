/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Manager for view managers which functions as a so-called pop over.
 *
 */

qx.Class.define("unify.view.PopOverManager",
{
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
        var elem=viewManager.getElement();
        if(viewManager.getDisplayMode()=='popover'){
          elem=elem.parentNode;//adjust wrapper for popovers
        }
        elem.style.zIndex = zIndexBase + 2*i;//leave a gap of 1 between layers so the blocker fits between 2 visible popovers
      }

      if(numVisible>0){
        var mSet=false;
        var pSet=false;
        for(var i=numVisible-1;i>=0;i--){
          var mode=visible[i].getDisplayMode();

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

        this.hide(topMost.getId());
      } else {
        this.error("tapped on blocker without visible viewmanager");
        //sort popovers again to make sure the blocker is gone
        this.__sortPopOvers();
      }
    },

    /**
     * Shows the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     * @param trigger {unify.ui.Widget?null} Widget that triggers the opening of the popover
     * @param triggerPosition {String?null} Position on trigger to attach popover to
     * @param popoverPosition {String?null} Position on popover to attach to the trigger position
     */
    show : function(id, trigger, triggerPosition, popoverPosition)
    {
      var modLeft = null;
      var modTop = null;
      
      var viewManager = unify.view.ViewManager.get(id);
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
      var elem = viewManager.getElement();
      var overlay;
      if(viewManager.getDisplayMode()=='popover'){
        if (popoverPosition) {
          var map = {
            "l" : "left",
            "c" : "center",
            "r" : "right",
            "t" : "top",
            "b" : "bottom"
          };
          
          var direction = map[popoverPosition[0] || ""];
          var alignment = map[popoverPosition[1] || ""];

          overlay=this.__getOverlay(viewManager, direction, alignment);
        } else {
          overlay=this.__getOverlay(viewManager);
        }
        
        var style = this.__styleRegistry[viewManager] || {};
        
        if (trigger && triggerPosition && popoverPosition) {
          var position = trigger.getPositionInfo();

          var direction = triggerPosition[0] || "r";
          var alignment = triggerPosition[1] || "c";
          
          var left;
          var top;

          if (direction == "r" || direction == "l") {
            if (direction == "r") {
              left = position.left + position.width;
            } else {
              left = position.left;
            }
            
            if (alignment == "t") {
              top = position.top;
            } else if (alignment == "c") {
              top = position.top + Math.round(position.height / 2);
            } else if (alignment == "b") {
              top = position.top + position.height;
            }
          } else {
            if (direction == "t") {
              top = position.top;
            } else {
              top = position.top + position.height;
            }
            
            if (alignment == "l") {
              left = position.left;
            } else if (alignment == "c") {
              left = position.left + Math.round(position.width / 2);
            } else if (alignment == "r") {
              left = position.left + position.width;
            }
          }

          var modLeft = left;
          var modTop = top;
        }
        
        if (style) {
          var mystyle = qx.lang.Object.clone(style);
          delete mystyle.left;
          delete mystyle.top;
          
          overlay.setStyle(mystyle);
          this.__root.add(overlay);
        } else {
          this.error("No style of overlay for view " + viewManager);
        }
        
        overlay.add(viewManager.getWidgetElement());
      } else {
        if(!this.__root==elem.parentNode){
          this.__root.appendChild(elem);
        }
      }
      this.__visibleViewManagers.push(viewManager);
      this.__sortPopOvers();
      viewManager.show();
      if(overlay){
         overlay.show(modLeft, modTop);
      }
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     * @param skipAnimation {Boolean} True if the animation should be skipped
     */
    hide : function(id,skipAnimation)
    {
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
        viewManager.hide();

        qx.lang.Array.remove(self.__visibleViewManagers, viewManager);
        self.__sortPopOvers();
      };

      if(mode=='popover'){
        var overlay=this.__overlays[viewManager];
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
      } else {
        viewManager.hide(hideCallback);
      }
    },

    /**
     * Get overlay element
     *
     * @param viewManager {unify.view.ViewManager} View manager to generate overlay for
     * @param arrowDirection {String} Direction of arrow of popover (left, top, right, bottom)
     * @param arrowAlignment {String} Alignment of arrow on popover (top, center, bottom or left, center, right)
     *
     * @return {unify.ui.container.Overlay} Overlay widget
     */
    __getOverlay : function(viewManager, arrowDirection, arrowAlignment){
      var overlay=this.__overlays[viewManager];
      if(!overlay){
        overlay=new unify.ui.container.Overlay(arrowDirection, arrowAlignment);
        var elem=overlay.getElement();
        elem.id='popover-overlay';
        /*var indicator=document.createElement("div");
        indicator.className="popover-indicator";
        elem.appendChild(indicator);*/
        this.__overlays[viewManager]=overlay;
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
    qx.event.Registration.removeListener(this.__pblocker,'tap',this.__onTapBlocker,this);
    this.__root.removeChild(this.__pblocker);
    this.__root.removeChild(this.__mblocker);
    this.__root = this.__pblocker= this.__mblocker=this.__viewManager=this.__styleRegistry = null;
  } 
});
