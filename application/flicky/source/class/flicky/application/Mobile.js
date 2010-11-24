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

      var MainViewManager = new unify.view.mobile.ViewManager(DetailViewManager);
      MainViewManager.add(flicky.view.mobile.Start);
      MainViewManager.add(flicky.view.mobile.Recent);
      MainViewManager.add(flicky.view.mobile.Interesting);
      
      this.__mainViewManager = MainViewManager;

      
      // Configure tab bar
      // var TabBar = unify.ui.mobile.TabBar.getInstance();
      // TabBar.add(flicky.view.mobile.Start);
      // TabBar.add(flicky.view.mobile.Recent);
      // TabBar.add(flicky.view.mobile.Interesting);
      
      // Initialize navigation
      // unify.view.mobile.NavigationManager.getInstance().init();   
      
      var NavigationManager = new unify.view.mobile.NavigationManager(MainViewManager);
      
      NavigationManager.addListener("navigate", this.__onNavigate, this);
      
      
    },


    /**
     * Event listener for navigation changes
     *
     * @param e {qx.event.type.Data} Navigation event
     */
    __onNavigate : function(e)
    {
      this.__mode = e.getMode();
      
      var MainViewManager = this.__mainViewManager;

      var path = e.getPath();
      var view = MainViewManager.getById(path.getView());
      view.setSegment(path.getSegment());
      view.setParam(path.getParam());

      MainViewManager.setView(view);
    }
  }
});
