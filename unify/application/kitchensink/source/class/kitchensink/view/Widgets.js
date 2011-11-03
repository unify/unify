/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Widgets View
 */
qx.Class.define("kitchensink.view.Widgets", 
{
  extend : unify.view.StaticView,
  type : "singleton",
  
  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Widgets";
    },
    
    // overridden
    _createView : function()
    {
      var 
        // layer widget in compatibility mode
        layerWidget = new unify.ui.core.Layer(new unify.ui.Layer(this)),
        
        // navigation bar widget
        navigationBar = new unify.ui.container.NavigationBar(this),
        
        // some texts for labels
        labelTextOne = "Label One",
        labelTextTwo = "Second Label",
        
        // label containers
        labelOne = new unify.ui.basic.Label(labelTextOne),
        labelTwo = new unify.ui.basic.Label(labelTextTwo),
        
        // a button
        buttonOne = new unify.ui.form.Button(),
        
        // text input
        inputOne = new unify.ui.form.Input(),
        
        // config for all widgets
        baseConfig = {
          allLabels : {
            width : 500,
            height : 30
          },
          labelTwo : {
            height : 20
          },
          buttonOne : {
            width : 120
          },
          inputOne : {
            width: 300,
            height: 100,
            allowGrowX: false
          }
        },
        
        // styles for all widgets - future style manager
        baseStyles = {
          allLabels : {
            paddingLeft : "10px",
            paddingTop : "10px",
            paddingRight : "0px",
            paddingBottom : "0px"
          },
          labelTwo : {
            paddingTop : "0px",
            color : "red"
          },
          buttonOne : {
            background : 'darkGreen',
            borderRadius : '5px',
            marginLeft : '10px',
            paddingTop : "10px",
            paddingRight : "10px",
            paddingBottom : "10px",
            paddingLeft : "10px",
            color : 'white'
          },
          inputOne : {
            background : 'lightGreen',
            borderRadius : '5px',
            marginLeft : '10px',
            paddingTop : "10px",
            paddingRight : "10px",
            paddingBottom : "10px",
            paddingLeft : "10px",
            color : 'white'
          }
        };
        
      // add nav bar to layer
      layerWidget.add(navigationBar);
      // add labels to layer
      layerWidget.add(labelOne);
      layerWidget.add(labelTwo);
      // add button to layer
      layerWidget.add(buttonOne);
      // add input to layer
      layerWidget.add(inputOne);
      
      // configure labels with defaults
      labelOne.set(baseConfig.allLabels);
      labelTwo.set(baseConfig.allLabels);
      
      // overwrite defaults for label 2
      labelTwo.set(baseConfig.labelTwo);
      
      // default styles for labels
      labelOne.setStyle(baseStyles.allLabels);
      labelTwo.setStyle(baseStyles.allLabels);
      
      // add additional styling to label 2
      labelTwo.setStyle(baseStyles.labelTwo);
      
      // configure button
      buttonOne.set(baseConfig.buttonOne);
      buttonOne.setStyle(baseStyles.buttonOne);
      
      // set button text and action
      buttonOne.setValue('Long Button Text');
      buttonOne.setExecute('_buttonAction');
      
      // configure input
      inputOne.set(baseConfig.inputOne);
      inputOne.setStyle(baseStyles.inputOne);
      inputOne.setValue('demo text demo text demo text demo text demo text demo text demo text demo text demo text');
      
      return layerWidget;
    },
    
    _buttonAction : function() {
      alert('Button Action');
    }
    
  }
});
