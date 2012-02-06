/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com
               2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Handles pop over stacking (and blocking elements)
 */

qx.Class.define("unify.ui.core.PopOverManager",
{
  extend : qx.core.Object,
  type : "singleton",
  
  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */
    
  construct : function() {
    this.base(arguments);
    
    var root = this.__root = qx.core.Init.getApplication().getRoot();
    this.__visibleOverlays = [];
    this.__overlays={};
    this.__styleRegistry = {};
    
    var Style = qx.bom.element.Style;
    
    var pblocker = this.__pblocker = document.createElement("div");
    var pstyle = qx.theme.manager.Appearance.getInstance().styleFrom("POPOVER-BLOCKER");
    pstyle.display = "none";
    Style.setStyles(pblocker, pstyle);
    pblocker.id = "popover-blocker";
    
    var mblocker = this.__mblocker = document.createElement("div");
    var mstyle = qx.theme.manager.Appearance.getInstance().styleFrom("MODAL-BLOCKER");
    mstyle.display = "none";
    Style.setStyles(mblocker, mstyle);
    mblocker.id = "modal-blocker";
    
    qx.event.Registration.addListener(pblocker,'tap',this.__onTapBlocker,this);
    
    var rootElement = root.getElement();
    rootElement.appendChild(pblocker);
    rootElement.appendChild(mblocker);
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
    __visibleOverlays : null,
    __pblocker : null,
    __mblocker : null,
    
    /**
     * Applies correct zIndex to all visible pop-overs
     * and positions blocker below the topmost visible popover.
     */
    __sortPopOvers : function()
    {
      var zIndexBase = 100; //TODO read base value from config or some other global strategy to play nice with other zIndex dependant features like transition animations
      var visible = this.__visibleOverlays;
      var pblocker = this.__pblocker;
      var mblocker = this.__mblocker;

      var numVisible = visible.length;
      for (var i=0; i<numVisible; i++) {
        visible[i].setStyle({zIndex: zIndexBase + 2*i}); //leave a gap of 1 between layers so the blocker fits between 2 visible popovers
      }

      if (numVisible > 0) {
        var mSet=false;
        var pSet=false;
        for(var i=numVisible-1;i>=0;i--){
          var modal = visible[i].getModal();

          if(!mSet && modal){
            mblocker.style.zIndex = (zIndexBase-1)+2*i;
            mblocker.style.display = 'block';
            mSet = true;
          } else if (!pSet && !modal){
            pblocker.style.zIndex = (zIndexBase-1)+2*i;
            pblocker.style.display = 'block';
            pSet = true;
          }
          if (mSet&&pSet) {
            break;
          }
        }
        if(!mSet){
          mblocker.style.zIndex = undefined;
          mblocker.style.display = 'none';
        }
        if(!pSet){
          pblocker.style.zIndex = undefined;
          pblocker.style.display = 'none';
        }
      } else {
        pblocker.style.zIndex = undefined;
        mblocker.style.zIndex = undefined;
        pblocker.style.display = 'none';
        mblocker.style.display = 'none';
      }
    },

    /**
     * Closes topmost popover
     */
    __onTapBlocker : function(){
      var numVisible = this.__visibleOverlays.length;
      
      if (numVisible > 0) {
        var topMost = this.__visibleOverlays[numVisible-1];

        this.hide(topMost);
      } else {
        this.error("tapped on blocker without visible viewmanager");
        //sort popovers again to make sure the blocker is gone
        this.__sortPopOvers();
      }
    },

    /**
     * Shows the view manager with the given ID.
     *
     * @param overlay {unify.ui.container.Overlay} ID of view manager as string or overlay widget
     * @param trigger {unify.ui.Widget?null} Widget that triggers the opening of the popover
     */
    show : function(overlay, trigger) {
      if (qx.core.Environment.get("qx.debug")) {
        this.debug("Show: " + widget);
      }
      
      if (trigger) {
        overlay.setTrigger(trigger);
      }
      this.__root.add(widget);
      
      this.__visibleOverlays.push(overlay);
      this.__sortPopOvers();
      this.fireDataEvent("show", overlay);
      overlay.show();
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param overlay {unify.ui.container.Overlay} ID of view manager as string or overlay widget
     */
    hide : function(overlay) {
      var self = this;
      
      var hideCallback=function(){
        qx.lang.Array.remove(self.__visibleOverlays, overlay);
        self.__sortPopOvers();
        
        self.fireDataEvent("hide", overlay);
      };

      overlay.addListenerOnce("hidden", hideCallback, this);
      overlay.hide();
    }
  },

  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */
    
  destruct : function() {
    qx.event.Registration.removeListener(this.__pblocker, 'tap', this.__onTapBlocker, this);
    
    var rootElement = this._root.getElement();
    rootElement.removeChild(this.__pblocker);
    rootElement.removeChild(this.__mblocker);
    this.__root = this.__pblocker = this.__mblocker = this.__overlays = this.__styleRegistry = null;
  } 
});
