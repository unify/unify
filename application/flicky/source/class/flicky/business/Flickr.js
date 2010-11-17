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
    
    this._addService("recent", {url:"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.recent&format=json&diagnostics=true", keep: 60}); // 1 minute
    this._addService("interestingness", {url:"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(20)&format=json&diagnostics=true", keep: 60}); // 1 minute
  }
});
