/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/* ************************************************************************

#asset(googly/*)

************************************************************************ */

/**
 * Unify application class
 */
qx.Class.define("googly.Application", 
{
  extend : unify.Application,

  members : 
  {
    // overridden
    main : function() 
    {
      // Call super class
      this.base(arguments);
      qx.theme.manager.Meta.getInstance().setTheme(googly.theme.Googly);
      
      // Configure application
      document.title = "Googly";

      // Master view
      var MasterViewManager = new unify.view.ViewManager("master");
      MasterViewManager.register(googly.view.Start, true);
      MasterViewManager.register(googly.view.Translate);
      MasterViewManager.register(googly.view.Search);
      MasterViewManager.register(googly.view.Weather);
      MasterViewManager.register(googly.view.WeatherSearch);
      MasterViewManager.register(unify.view.SysInfo);
      
      // Configure tab view
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.register(googly.view.Start);
      TabView.register(googly.view.Translate);
      TabView.register(googly.view.Search);
      TabView.register(googly.view.Weather);
      TabView.register(unify.view.SysInfo);
      this.add(TabView);
      
      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.register(MasterViewManager);
      Navigation.init();      
    }
  }
});
