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
      var field = this.__inputText && this.__inputText.getValue(); //document.getElementById("searchText");
      if (!field) {
        return;
      }
      
      return {
        q : field
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
      var navigationBar = new unify.ui.container.NavigationBar(this);
      this.add(navigationBar);
      
      var inputText = this.__inputText = new unify.ui.form.TextField();
      inputText.setHeight(50);
      
      var button = new unify.ui.form.Button("Search");
      button.set({
        width: 500,
        height: 54,
        allowGrowX: true
      });
      button.addListener("execute", this.refresh, this);
      qx.bom.element.Class.add(button.getElement(), "button");
      
      var output = this.__output = new unify.ui.embed.Html().set({
        width: 500,
        height: 700
      });
      
      this.add(inputText);
      this.add(button);
      this.add(output);
    },
    
    
    // overridden
    _renderData : function(data)
    {
      if(!data){
        this.__output.setHtml("");
        return;
      }
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

      this.__output.setHtml(markup);
    }    
  }
});
