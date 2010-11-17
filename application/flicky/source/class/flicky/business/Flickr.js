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
    
    this._addService("recent", {url:"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.recent(16)&format=json&diagnostics=true", keep: 60}); // 1 minute
    this._addService("interesting", {url:"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.interestingness(16)&format=json&diagnostics=true", keep: 60}); // 1 minute
    this._addService("info", {url:"http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20flickr.photos.info%20where%20photo_id%3D'%photo%'&format=json&diagnostics=true", keep: 600}) // 10 minutes
  }
});
