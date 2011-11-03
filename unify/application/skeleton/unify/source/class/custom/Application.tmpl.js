/* ************************************************************************

   ${Name}

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(${NamespacePath}/*)

************************************************************************ */

/**
 * Unify application class
 */
qx.Class.define("${Namespace}.Application", 
{
  extend : unify.Application,
  
  members : 
  {
    // overridden
    main : function() 
    {
      // Call super class
      this.base(arguments);
      
      // Set theme
      qx.theme.manager.Meta.getInstance().setTheme(unify.theme.Dark);
      
      // Configure application
      document.title = "${Name}";
      
      // Create view managers
      var MasterViewManager = new unify.view.ViewManager("master");
      
      // Register your view classes...
      MasterViewManager.add(${Namespace}.view.Start, true);
      
      // Add TabViews or SplitViews...
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.add(${Namespace}.view.Start);
      
      // Add view manager (or SplitView or TabView) to the root
      this.add(TabView);
      
      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.init();
    }
  }
});
