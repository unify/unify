qx.Class.define("feedreader.business.Answers",
{
  extend : unify.business.RemoteData,
  type : "singleton",
  
  construct : function()
  {
    this.base(arguments);
    
    this._addService("translate", {url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20google.translate%20where%20q%3D%22{text}%22%20and%20target%3D%22{lang}%22%3B&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="})
  }
});