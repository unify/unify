/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Answers View
 */
qx.Class.define("googly.view.Search", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Search";
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return googly.business.Yql.getInstance();
    },
    

    // overridden
    _getServiceName : function() {
      return "search";
    },
    

    // overridden
    _errorHandler : function(kind) {
      this.error("Error: " + kind);
    },
    

    // overridden
    _getServiceParams : function() 
    {
      var field = document.getElementById("searchText");
      if (!field) {
        return;
      }
      
      return {
        q : field.value
      };
    },
    
    
    // overridden
    _hasServiceRequestParams : function()
    {
      var field = document.getElementById("searchText");
      return field && field.value.length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      layer.add(titlebar);
      
      var scrollView = new unify.ui.ScrollView;
      layer.add(scrollView);
      scrollView.setEnableScrollX(false);
      scrollView.add("<input type='text' id='searchText'/><div class='button' exec='refresh'>Submit</div><ul id='resultList'></ul>");

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      var results = data.query.results;
      var markup = "";
      
      if (results)
      {
        var entry;
        results = results.results;
        for (var i=0, l=results.length; i<l; i++)
        {
          entry = results[i];
          markup += "<li><a href='" + entry.url + "'>" + entry.titleNoFormatting + "<br/>" + entry.visibleUrl + "</a></li>";
        }
      }
      
      document.getElementById("resultList").innerHTML = markup;
    }    
  }
});
