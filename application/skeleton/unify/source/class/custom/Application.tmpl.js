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

      // Configure application
      document.title = "${Name}";

      // Create view managers
      var MasterViewManager = new unify.view.ViewManager;
      
      // Register your view classes...
      MasterViewManager.add(${Namespace}.Start);
      
      // Add TabViews or SplitViews...

      // Add view manager (or SplitView or TabView) to the root
      this.add(MasterViewManager);
    }
  }
});
