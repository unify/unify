/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

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

      // Configure application
      document.title = "Flicky";

      // Create views
      var MasterViewManager = new unify.view.ViewManager("mmaster");
      MasterViewManager.add(flicky.view.Start, true);
      MasterViewManager.add(flicky.view.Recent);
      MasterViewManager.add(flicky.view.Interesting);

      var DetailViewManager = new unify.view.ViewManager("mdetail");
      DetailViewManager.add(flicky.view.Info, true);
      DetailViewManager.add(flicky.view.Photo);
      
      var MetaViewManager = new unify.view.ViewManager("mmeta");
      MetaViewManager.add(flicky.view.Meta, true);
      MetaViewManager.add(flicky.view.Owner);
      MetaViewManager.add(flicky.view.Location);
      MetaViewManager.setDisplayMode('popover');

      var SplitViewManager = new unify.view.SplitViewManager(MasterViewManager, DetailViewManager);
      this.add(SplitViewManager);

      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.add(DetailViewManager);
      Navigation.init();
    }
  }
});
