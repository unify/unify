/* ************************************************************************

  feedreader

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Answers View
 */
qx.Class.define("feedreader.view.Weather", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Weather";
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return feedreader.business.Yql.getInstance();
    },
    

    // overridden
    _getServiceName : function() {
      return "weather";
    },
    

    // overridden
    _errorHandler : function(kind) {
      this.error("Error: " + kind);
    },
    

    // overridden
    _getServiceParams : function() 
    {
      var field = document.getElementById("citySearch");
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
      var field = document.getElementById("citySearch");
      return field && field.value.length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.Content;
      content.add("<input type='text' id='citySearch'/><div class='button' exec='refresh'>Search</div>");
      var scrollView = new unify.ui.ScrollView;
      scrollView.setEnableScrollX(false);
      content.add(scrollView);
      scrollView.add("<ul id='resultList'></ul>");
      layer.add(content);

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      var results = data.query.results;
      var markup = "";
      
      if (results)
      {
        console.debug(results);
        
      }

      document.getElementById("resultList").innerHTML = markup;
    }    
  }
});
