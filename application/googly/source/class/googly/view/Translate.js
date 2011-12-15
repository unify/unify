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
      var field = this.__inputText;
      if (!field) {
        return;
      }
      
      return {
        text : field.getValue(),
        source : "de",
        target : "en"
      };
    },
    
    
    // overridden
    _hasServiceRequestParams : function()
    {
      var field = this.__inputText;
      return field && field.getValue().length > 0;
    },
    
    
    // overridden
    _createView : function() 
    {
      var navigationBar = new unify.ui.container.NavigationBar(this);
      this.add(navigationBar);
      
      var inputText = this.__inputText = new unify.ui.form.TextField();
      inputText.set({
        allowGrowY: true
      });
      inputText.setHeight(150);
      
      var resultText = this.__resultText = new unify.ui.form.TextField();
      resultText.set({
        allowGrowY: true
      });
      resultText.setHeight(150);
      
      var button = new unify.ui.form.Button("Translate");
      button.set({
        width: 500,
        height: 54,
        allowGrowX: true
      });
      button.addListener("execute", this.refresh, this);
      qx.bom.element.Class.add(button.getElement(), "button");
      
      this.add(inputText, {
        flex: 1
      });
      this.add(button);
      this.add(resultText, {
        flex: 1
      });
    },
    
    
    // overridden
    _renderData : function(data)
    {
      if(!data){
        this.__resultText.setValue("");
        return;
      }
      var results = data.query.results;
      var translation = results ? results.translatedText : "";
      
      this.__resultText.setValue(translation);
    }    
  }
});
