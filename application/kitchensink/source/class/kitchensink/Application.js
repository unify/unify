/* ************************************************************************

   kitchensink - unify demo app

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Unify application class
 */
qx.Class.define("kitchensink.Application", 
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
      document.title = "kitchensink";
      
      // Create view managers
      var MasterViewManager = new unify.view.ViewManager("master");
      
      // Register your view classes...
      MasterViewManager.add(kitchensink.view.Start, true);
      MasterViewManager.add(kitchensink.view.Uicomponents);
      MasterViewManager.add(kitchensink.view.Widgets);
      MasterViewManager.add(unify.view.SysInfo);
      /* 
      ==========
      | AGENDA |
      ==========
      
      Underlying Concepts
      -------------------
      - qooxdoo
      - build system
      - class structure and inheritance
      - MVP structure and event circulation
      - i18n
      - Unify DOM handling
      - basic application structure
      
      UI concepts
      -----------
      - view managers (tabview, splitview, popover, remoteview)
      - navigation, URL and history management
      - touch and gesture handling
      - CSS3 and animations
      - styling with SASS, predefined mixins etc.
      - theming
      - UI events (appear, _resumeView etc.)
      
      UI components
      -------------
      - Containers, Views and Popovers
      - Forms and Buttons
      - Templates
      
      Data handling
      -------------
      - business and data objects
      - remote data, caching and remoteviews
      - storage
      - XML to JSON
      - Yql
      
      */
      
      // Add TabViews or SplitViews...
      var TabView = new unify.view.TabViewManager(MasterViewManager);
      TabView.add(kitchensink.view.Start);
      TabView.add(kitchensink.view.Widgets);
      TabView.add(unify.view.SysInfo);
      
      // Add view manager (or SplitView or TabView) to the root
      this.add(TabView);
      
      // Add at least one view manager to the navigation managment
      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.init();
    }
  }
});
