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
      var layerWidget = new unify.ui.widget.core.Layer(layer);
      
      /*var navigationBar = new unify.ui.NavigationBar(this);
      layer.add(navigationBar);*/
      var navigationBar = new unify.ui.widget.container.NavigationBar(this);
      layerWidget.add(navigationBar);
      
      var text = "Welcome to Googly - The Ultimate Google Experience";
      /*var content = new unify.ui.Content;
      content.add(text);
      layer.add(content);*/
      
      var content = new unify.ui.widget.basic.Label(text);
      layerWidget.add(content);
      content.set({
        width: 500,
        height: 50
      });

      return layer;
    }
  }
});
