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
// TODO: Switch to widget system?
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
    
    this.__root = document.body;
    this.__visibleViewManagers = [];
    this.__overlays={};
    this.__styleRegistry = {};
    
    var pblocker = this.__pblocker = document.createElement("div");
    pblocker.id = "popover-blocker";
    var mblocker = this.__mblocker = document.createElement("div");
    mblocker.id = "modal-blocker";
    qx.event.Registration.addListener(pblocker,'tap',this.__onTapBlocker,this);
    this.__root.appendChild(pblocker);
    this.__root.appendChild(mblocker);
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
    
    setStyles : function(viewManager, styleMap) {
      this.__styleRegistry[viewManager] = styleMap;
    },
    
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
     */
    show : function(id)
    {
      var viewManager = unify.view.ViewManager.get(id);
      
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
        overlay=this.__getOverlay(viewManager);
        var wrapper = overlay.getElement();
        var style = this.__styleRegistry[viewManager];
        if (style) {
          qx.bom.element.Style.setStyles(wrapper, style);
        }
        this.__root.appendChild(wrapper);
        wrapper.appendChild(elem);
      } else {
        if(!this.__root==elem.parentNode){
          this.__root.appendChild(elem);
        }
      }
      this.__visibleViewManagers.push(viewManager);
      this.__sortPopOvers();
      viewManager.show();
      if(overlay){
         overlay.show();
      }
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager
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
      var elem=viewManager.getElement();
      var mode=viewManager.getDisplayMode();

      var self=this;
      var hideCallback=function(){
        elem.style.display='none';
        if(mode=='popover'){
            elem=elem.parentNode;
        }
        elem.style.zIndex='';

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
          overlay.addListenerOnce("fadeOut",hideCallback,this);
          overlay.hide();
        }
      } else {
        viewManager.hide(hideCallback);
      }
    },

    __getOverlay : function(viewManager){
      var overlay=this.__overlays[viewManager];
      if(!overlay){
        overlay=new unify.ui.container.Overlay;
        var elem=overlay.getElement();
        var managerElem=viewManager.getElement();
        elem.id=managerElem.id+'-popover';
        qx.bom.element.Class.add(elem,'popover-wrapper');
        var indicator=document.createElement("div");
        indicator.className="popover-indicator";
        elem.appendChild(indicator);
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
