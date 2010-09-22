/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ************************************************************************

#asset(tweet/desktop/*)

#asset(qx/icon/Tango/32/apps/utilities-text-editor.png)
#asset(qx/icon/Tango/32/apps/internet-messenger.png)
#asset(qx/icon/Tango/32/apps/internet-blog.png)
#asset(qx/icon/Tango/32/apps/preferences-users.png)
#asset(qx/icon/Tango/32/actions/system-run.png)
#asset(qx/icon/Tango/32/actions/system-search.png)
 
#require(qx.log.appender.Native)

************************************************************************ */

/**
 * Twitter application class for the desktop browser.
 */
qx.Class.define("tweet.application.Desktop",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __mainPane : null,
    
    
    
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

      // Set title
      document.title = "Tweet";

			// Initialize Twitter business object
			var TwitterAuth = tweet.business.TwitterAuth.getInstance();
			TwitterAuth.setUser("telekomria");
			TwitterAuth.setPassword("32u8AH555wKdQvhqgZZ9");

      // Add tab view
      var mainPane = this.__mainPane = new qx.ui.tabview.TabView;
      mainPane.setWidth(550);
      mainPane.setBarPosition("left");
      this.getRoot().add(mainPane, {left:16, top:16, bottom:16});

      // Add pages
      this.add(tweet.view.desktop.Compose);
      this.add(tweet.view.desktop.FriendsTimeline);
      this.add(tweet.view.desktop.UserTimeline);
      this.add(tweet.view.desktop.Search);            
    },
  
    add : function(view)
    {
      var instance = view.getInstance();
      instance.create();
      this.__mainPane.add(instance.getPage());
    }
  }
});
