qx.Class.define("feedreader.business.Answers",
{
  extend : unify.business.RemoteData,
  type : "singleton",
  
  construct : function()
  {
    this.base(arguments);
    
    this._addService("answers", {url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20answers.search%20where%20query%3D{query}%20and%20category_id%3D2115500137%20and%20type%3D%22resolved%22&format=json&diagnostics=true&callback="})
  }
});