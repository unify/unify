/* ************************************************************************

   flicky

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(flicky/*)

************************************************************************ */

/**
 * Flickr Browser
 */
qx.Class.define("flicky.Application",
{
  extend : unify.Application,

  members :
  {
    // overridden
    main : function()
    {
      // Call super class
      this.base(arguments);

      document.title = "flicky";

      var MasterViewManager = new unify.view.ViewManager("master");
      MasterViewManager.add(flicky.view.Start, true);
      MasterViewManager.add(flicky.view.Recent);
      MasterViewManager.add(flicky.view.Interesting);

      var DetailViewManager = new unify.view.ViewManager("detail");
      DetailViewManager.add(flicky.view.Info, true);
      DetailViewManager.add(flicky.view.Photo);

      var SplitViewManager = new unify.view.SplitViewManager(MasterViewManager, DetailViewManager);
      this.add(SplitViewManager);

      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.add(DetailViewManager);
      Navigation.init();
    }
  }
});
