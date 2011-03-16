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
    
    this.__root = document.body;
    this.__visibleViewManagers = [];
    
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
    /** {Map} ID to view manager registry */
    __viewManagers : null,
    
    
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
          mblocker.style.zIndex ='';
          mblocker.style.display='';
        }
        if(!pSet){
          pblocker.style.zIndex = '';
          pblocker.style.display='';
        }
      } else {
        pblocker.style.zIndex = '';
        mblocker.style.zIndex = '';
        pblocker.style.display='';
        mblocker.style.display='';
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
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      
      this.debug("Show: " + id);
      
      var elem = viewManager.getElement();
      if(viewManager.getDisplayMode()=='popover'){
        var wrapper = document.createElement('div');
        wrapper.id=elem.id+'-popover';
        wrapper.className='popover-wrapper';
        this.__root.appendChild(wrapper);
        wrapper.appendChild(elem);

        var indicator=document.createElement("div");
        indicator.className="popover-indicator";
        wrapper.appendChild(indicator);
      } else {
        if(!this.__root==elem.parentNode){
          this.__root.appendChild(elem);
        }
      }
      this.__visibleViewManagers.push(viewManager);
      this.__sortPopOvers();
      viewManager.show();
      elem.style.display='block';
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     */
    hide : function(id)
    {
      var viewManager=unify.view.ViewManager.get(id);

      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      if (this.__visibleViewManagers.indexOf(viewManager) < 0) {
        return;
      }

      var elem=viewManager.getElement();
      if(viewManager.getDisplayMode()=='popover'){
        this.__root.removeChild(elem.parentNode);
      }

      elem.style.zIndex='';
      elem.style.display='';//hides element because popover class defaults to display: none
      viewManager.hide();
      qx.lang.Array.remove(this.__visibleViewManagers, viewManager);
      this.__sortPopOvers();
    }
  },
  
  
  
  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */
    
  destruct : function() {
    qx.event.Registration.removeListener(this.__pblocker,'tap',this.__tapBlocker,this);
    this.__root.removeChild(this.__pblocker);
    this.__root.removeChild(this.__mblocker);
    this.__root = this.__pblocker= this.__mblocker=this.__viewManager = null;
  } 
});