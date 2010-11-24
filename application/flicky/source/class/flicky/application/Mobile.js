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
      
      var DetailViewManager = new unify.view.mobile.ViewManager;
      DetailViewManager.add(flicky.view.mobile.Detail);

      var MasterViewManager = new unify.view.mobile.ViewManager(DetailViewManager);
      MasterViewManager.add(flicky.view.mobile.Start);
      MasterViewManager.add(flicky.view.mobile.Recent);
      MasterViewManager.add(flicky.view.mobile.Interesting);
      
      this.__masterViewManager = MasterViewManager;
      
      
      var SplitViewManager = new unify.view.mobile.SplitViewManager(MasterViewManager, DetailViewManager);
      

      
      // Configure tab bar
      // var TabBar = unify.ui.mobile.TabBar.getInstance();
      // TabBar.add(flicky.view.mobile.Start);
      // TabBar.add(flicky.view.mobile.Recent);
      // TabBar.add(flicky.view.mobile.Interesting);
      
      // Initialize navigation
      // unify.view.mobile.NavigationManager.getInstance().init();   
      
      var NavigationManager = new unify.view.mobile.NavigationManager(MasterViewManager, "start");
      NavigationManager.addListener("navigate", this.__onNavigate, this);
      NavigationManager.init();
    },


    /**
     * Event listener for navigation changes
     *
     * @param e {qx.event.type.Data} Navigation event
     */
    __onNavigate : function(e)
    {
      this.__mode = e.getMode();
      
      var MasterViewManager = this.__masterViewManager;

      var path = e.getPath();
      var view = MasterViewManager.getById(path.getView());
      view.setSegment(path.getSegment());
      view.setParam(path.getParam());

      this.debug("Navigate: " + view);
      MasterViewManager.setView(view);
    }
  }
});
