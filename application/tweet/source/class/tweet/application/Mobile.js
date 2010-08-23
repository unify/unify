/* ************************************************************************

	 Tweet

	 Copyright:
		 2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/* ************************************************************************

#asset(tweet/mobile/*)

************************************************************************ */

/**
 * Twitter application class for hero mobile devices.
 */
qx.Class.define("tweet.application.Mobile",
{
	extend : unify.application.Mobile,



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

			// Register views
			var ViewManager = unify.view.mobile.ViewManager.getInstance();
			ViewManager.add(tweet.view.mobile.Timeline);
			ViewManager.add(tweet.view.mobile.Status);
			ViewManager.add(tweet.view.mobile.Compose);
			ViewManager.add(tweet.view.mobile.Userlist);
			ViewManager.add(tweet.view.mobile.User);
			ViewManager.add(tweet.view.mobile.Profile);
			ViewManager.add(tweet.view.mobile.Search);
			ViewManager.add(unify.view.mobile.SysInfo);
			ViewManager.add(tweet.view.mobile.Components);
			
			// Configure tab bar
			var TabBar = unify.ui.mobile.TabBar.getInstance();
			TabBar.add(tweet.view.mobile.Timeline);
			TabBar.add(tweet.view.mobile.Userlist);
			TabBar.add(tweet.view.mobile.Profile);
			TabBar.add(unify.view.mobile.SysInfo);
			TabBar.add(tweet.view.mobile.Components);
			
			// Initialize navigation
			unify.view.mobile.NavigationManager.getInstance().init();
		}
	}
});
