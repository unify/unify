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
qx.Class.define("unify.view.mobile.Navigation",
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
    add : function(viewManager)
    {
      this.debug("Register ViewManager: " + viewManager.getId());
      this.__viewManagers[viewManager.getId()] = viewManager;
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

      if (!path) {
        path = this.__defaultView;
      }

      History.init(path);
    },


    parseFragment : function(fragment)
    {
      var match = this.__urlMatcher.exec(fragment);
      return {
        view : RegExp.$1,
        segment : RegExp.$3,
        param : RegExp.$5
      };
    },
    
    
    /**
     * Goes to the given relative path starting with the end of the given manager's path
     * 
     * @param relativePath {Map[]} Array with maps with the keys view, segment and param
     * @param parentManager {unify.view.mobile.ViewManager} View manager instance
     * 
     */
    go : function(relativePath, parentManager)
    {
      // dest = {view, segment, param}
      // parent = view manager instance
      
      var path = [];
      var managers = this.__viewManagers;
      for (var id in managers) 
      {
        manager = managers[id];
        console.debug("PART", manager.getPath())
        
        path.push.apply(manager.getPath(), path);
        if (manager == parentManager) {
          break;
        }
      }
      
      path.push(relativePath);
      
      
      this.debug("Parent Path: " + path.join("=>"));
      
    },
    
    
    



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */
    
    __urlMatcher : /^([a-z-]+)(\.([a-z-]+))?(\:([a-zA-Z0-9_-]+))?$/,
    



    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e)
    {
      var History = e.getTarget();

      // Quick check: Don't allow empty paths
      var currentLocation = decodeURI(e.getLocation());
      if (currentLocation == "")
      {
        this.warn("Ignoring empty path");
        return;
      }

      var oldLocation = this.__location || "";
      if (currentLocation == oldLocation) {
        return;
      }
      this.__location = currentLocation;
      

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

      var currentSplits = currentLocation == "" ? [] : currentLocation.split("/");
      var oldSplits = oldLocation == "" ? [] : oldLocation.split("/");
      
      // Create new data structure mapping managers to their individual structure
      var managers = this.__viewManagers;
      var structure = {};
      for (var id in managers) {
        structure[id] = [];
      }
      
      // Process current path
      for (var i=0, l=currentSplits.length; i<l; i++) 
      {
        var match = this.__urlMatcher.exec(currentSplits[i]);
        var view = RegExp.$1;
        var segment = RegExp.$3;
        var param = RegExp.$5;
        
        //var parsed = this.parseFragment(currentSplits[i]);
        //var found = false;
        
        for (var id in managers) 
        {
          var viewClass = managers[id].getById(view);
          if (viewClass) 
          {
            structure[id].push({
              view : viewClass,
              segment : segment,
              param : param
            });

            view = null;
            break;
          }
        }
        
        if (view) {
          throw new Error("Unknown view: " + view);
        }
      }
      
      
      // Update managers
      for (var id in structure) {
        managers[id].update(structure[id]);
      }
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
