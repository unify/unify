/* ************************************************************************

   kitchensink

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(kitchensink/*)

************************************************************************ */

/**
 * Unify application class
 */
core.Class("kitchensink.Application",
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
      document.title = "kitchensink";

      // Create view managers
      var MasterViewManager = new unify.view.ViewManager("master");

      // Register your view classes...
      MasterViewManager.register(kitchensink.view.Start, true);
      MasterViewManager.register(kitchensink.view.Ui);
      
      var ModalViewManager = new unify.view.ViewManager("modal");
      ModalViewManager.setDisplayMode("modal");
      ModalViewManager.register(kitchensink.view.Modal);

      // Add TabViews or SplitViews...
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.register(kitchensink.view.Start);
      TabView.register(kitchensink.view.Ui);

      // Add view manager (or SplitView or TabView) to the root
      this.add(TabView);

      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.register(MasterViewManager);
      Navigation.register(ModalViewManager);
      Navigation.init();
    },
    
    _getTheme : function() {
      return new unify.theme.Dark();
    }
  }
});
