/* ************************************************************************

   Googly

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

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

      // Configure application
      document.title = "Googly";

      // Master view
      var MasterViewManager = new unify.view.ViewManager("master");
      MasterViewManager.add(googly.view.Start, true);
      MasterViewManager.add(googly.view.Translate);
      MasterViewManager.add(googly.view.Search);
      MasterViewManager.add(googly.view.Weather);
      MasterViewManager.add(googly.view.WeatherSearch);
      MasterViewManager.add(unify.view.SysInfo);
      
      // Configure tab view
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.add(googly.view.Start);
      TabView.add(googly.view.Translate);
      TabView.add(googly.view.Search);
      TabView.add(googly.view.Weather);
      TabView.add(unify.view.SysInfo);
      this.add(TabView);
      
      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.init();      
    }
  }
});
