/* ************************************************************************

   coretest

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(coretest/*)

************************************************************************ */

core.Env.define("application", "coretest.Application");

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

      // Add TabViews or SplitViews...
      /*var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.register(coretest.view.Start);

      // Add view manager (or SplitView or TabView) to the root
      this.add(TabView);*/

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
