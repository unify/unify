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
     * Applies correct zIndex to all visible pop-overs.
     */
    __sortPopOvers : function()
    {
      var visible = this.__visibleViewManagers;
      for (var i=0, l=visible.length; i<l; i++) {
        visible[i].getElement().style.zIndex = 1000 + i;
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
      
      // Move to root
      if (viewManager.isCreated()) {
        this.__root.appendChild(viewManager.getElement());
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
      delete registry[id];
      
      if (viewManager.isCreated()) 
      {
        var viewManagerElem = viewManager.getElement();
        if (viewManagerElem.parentNode == this.__root) {
          this.__root.removeChild(viewManagerElem);
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

      viewManager.show();
      
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
      
      if (this.__visibleViewManagers.indexOf(viewManager) != -1) {
        throw new Error("View Manager with ID '" + id + "' is not visible!");
      }
      
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
    this.__root = this.__viewManager = null;
  } 
})