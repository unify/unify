/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Basic view for desktop-class applications in Unify.
 */
qx.Class.define("tweet.view.desktop.Abstract",
{
	extend : qx.core.Object,
	include : [qx.locale.MTranslation, qx.ui.core.MBuilder],

	members :
	{
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/

		/** {qx.ui.tabview.Page} Stores the TabPage instance of the view. */
		__page : null,


		/**
		 * Returns the layer of this view.
		 *
		 * @return {qx.ui.tabview.Page} TabPage instance
		 */
		getPage : function() {
			return this.__page;
		},


		/**
		 * Whether the DOM reprensentation of this view is created.
		 *
		 * @return {Boolean} <code>true</code> when the layer is created
		 */
		isCreated : function() {
			return !!this.__page;
		},
		
		
		
		
		/*
		---------------------------------------------------------------------------
			LIFECYCLE SUPPORT
		---------------------------------------------------------------------------
		*/			

		/**
		 * Create the DOM representation of the view
		 */
		create : function()
		{
			if (qx.core.Variant.isSet("qx.debug", "on"))
			{
				if (this.__page) {
					throw new Error(this.toString + ": Is already created!");
				}
			}

			// Create and store layer reference
			this.__page = this._createView();
		},		
		
		
		
		/*
		---------------------------------------------------------------------------
			OVERRIDEABLE INTERFACE
		---------------------------------------------------------------------------
		*/		

		/**
		 * Method which creates the tab page required by {@link #getTabPage}. This should
		 * be overwritten in derived classes to create the visual representation as
		 * needed.
		 *
		 * @return {qx.ui.tabview.Page} Return the tab instance of this view.
		 */
		_createView : function()
		{
			if (qx.core.Variant.isSet("qx.debug", "on")) {
				throw new Error(this.toString() + " needs implementation for _createView()!")
			}
		}		 
	}	 
});
