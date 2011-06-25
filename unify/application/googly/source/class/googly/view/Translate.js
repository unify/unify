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
      var layerWidget = new unify.ui.widget.core.Layer(this);
      layerWidget.set({
        allowGrowY: true
      });
      var navigationBar = new unify.ui.widget.container.NavigationBar(this);
      layerWidget.add(navigationBar);
      
      var inputStyles = {
        font: "20px",
        paddingLeft: "10px",
        paddingTop: "10px",
        paddingRight: "10px",
        paddingBottom: "10px",
        borderRadius: "4px",
        borderLeft: "1px solid #3A3A3A",
        borderTop: "1px solid #3A3A3A",
        borderRight: "1px solid #3A3A3A",
        borderBottom: "1px solid #888",
        marginTop: "8px",
        marginBottom: "8px",
        marginLeft: "10px",
        marginRight: "10px",
        backgroundColor: "#e8e8e8"
      };
      
      var inputText = this.__inputText = new unify.ui.widget.form.Input();
      inputText.set({
        allowGrowY: true
      });
      //inputText.setHeight(150);
      inputText.setStyle(inputStyles);
      
      var resultText = this.__resultText = new unify.ui.widget.form.Input();
      resultText.set({
        allowGrowY: true
      });
      //resultText.setHeight(150);
      resultText.setStyle(inputStyles);
      
      var button = new unify.ui.widget.form.Button("Translate");
      button.setStyle({
        font: "20px bold",
        color: "white",
        backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0%, rgba(255, 255, 255, 0.61)), color-stop(5%, rgba(255, 255, 255, 0.45)), color-stop(50%, rgba(255, 255, 255, 0.27)), color-stop(50%, rgba(255, 255, 255, 0.2)), color-stop(100%, rgba(255, 255, 255, 0)))",
        borderLeft: "3px solid #3A3A3A",
        borderTop: "3px solid #3A3A3A",
        borderRight: "3px solid #3A3A3A",
        borderBottom: "3px solid #3A3A3A",
        backgroundColor: "#242424",
        borderRadius: "12px",
        textAlign: "center",
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
      
      layerWidget.add(inputText, {
        flex: 1
      });
      layerWidget.add(button);
      layerWidget.add(resultText, {
        flex: 1
      });

      return layerWidget.getUILayer();
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
