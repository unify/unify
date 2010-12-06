/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Business layer for anonymous Twitter APIs
 */
qx.Class.define("tweet.business.TwitterAnon",
{
  extend : unify.business.RemoteData,
  type : "singleton",

  construct : function()
  {
    this.base(arguments);

    this._addService("updates", {url: "http://twitter.com/statuses/friends_timeline.json", keep: 60*10}); // 10 minutes
    this._addService("sent", {url: "http://twitter.com/statuses/user_timeline.json", keep: 60*10}); // 10 minutes
    this._addService("friends", {url: "http://twitter.com/statuses/friends.json", keep: 60*10}); // 10 minutes
    this._addService("followers", {url: "http://twitter.com/statuses/followers.json", keep: 60*10}); // 10 minutes
    
    this._addService("search", {url:"http://search.twitter.com/search.json?q=%query%", keep: 60}); // 1 minute
    this._addService("status", {url:"http://twitter.com/statuses/show/%id%.json", keep: 60*60*24*30}); // 30 days
    this._addService("user", {url:"http://twitter.com/users/show/%id%.json", keep: 60*60*3}); // 3 hours
  }
});
