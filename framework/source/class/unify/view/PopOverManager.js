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
    this.__viewManagers = {};
    this.__visibleViewManagers = [];
    
    var blocker = this.__blocker = document.createElement("div");
    blocker.id = "blocker";
    blocker.className="popover-blocker"
    qx.event.Registration.addListener(blocker,'tap',this.__unblock,this);
    this.__root.appendChild(blocker);
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
      var visible = this.__visibleViewManagers;
      var blocker = this.__blocker;
      var numVisible=visible.length;
      for (var i=0; i<numVisible; i++) {
        var elem=visible[i].getElement();
        elem.style.zIndex = 1000 + 2*i;//leave a gap of 1 between layers so the blocker fits between 2 visible popovers
        elem.style.display = 'block';
      }
      if(numVisible>0){
        blocker.style.zIndex = 997+2*numVisible;
        blocker.style.display = 'block';
      } else {
        blocker.style.zIndex = '';
      }
    },

    /**
     * Closes topmost popover
     */
    __unblock : function(){
      var numVisible=this.__visibleViewManagers.length;
      if(numVisible>0){
        var topMost=this.__visibleViewManagers[numVisible-1];
        this.hide(topMost.getId());
        this.__sortPopOvers();
      }
    },
    
    /**
     * Whether the given view manager is registered
     *
     * @param viewManager {unify.view.ViewManager} The view manager to query for
     * @return {Boolean} Whether the view manager is registered
     */
    has : function(viewManager) {
      return !!this.__viewManagers[viewManager.getId()];
    },
    
    
    /**
     * Adds a view manager to the registry
     *
     * @param viewManager {unify.view.ViewManager} View manager to add
     */
    add : function(viewManager)
    {
      var registry = this.__viewManagers;
      var id = viewManager.getId();
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (registry[id]) {
          throw new Error("Already registered: " + id);
        }
      }
      
      this.debug("Register ViewManager: " + viewManager);
      registry[id] = viewManager;

      var elem=viewManager.getElement();
      qx.bom.element2.Class.add(elem,'popover');
      // Move to root
      if (viewManager.isCreated()) {
        this.__root.appendChild(elem);
      }
    },
    
    
    /**
     * Removes a view manager to the registry
     *
     * @param viewManager {unify.view.ViewManager} View manager to remove
     */
    remove : function(viewManager)
    {
      var registry = this.__viewManagers;
      var id = viewManager.getId();
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!registry[id]) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      
      this.debug("Unregister ViewManager: " + viewManager);
      if(this.__visibleViewManagers.indexOf(viewManager)>-1){
        //hide it before removing it
        this.hide(id);
      }
      delete registry[id];
      var elem = viewManager.getElement();
      qx.bom.element2.Class.remove(elem,'popover');
      if (viewManager.isCreated()) 
      {

        if (elem.parentNode == this.__root) {
          this.__root.removeChild(elem);
        }
      }
    },
    
    
    /**
     * Shows the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     */
    show : function(id)
    {
      var registry = this.__viewManagers;
      var viewManager = registry[id];
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      
      this.debug("Show: " + id);
      
      var elem = viewManager.getElement();
      if (elem.parentNode != this.__root) {
        this.__root.appendChild(elem);
      }

      this.__visibleViewManagers.push(viewManager);
      this.__sortPopOvers();
    },
    
    
    /**
     * Hides the view manager with the given ID.
     *
     * @param id {String} ID of view manager
     */
    hide : function(id)
    {
      var registry = this.__viewManagers;
      var viewManager = registry[id];
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (!viewManager) {
          throw new Error("Unknown view manager: " + id);
        }
      }
      
      if (this.__visibleViewManagers.indexOf(viewManager) < 0) {
        throw new Error("View Manager with ID '" + id + "' is not visible!");
      }

      var elem=viewManager.getElement();
      elem.style.zIndex='';
      elem.style.display='';//hides element because popover class defaults to display: none
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
    this.__root = this.__viewManager = null;
    qx.event.Registration.removeListener(blocker,'tap',this.__unblock,this);
  } 
});