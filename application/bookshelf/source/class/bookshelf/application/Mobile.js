/* ************************************************************************

   bookshelf

   Copyright:
     2010 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/* ************************************************************************

#asset(bookshelf/mobile/*)

************************************************************************ */

/**
 * Unify application class for mobile devices.
 */
qx.Class.define("bookshelf.application.Mobile", 
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
			document.title = "bookshelf";

			// Register views
			var ViewManager = unify.view.mobile.ViewManager.getInstance();
			ViewManager.add(bookshelf.view.mobile.Start);
			ViewManager.add(bookshelf.view.mobile.ThreeLong);
			ViewManager.add(bookshelf.view.mobile.Two);
			ViewManager.add(bookshelf.view.mobile.Canvas);

			//
			var TabBar = unify.ui.mobile.TabBar.getInstance();
			TabBar.add(bookshelf.view.mobile.Start);
			TabBar.add(bookshelf.view.mobile.ThreeLong);
			TabBar.add(bookshelf.view.mobile.Two);
			TabBar.add(bookshelf.view.mobile.Canvas);
			

			// Initialize navigation
			unify.view.mobile.NavigationManager.getInstance().init();		
		}
	}
});
