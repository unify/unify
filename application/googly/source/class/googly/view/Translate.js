/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Answers View
 */
qx.Class.define("googly.view.Translate", 
{
  extend : unify.view.RemoteView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Translate";
    },
    
    
    // overridden
    _getBusinessObject : function() {
      return googly.business.Yql.getInstance();
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
      var field = document.getElementById("inputText");
      if (!field) {
        return;
      }
      
      return {
        text : field.value,
        source : "de",
        target : "en"
      };
    },
    
    
    // overridden
    _hasServiceRequestParams : function()
    {
      var field = document.getElementById("inputText");
      return field && field.value.length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      /*var toolbar = new unify.ui.NavigationBar(this);
      layer.add(toolbar);
      
      var content = new unify.ui.Content;
      content.add("<textarea rows='3' cols='60' id='inputText'/>");
      content.add("<div class='button' exec='refresh'>Translate</div>");
      content.add("<textarea rows='3' cols='60' id='resultText'/>");
      layer.add(content);*/
      
      var layerWidget = new unify.ui.widget.core.Layer(layer);
      var navigationBar = new unify.ui.widget.container.NavigationBar(this);
      layerWidget.add(navigationBar);
      
      var inputText = this.__inputText = new unify.ui.widget.basic.Content();
      inputText.setHeight(150);
      inputText.getElement().innerHTML = "<textarea rows='3' cols='60' id='inputText'/>";
      
      var resultText = this.__resultText = new unify.ui.widget.basic.Content();
      resultText.setHeight(150);
      resultText.getElement().innerHTML = "<textarea rows='3' cols='60' id='resultText'/>";
      
      var button = new unify.ui.widget.form.Button("Translate");
      button.set({
        width: 100,
        height: 30
      });
      button.setExecute("refresh");
      qx.bom.element2.Class.add(button.getElement(), "button");
      
      layerWidget.add(inputText);
      layerWidget.add(button);
      layerWidget.add(resultText);

      return layer;
    },
    
    
    // overridden
    _renderData : function(data)
    {
      if(!data){
        document.getElementById("resultText").value='';
          return;
      }
      var results = data.query.results;
      var translation = results ? results.translatedText : "";
      
      document.getElementById("resultText").value = translation;
    }    
  }
});
