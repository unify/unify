/**
 * Business layer for anonymous Flickr APIs
 */
qx.Class.define("flicky.business.Flickr",
{
  extend : unify.business.RemoteData,
  type : "singleton",

  construct : function()
  {
    this.base(arguments);
    
    this.setEnableProxy(false);
    
    var yqlBase = "http://query.yahooapis.com/v1/public/yql";
    
    this._addService("recent", {url:yqlBase + "?q=select%20*%20from%20flickr.photos.recent(32)&format=json&diagnostics=true", keep: 60}); // 1 minute
    this._addService("interesting", {url:yqlBase + "?q=select%20*%20from%20flickr.photos.interestingness(32)&format=json&diagnostics=true", keep: 60*60*24}); // 1 day
    this._addService("info", {url:yqlBase + "?q=select%20*%20from%20flickr.photos.info%20where%20photo_id%3D'{photo}'&format=json&diagnostics=true", keep: 60*60*24*14}) // 14 days
  }
});
