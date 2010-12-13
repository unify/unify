/* ************************************************************************

  feedreader

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Answers View
 */
qx.Class.define("feedreader.view.Answers", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Translate";
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return feedreader.business.Answers.getInstance();
    },
    

    // overridden
    _getServiceName : function() {
      return "translate";
    },
    

    // overridden
    _errorHandler : function(kind) {
      this.error("Error: " + kind);
    },
    

    // overridden
    _getServiceParams : function() 
    {
      var field = document.getElementById("translateText");
      if (!field) {
        return;
      }
      
      return {
        text : field.value,
        lang : "de"
      };
    },
    
    
    // overridden
    _hasServiceRequestParams : function()
    {
      var field = document.getElementById("translateText");
      return field && field.value.length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.Content;
      content.add("<div class='searchPane'><input type='text' id='translateText'/><div class='button' exec='refresh'>Translate</div></div><div id='translated'></div>");
      layer.add(content);

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      var results = data.query.results;
      if (results) 
      {
        var translation = results.translatedText;
      }
      else
      {
        var translation = "<em>No results</em>";
      }
      
      document.getElementById("translated").innerHTML = "<p>" + translation + "</p>";
    }    
  }
});
