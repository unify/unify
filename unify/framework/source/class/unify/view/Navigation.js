/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * Manager for navigation of typical iPhone-like applications.
 */
core.Class("unify.view.Navigation",
{
  
  include : [unify.core.Object],

  /*
  ----------------------------------------------------------------------------
     CONSTRUCTOR
  ----------------------------------------------------------------------------
  */

  construct : function()
  {
    unify.core.Object.call(this);
    // Initialize storage
    this.__viewManagers = {};
  },




  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  members :
  {
    __historyInit : null,
    __serializedPath : null,
  
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
     * id of the start view. Used if no valid view has been found for this navigation
     */
    __startPath : null,

    /**
     * Adds a view manager to the global navigation. All views
     * of this view manager will be globally accessible by their name.
     *
     * @param viewManager {unify.view.ViewManager} View manager instance
     */
    register : function(viewManager)
    {
      var managerId = viewManager.getId();

      if (core.Env.getValue("debug"))
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
      var path = unify.bom.Storage.get("navigation-path");
      var pathObj=unify.view.Path.fromString(path);
      
      if(!this.isValidNavigationPath(pathObj)){
        if(core.Env.getValue("debug")){
          this.debug("stored path is invalid, using default path instead");
          path="";
        }
      }
      // Call history to initialize application
      this.__historyInit = true;
      if(path){
        History.init(path);
      } else {
        History.init(this.__startPath);
      }
      delete this.__historyInit;
    },
    
    /**
     * Sets the start view for theis navigation.
     * The start view will be used if Navigation.init doesn't find a
     * suitable view.
     * @param viewClass {Class} Class of the view which should be the start view
     */
    setStartView : function(viewClass){
      var instance = viewClass.getInstance();
      var classname = viewClass.className;
      var id = classname.substring(classname.lastIndexOf(".")+1).hyphenate().substring(1).toLowerCase();
      this.__startPath = id;
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

    /** {unify.view.Path} Path object which stores the complete application path */
    __path : null,

    /**
     * Navigates to the given path. Automatically distributes sub paths
     * to the responsible view managers.
     *
     * @param path {unify.view.Path} Path object
     */
    navigate : function(path)
    {
      if (core.Env.getValue("debug"))
      {
        if (!(path instanceof unify.view.Path)) {
          throw new Error("Invalid path to navigate() to: " + path);
        }
      }

      if(!this.isValidNavigationPath(path)){
        throw new Error("invalid path: "+path.serialize());
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

        if (core.Env.getValue("debug"))
        {
          if (!viewObj) 
          {
            // Navigate to valid path before throwing an exception
            viewManager.navigate(managerPath);
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
          if (core.Env.getValue("debug"))
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
     * tests if path is valid for navigation
     * 
     * to be valid, 
     * 1. all mentioned views need to registered with a viewmanager that is registered for navigation
     * 2. all views that belong to the same viewmanager have to be a continous subarray 
     * eg. 
     * ViewManager 1 has views foo and bar, ViewManager 2 has view baz
     * valid: foo/bar/baz , foo/bar , foo/baz, /baz/foo/bar
     * invalid: foo/baz/bar
     * 
     * @param path {unify.view.Path} Path object
     * @return {Boolean] true, if the path is valid for navigation
     */
    isValidNavigationPath: function(path){
      var usedManagers = {};
      var lastManagerId = null;
      var managers = this.__viewManagers;

      for (var i=0, l=path.length; i<l; i++)
      {
        var fragment = path[i];
        var viewId=fragment.view;
        var view=null;
        for (var managerId in managers)
        {
          var viewManager = managers[managerId];
          view = viewManager.getView(viewId);
          if (view) {
            break;
          }
        }
        if(!view){
          if (core.Env.getValue("debug")){
            this.debug("invalid path: no viewmanager found that has view with id "+viewId);
          }
          return false;
        }

        if (managerId != lastManagerId)
        {
          if (managerId in usedManagers) {
            if (core.Env.getValue("debug")){
              this.debug("invalid path: views of viewmanager "+managerId+" occur in different sections");
            }
            return false;
          } else {
            // Remember all used managers (for validity analysis)
            usedManagers[managerId] = true;
  
            // Rotate variable
            lastManagerId = managerId;
          }
        }
      }
      return true;
    },
    
    /**
     * Reacts on (local) path changes of all registered view managers
     *
     * @param e {lowland.events.Event} Event object
     */
    __onSubPathChange : function(e)
    {
      // Do not react on useless changes during initialization phase
      if (this.__historyInit) {
        return;
      }

      var path = this.__path = new unify.view.Path;

      var viewManagers = this.__viewManagers;
      for (var id in viewManagers)
      {
        var manager = viewManagers[id];

        var localPath = manager.getPath();
        if (localPath != null)
        {
          for (var i=0, l=localPath.length; i<l; i++) {
            path.push(localPath[i])
          }
        }
      }

      var joined = this.__serializedPath = path.serialize();
      unify.bom.History.getInstance().setLocation(joined);

      try {
        unify.bom.Storage.set("navigation-path", joined);
      } catch(ex) {
        this.error('failed to store navigation-path'+ex);
      }
    },


    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e) {
      var currentLocation = e.getData();
      if (currentLocation == null) {
        return;
      }
      currentLocation = decodeURI(currentLocation);
      if (currentLocation != "" && currentLocation != this.__serializedPath) {
        this.navigate(unify.view.Path.fromString(currentLocation));
      }
    }
  }




  /*
  ----------------------------------------------------------------------------
     DESTRUCTOR
  ----------------------------------------------------------------------------
  */

  /*destruct : function()
  {
    var History = unify.bom.History.getInstance();
    History.removeListener("change", this.__onHistoryChange, this);
  }*/
});

unify.core.Singleton.annotate(unify.view.Navigation);
