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

      if (!path) {
        path = this.__defaultView;
      }

      History.init(path);
      
      var viewManagers = this.__viewManagers;
      for (var viewManagerId in viewManagers) {
        this.__viewManagers[viewManagerId].init();
      }
    },
    
    
    
    __onSubPathChange : function(e)
    {
      var path = [];
      var viewManagers = this.__viewManagers;
      for (var viewManagerId in viewManagers) {
        path.push.apply(path, viewManagers[viewManagerId].getPath());
      }

      // Serialize
      var result = [];
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
    },


    parseFragment : function(fragment)
    {
      var match = this.__urlMatcher.exec(fragment);
      return {
        view : RegExp.$1 || null,
        segment : RegExp.$3 || null,
        param : RegExp.$5 || null
      };
    },
    
    

    

    __urlMatcher : /^([a-z-]+)(\.([a-z-]+))?(\:([a-zA-Z0-9_-]+))?$/,
    

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


    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e)
    {
      // TODO
      return;


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
