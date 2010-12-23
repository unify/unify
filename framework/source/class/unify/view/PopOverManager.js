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
    
    this.__root = document.body;
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
      
      if (viewManager.isCreated()) {
        this.__root.removeChild(viewManager.getElement());
      }
    },
    
    
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
      
      var elem = viewManager.getElement();
      if (elem.parentNode != this.__root) {
        this.__root.appendChild(elem);
      }
      
      elem.style.display = "block";
    },
    
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
      
      if (viewManager.isCreated())
      {
        var elem = viewManager.getElement();
        elem.style.display = "none";      
      }
    }
  }
})