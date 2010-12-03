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
    
    // App ID is used e.g. for storage of navigation
    var app = qx.core.Setting.get("qx.application");
    this.__appId = app.substring(0, app.indexOf("."));
    
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
    /** {String} Unique name of the application */
    __appId : null,
    
    
    
    /*
    ---------------------------------------------------------------------------
      VIEW MANAGER MANAGMENT
    ---------------------------------------------------------------------------
    */
    
    /** 
     * {Map} Maps ID of viewManager to the viewManager instance. IDs must be unique
     * in each navigation object.
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
      var managerId = viewManager.getId();
      
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (this.__viewManagers[managerId]) {
          throw new Error("ViewManager ID is already used: " + managerId);
        }
      }
      
      this.__viewManagers[managerId] = viewManager;
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
        path = localStorage[this.__appId + "/navigationpath"];
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
    
    /** {Map[]} List of maps with the keys: view, segment and param */
    __path : null,
    
    
    navigate : function(path)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {      
        if (!(path instanceof unify.view.Path)) {
          throw new Error("Invalid path to navigate() to: " + path);
        }
      }
      
      var usedManagers = {};
      var lastManagerId = null;
      var managers = this.__viewManagers;
      var managerPath = new unify.view.Path;
      
      for (var i=0, l=path.length; i<l; i++)
      {
        var fragment = path[i];
        
        for (var managerId in managers) 
        {
          var viewManager = managers[managerId];
          var viewObj = viewManager.getView(fragment.view);
          if (viewObj) {
            break;
          }
        }
        
        if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          if (!viewObj) {
            throw new Error("Could not find view: " + fragment.view);
          }
        }

        if (!lastManagerId) {
          lastManagerId = managerId;
        }
        
        if (managerId == lastManagerId)
        {
          managerPath.push(fragment);
        }
        else
        {
          if (qx.core.Variant.isSet("qx.debug", "on"))
          {
            if (managerId in usedManagers) {
              throw new Error("View manager was re-used in two different path. Invalid segment!");
            }
          }
          
          // Update last manager
          managers[lastManagerId].navigate(managerPath);

          // Reset manager path
          managerPath = new unify.view.Path(fragment);

          // Remember all used managers (for validity analysis)
          usedManagers[managerId] = true;
          
          // Rotate variable
          lastManagerId = managerId;
        }
      }
      
      // Process with last one
      viewManager.navigate(managerPath);
    },
    
    
    /**
     * Syncs the current path with the browser environment (for bookmarking, etc.)
     */
    __syncPath : function()
    {
      var joined = this.__path.serialize();
      var hash = "#" + joined;
      if (hash != location.hash) {
        location.hash = hash;
      }
      
      if (window.localStorage) {
        localStorage[this.__appId + "/navigationpath"] = joined;
      }      
    },
        
    
    /**
     * Reacts on (local) path changes of all registered view managers
     * 
     * @param e {qx.event.type.Event} Event object
     */
    __onSubPathChange : function(e)
    {
      var changed = e.getTarget();
      var reset = false;
      var path = this.__path = new unify.view.Path;
      
      var viewManagers = this.__viewManagers;
      for (var id in viewManagers)
      {
        var manager = viewManagers[id];
        if (reset) {
          manager.reset();
        }
        
        if (manager.getPath() instanceof unify.view.Path) {
          //path.push.apply(path, manager.getPath());
        } else if (manager.getPath() != null){
          throw new Error("Invalid path: " + manager.getPath())
        }
        
        var localPath = manager.getPath();
        if (localPath != null)
        {
          for (var i=0, l=localPath.length; i<l; i++) {
            path.push(localPath[i])
          }
        }
        
        // Reset all managers after the changed one
        if (manager == changed) {
          reset = true;
        }
      }
      
      this.__syncPath();
    },


    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e)
    {
      // Quick check: Don't allow empty paths
      var currentLocation = decodeURI(e.getLocation());
      if (currentLocation == "")
      {
        this.warn("Ignoring empty path");
        return;
      }

      var fragments = currentLocation.split("/");
      var path = new unify.view.Path;
      for (var i=0, l=fragments.length; i<l; i++) {
        path.push(unify.view.Path.parseFragment(fragments[i]));
      }
      
      this.navigate(path);
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
