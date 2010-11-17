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

      // Register views
      var ViewManager = unify.view.mobile.ViewManager.getInstance();
      ViewManager.add(flicky.view.mobile.Start);
      ViewManager.add(flicky.view.mobile.Recent);

      // Configure tab bar
      var TabBar = unify.ui.mobile.TabBar.getInstance();
      TabBar.add(flicky.view.mobile.Start);
      TabBar.add(flicky.view.mobile.Recent);
      
      // Initialize navigation
      unify.view.mobile.NavigationManager.getInstance().init();   
    }
  }
});
