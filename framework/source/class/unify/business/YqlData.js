/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
qx.Class.define("unify.business.YqlData",
{
  extend : unify.business.RemoteData,
  type : "singleton",
  
  construct : function()
  {
    this.base(arguments);

    var url = "http://query.yahooapis.com/v1/public/yql?q=%query%&format=json"; //&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    this.setEnableCacheRefresh(false);
    this._addService("yql", {url: url, keep: 60*60});
  }
});
