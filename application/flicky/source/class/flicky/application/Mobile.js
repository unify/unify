/* ************************************************************************

   flicky

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(flicky/mobile/*)

************************************************************************ */

/**
 * Unify application class for mobile devices.
 */
qx.Class.define("flicky.application.Mobile", 
{
  extend : unify.application.Mobile,

  members : 
  {
    // overridden
    main : function() 
    {
      // Call super class
      this.base(arguments);

      // Configure application
      document.title = "flicky";
      
      var MasterViewManager = new unify.view.mobile.ViewManager("master");
      MasterViewManager.add(flicky.view.mobile.Start, true);
      MasterViewManager.add(flicky.view.mobile.Recent);
      MasterViewManager.add(flicky.view.mobile.Interesting);

      var DetailViewManager = new unify.view.mobile.ViewManager("detail");
      DetailViewManager.add(flicky.view.mobile.Info, true);
      DetailViewManager.add(flicky.view.mobile.Photo);
      
      var SplitViewManager = new unify.view.mobile.SplitViewManager(MasterViewManager, DetailViewManager);
      this.add(SplitViewManager);
      
      // Configure tab bar
      // var TabBar = unify.ui.mobile.TabBar.getInstance();
      // TabBar.add(flicky.view.mobile.Start);
      // TabBar.add(flicky.view.mobile.Recent);
      // TabBar.add(flicky.view.mobile.Interesting);
      
      // Intialize navigation
      var Navigation = unify.view.mobile.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.add(DetailViewManager);
      Navigation.init();
    }
  }
});
