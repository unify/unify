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
      return "Answers";
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return feedreader.business.Answers.getInstance();
    },
    

    // overridden
    _getServiceName : function() {
      return "answers";
    },
    

    // overridden
    _errorHandler : function(kind) {
      this.error("Error: " + kind);
    },
    

    // overridden
    _getServiceParams : function() 
    {
      var field = document.getElementById("answersSearch");
      if (!field) {
        return;
      }
      
      return {
        query : "'" + field.value + "'"
      };
    },
    
    
    // overridden
    _hasServiceRequestParams : function()
    {
      var field = document.getElementById("answersSearch");
      return field && field.value.length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.TitleBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.Content;
      content.add("<div class='searchPane'><input type='text' id='answersSearch'/><div class='button' exec='refresh'>Refresh</div></div> <div id='answerResults'></div>");
      layer.add(content);

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      var results = data.query.results;
      if (results) 
      {
        var entries = results.Question.map(function(entry) {
          return "<li>" + entry.Subject + " (" + entry.NumAnswers + " answers)</li>"; 
        }).join("");
      }
      else
      {
        var entries = "<li>No results</li>";
      }
      
      document.getElementById("answerResults").innerHTML = "<ul>" + entries + "</ul>";
    }    
  }
});
