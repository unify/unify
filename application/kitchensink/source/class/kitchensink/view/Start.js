/* ************************************************************************

  kitchensink

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("kitchensink.view.Start", {
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "Start";
    },

    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var titlebar = new unify.ui.ToolBar(this);
      layer.add(titlebar);
      
      var content = new unify.ui.Content;
      content.add("Hello World");
      layer.add(content);

      return layer;
    }
  }
});
