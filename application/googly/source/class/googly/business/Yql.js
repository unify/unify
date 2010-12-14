/* ************************************************************************

  Googly

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */
 
/**
 * YQL interface connector for some Google services. 
 *
 * Currently supported: translate, search, weather.
 */
qx.Class.define("googly.business.Yql",
{
  extend : unify.business.RemoteData,
  type : "singleton",
  
  construct : function()
  {
    this.base(arguments);
    
    this._addService("translate", {url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.translate%20where%20q%3D%22{text}%22%20and%20target%3D%22{target}%22%20and%20source%3D%22{source}%22%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", keep:60*60*24*14}); // 14 days
    this._addService("search", {url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.search%20where%20q%20%3D%20%22{q}%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", keep:60*60*24}); // 1 day
    this._addService("weather", {url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.igoogle.weather%20where%20weather%3D'{city}'%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", keep:60*60}); // 1 hour
  }
});
