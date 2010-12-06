/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ************************************************************************

#asset(tweet/mobile/*)

************************************************************************ */

/**
 * Twitter application class
 */
qx.Class.define("tweet.Application",
{
  extend : unify.Application,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      APPLICATION CORE
    ---------------------------------------------------------------------------
    */

    // overridden
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Initialize Twitter business object
      var TwitterAuth = tweet.business.TwitterAuth.getInstance();
      TwitterAuth.setUser("telekomria");
      TwitterAuth.setPassword("32u8AH555wKdQvhqgZZ9");
      
      // Set up
      document.title = "Tweet";

      var MasterViewManager = new unify.view.ViewManager("master");
      MasterViewManager.add(tweet.view.Timeline, true);
      MasterViewManager.add(tweet.view.Status);
      MasterViewManager.add(tweet.view.Compose);
      MasterViewManager.add(tweet.view.Userlist);
      MasterViewManager.add(tweet.view.User);
      MasterViewManager.add(tweet.view.Search);

      // Configure tab bar
      // var TabBar = unify.ui.TabBar.getInstance();
      // TabBar.add(tweet.view.Timeline);
      // TabBar.add(tweet.view.Userlist);
      // TabBar.add(tweet.view.Search);

      var Navigation = unify.view.Navigation.getInstance();
      Navigation.add(MasterViewManager);
      Navigation.init();
    }
  }
});
