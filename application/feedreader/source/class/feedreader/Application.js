/* ************************************************************************

   feedreader

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(feedreader/*)

************************************************************************ */

/**
 * Unify application class
 */
qx.Class.define("feedreader.Application", 
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
      document.title = "feedreader";

      // Master view
      var MasterViewManager = new unify.view.ViewManager("master");
      MasterViewManager.add(feedreader.view.Start);
      
      
      // Configure tab view
      var TabView = new unify.view.TabViewManager;
      TabView.add(MasterViewManager);
      this.add(TabView);
      

      
      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.init();      
    }
  }
});
