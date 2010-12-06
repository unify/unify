/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
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
    
    this.debug("Logging in as: " + localStorage["tweet/username"]);
    
    this.setUser(localStorage["tweet/username"]);
    this.setPassword(localStorage["tweet/password"]);    
    
    this._addService("send", {url: "http://twitter.com/statuses/update.json"});
  }
});
