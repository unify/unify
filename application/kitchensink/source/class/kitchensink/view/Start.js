/* ************************************************************************

  kitchensink

  Copyright:
    2011 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("kitchensink.view.Start", {
  extend : unify.view.StaticView,
  type : "singleton",
  
  // the constructor
  // optional, but useful for definitions happening upon instanciation
  construct : function() 
  {
    // call parent constructor
    this.base(arguments);
    
    // load business objects and models
    //var businessEpgapi = this.__businessEpgapi = iepg.business.Epgapi.getInstance();
    
  },
  
  // this view's members - some overridden, some custom
  members : 
  {
    __someInternalVar : "default value",
    
    // overridden
    getTitle : function(type, param) {
      return "Kitchensink";
    },
    
    
    // overridden
    _createView : function() 
    {
      // first we define some content elements
      var 
        // the main layer for this view
        mainLayer = new unify.ui.Layer(this),
        // a navigation bar on top
        navBar = new unify.ui.NavigationBar(this),
        // a scrollable view below the navigation bar
        mainContent = new unify.ui.Content,
        // this is a var used later on, variable hoisting puts it here
        mainMenu = '';
      
      // we add the navigation bar to the main layer
      mainLayer.add(navBar);
      mainLayer.add(mainContent);
      
      // filling content elements
      // h2 is pre-styled
      mainContent.add("<h2>Welcome to the Kitchen Sink!</h2>");
      mainContent.add("<p>We want to show some Unify features here, so please pick a Demo:</p>");
      
      // build the main menu
      mainMenu += '<ul>';
      mainMenu += ' <li goto="uicomponents">UI Components</li>';
      mainMenu += '</ul>';
      
      mainContent.add(mainMenu);
      
      // the _createView method returns the main layer as the view
      return mainLayer;
    },
    
    // this is a custom method
    customAction : function()
    {
      return true;
    }
  }
});
