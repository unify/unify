/* ************************************************************************

	 Tweet

	 Copyright:
		 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Business layer for authentificated Twitter APIs
 */
qx.Class.define("tweet.business.TwitterAuth",
{
	extend : unify.business.RemoteData,
	type : "singleton",
	
	construct : function()
	{
		this.base(arguments);
		
		// Activate authentification
		this.setAuthMethod("basic");
		
		// Send to account
		this._addService("send", {url: "http://twitter.com/statuses/update.json"});
		
		// Read from account
		this._addService("updates", {url: "http://twitter.com/statuses/friends_timeline.json", keep: 60*10}); // 10 minutes
		this._addService("sent", {url: "http://twitter.com/statuses/user_timeline.json", keep: 60*10}); // 10 minutes
		this._addService("friends", {url: "http://twitter.com/statuses/friends.json", keep: 60*10}); // 10 minutes
		this._addService("followers", {url: "http://twitter.com/statuses/followers.json", keep: 60*10}); // 10 minutes
	}
});
