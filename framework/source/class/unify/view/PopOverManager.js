/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2011 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

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
    
    this.__viewManagers = {};
  },
  
  

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */
    
  members :
  {
    __viewManagers : {},
    
    has : function(viewManager) {
      return !!this.__viewManagers[viewManager.getId()];
    },
    
    add : function(viewManager)
    {
      var registry = this.__viewManagers;
      var id = viewManager.getId();
      
      if (registry[id]) {
        throw new Error("Already registered: " + id);
      }
      
      this.debug("Register ViewManager: " + viewManager);
      registry[id] = viewManager;
      
      // Move to root
      if (viewManager.isCreated()) {
        document.body.appendChild(viewManager.getElement());
      }
      
    },
    
    remove : function(viewManager)
    {
      var registry = this.__viewManagers;
      var id = viewManager.getId();
      
      if (!registry[id]) {
        throw new Error("Unknown view manager: " + id);
      }
      
      this.debug("Unregister ViewManager: " + viewManager);
      delete registry[id];
      
      if (viewManager.isCreated()) {
        document.body.removeChild(viewManager.getElement());
      }
    }
  }
})