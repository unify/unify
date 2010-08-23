/* ************************************************************************

	 Tweet

	 Copyright:
		 2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Allows the user to write new status updates.
 */
qx.Class.define("tweet.view.mobile.Compose",
{
	extend : unify.view.mobile.StaticView,
	type : "singleton",

	members :
	{
		__message : null,
		__button : null,
		__countdown : null,
		__requestId : null,
		__content : null,
		
		
		
		/*
		---------------------------------------------------------------------------
			VIEW INTERFACE
		---------------------------------------------------------------------------
		*/
		
		// overridden
		getTitle : function(type, param) {
			return "New Tweet";
		},		
		
		
		// overridden
		isModal : function() {
			return true;
		},
		
		
		// overridden
		_createView : function() 
		{
			var layer = new unify.ui.mobile.Layer(this);

			var titlebar = new unify.ui.mobile.TitleBar(this);
			titlebar.add({ label : "Send", exec : "send", target : "right" });
			layer.add(titlebar);
			
			var content = this.__content = new unify.ui.mobile.Content;
			content.add('<textarea/><span class="countdown">140</span>');
			layer.add(content);
			
			this.__message = content.query("textarea");
			this.__countdown = content.query(".countdown");
			
			// Attach to input event
			var Registration = qx.event.Registration;
			Registration.addListener(this.__message, "input", this.__onFieldInput, this);

			// Connect to Twitter
			var TwitterAuth = tweet.business.TwitterAuth.getInstance();
			TwitterAuth.addListener("completed", this.__onTwitterCompleted, this);
			
			return layer;
		},
		
		
		
		
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/
				
		/**
		 * Executed when clicking on the send button. 
		 * 
		 * @param e {qx.event.type.Mouse} The mouse event
		 */
		send : function(e)
		{
			if (!this.__requestId)
			{
				var TwitterAuth = tweet.business.TwitterAuth.getInstance();
				this.__requestId = TwitterAuth.post("send", null, "status=" + encodeURIComponent(this.__message.value));
			}
		},
		
				
		
		
		/*
		---------------------------------------------------------------------------
			EVENT LISTENER
		---------------------------------------------------------------------------
		*/		
		
		/**
		 * Executed when the user types into the text field. Updates the 
		 * countdown to show how many characters left. 
		 * 
		 * @param e {qx.event.type.Input} Input event
		 */
		__onFieldInput : function(e) {
			this.__countdown.innerHTML = (140 - this.__message.value.length);
		},
		
		
		/**
		 * Executed when the twitter status was updated.
		 * 
		 * @param e {unify.business.CompletedEvent} Business event
		 */
		__onTwitterCompleted : function(e)
		{
			if (e.getId() != this.__requestId) {
				return;
			}
			
			// Cleanup
			this.__requestId = null;
						
			// Clear message
			this.__message.value = "";

			// Force refresh of dependent lists
			var TwitterAuth = tweet.business.TwitterAuth.getInstance();
			TwitterAuth.get("updates");
			TwitterAuth.get("sent");
		}
	}
});
