/* ************************************************************************

   ${Name}

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(${NamespacePath}/mobile/*)

************************************************************************ */

/**
 * Unify application class for mobile devices.
 */
qx.Class.define("${Namespace}.application.Mobile", 
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
      document.title = "${Name}";

      // Register views
      var ViewManager = unify.view.mobile.ViewManager.getInstance();
      ViewManager.add(${Namespace}.view.mobile.Start);
      ViewManager.add(unify.view.mobile.SysInfo);

      // Initialize navigation
      unify.view.mobile.NavigationManager.getInstance().init();   
    }
  }
});
