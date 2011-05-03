/* ************************************************************************

   Googly

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Start View
 */
qx.Class.define("googly.view.Start", 
{
  extend : unify.view.StaticView,
  type : "singleton",

  members : 
  {
    // overridden
    getTitle : function(type) {
      return "Googly";
    },

    
    // overridden
    _createView : function() 
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      layer.add(navigationBar);
      
      var content = new unify.ui.Content;
      content.add("Welcome to Googly - The Ultimate Google Experience");
      layer.add(content);

      return layer;
    }
  }
});
