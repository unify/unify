/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ************************************************************************

#require(unify.event.handler.Android)

************************************************************************ */

/**
 * Manager for navigation of typical iPhone-like applications.
 *
 * * Integrates with browser's history managment
 * * Structures the location using "/" as divider for views and ":" for separating parameters.
 * * Supports multiple ways of controlling the location.
 * * Support for TabView like navigation with deep inner navigation
 */
qx.Class.define("unify.view.Navigation",
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
    
    // Initialize storage
    this.__viewManagers = {};
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      VIEW MANAGER MANAGMENT
    ---------------------------------------------------------------------------
    */
    
    __viewManagers : null,
    
        
    /**
     * Adds a view manager to the global navigation. All views
     * of this view manager will be globally accessible by their name.
     * 
     * @param viewManager {unify.view.ViewManager} View manager instance
     */
    add : function(viewManager)
    {
      this.__viewManagers[viewManager.getId()] = viewManager;
      viewManager.addListener("changePath", this.__onSubPathChange, this);
    },
    
    
    /**
     * Initialized previous state from history or client-side storage.
     *
     * Should be called by the application as soon as all views are registered.
     */
    init : function()
    {
      // Connect to history managment
      var History = unify.bom.History.getInstance();
      History.addListener("change", this.__onHistoryChange, this);

      // Restore path from storage or use default view
      var path;
      if (window.localStorage) {
        path = localStorage["unify/navigationpath"];
      }

      // Call history to initialize application
      History.init(path);
      
      // Be sure that every view manager which is part of the navigation is correctly initialized
      var managers = this.__viewManagers;
      for (var id in managers) {
        managers[id].init();
      }
    },
    
    
    /**
     * Returns the view manager which controls the given view
     * 
     * @param viewId {String} ID of view
     * @return {unify.view.ViewManager} Instance of view manager
     */
    getViewManager : function(viewId)
    {
      var managers = this.__viewManagers;
      var manager;
      for (var id in managers) 
      {
        manager = managers[id];
        if (manager.hasView(viewId)) {
          return manager;
        }
      }
      
      return null;
    },




    /*
    ---------------------------------------------------------------------------
      PATH MANAGMENT
    ---------------------------------------------------------------------------
    */
    
    __path : null,
    
    
    getPath : function()
    {
      var path = this.__path;
      var result = [];
      var part, temp;
      for (var i=0, l=path.length; i<l; i++) 
      {
        part = path[i];
        temp = part.view;
        if (part.segment) {
          temp += "." + part.segment;
        }
        if (part.param) {
          temp += ":" + part.param;
        }
        result.push(temp)
      }
      
      result = result.join("/");
      this.debug("Serialized path: " + result);      
      return result;
    },
        
    
    __path : null,
    
    
    /**
     *
     * 
     */
    __onSubPathChange : function(e)
    {
      var changed = e.getTarget();
      var reset = false;
      var resetAgenda = [];

      var path = [];
      var viewManagers = this.__viewManagers;
      for (var id in viewManagers) 
      {
        var manager = viewManagers[id];
        
        if (reset)
        {
          manager.reset(path);
          break;
        }
        else
        {
          path.push.apply(path, manager.getPath());

          if (manager == changed) {
            this.debug("Changed manager was: " + manager.getId())
            reset = true;
          }
        }
      }
      
      
      
      
      this.__path = path;
      this.getPath();
    },


    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e)
    {
      // TODO
      return;

      // Quick check: Don't allow empty paths
      var currentLocation = decodeURI(e.getLocation());
      if (currentLocation == "")
      {
        this.warn("Ignoring empty path");
        return;
      }

      if (window.localStorage)
      {
        try
        {
          // deleting first is required on iPad with OS 3.2
          delete localStorage["unify/navigationpath"];
          localStorage["unify/navigationpath"] = decodeURI(currentLocation);
        }
        catch(ex) {
          this.warn("Could not store path: " + ex);
        }
      }

      this.debug("History Change: \"" + oldLocation + "\" => \"" + currentLocation + "\"");
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var History = unify.bom.History.getInstance();
    History.removeListener("change", this.__onHistoryChange, this);
  }
});
