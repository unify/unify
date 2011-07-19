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
      /*var layer = new unify.ui.Layer(this);
      var toolbar = new unify.ui.NavigationBar(this);
      layer.add(toolbar);
      
      var scrollView = new unify.ui.ScrollView;
      layer.add(scrollView);
      scrollView.setEnableScrollX(false);
      scrollView.add("<input type='text' id='searchText'/><div class='button' exec='refresh'>Submit</div><ul id='resultList'></ul>");

      return layer;*/
      
      var navigationBar = new unify.ui.widget.container.NavigationBar(this);
      this.add(navigationBar);
      
      var inputStyles = {
        font: "20px",
        paddingLeft: "10px",
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        marginTop: "8px",
        marginBottom: "8px",
        marginLeft: "10px",
        marginRight: "10px"
      };
      
      var inputText = this.__inputText = new unify.ui.widget.form.Input();
      inputText.setHeight(50);
      inputText.setStyle(inputStyles);
      
      var button = new unify.ui.widget.form.Button("Search");
      button.setStyle({
        marginLeft: "10px",
        marginRight: "10px",
        paddingLeft: "10px",
        paddingTop: "10px",
        paddingRigth: "10px",
        paddingBottom: "10px"
      });
      button.set({
        width: 500,
        height: 54,
        allowGrowX: true
      });
      button.setExecute("refresh");
      qx.bom.element.Class.add(button.getElement(), "button");
      
      this.add(inputText);
      this.add(button);
    },
    
    
    // overridden
    _renderData : function(data)
    {
      if(!data){
        document.getElementById("resultList").innerHTML = "";
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

      document.getElementById("resultList").innerHTML = markup;
    }    
  }
});
