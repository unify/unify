/* ************************************************************************

   coretest

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(coretest/*)

************************************************************************ */

/**
 * Unify application class
 */
core.Class("coretest.Application",
{
  include : [unify.Application],

  members :
  {
    // overridden
    main : function()
    {
      // Call super class
      unify.Application.prototype.main.call(this);

      // Configure application
      document.title = "coretest";

      // Create view managers
      var MasterViewManager = new unify.view.ViewManager("master");

      // Register your view classes...
      MasterViewManager.register(coretest.view.Start, true);
      MasterViewManager.register(coretest.view.Test);
      MasterViewManager.register(coretest.view.OtherTest);

      // Add TabViews or SplitViews...
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.register(coretest.view.Start);
      TabView.register(coretest.view.Test);

      // Add view manager (or SplitView or TabView) to the root
      this.add(TabView);
      //this.add(MasterViewManager);

      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.register(MasterViewManager);
      Navigation.init();
    },
    
    _getTheme : function() {
      return new unify.theme.Dark();
    }
  }
});
