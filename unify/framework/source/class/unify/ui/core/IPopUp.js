/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2013 Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * Interface for pop ups
 */
core.Interface("unify.ui.core.IPopUp", {
	
	members : {
		/**
		 * should be used to determine what kind of popup is used.
		 * atm we differ between 3 types : Modal, PopUp, Info
		 * Modal is used to force the user handling the popup
		 * PopUp is used without the forcing.
		 * It has, however, a blocker to register events outside the PopUp.
		 * Info should be used as a notification without any direct user interaction.
		 * It is basically a PopUp wihtout the blocker.
		 */
		getPopUpType : function(){}
	}
});