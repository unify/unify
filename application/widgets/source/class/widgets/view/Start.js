/* ************************************************************************

  widgets

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
qx.Class.define("widgets.view.Start", {
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
      
      //var titlebar = new unify.ui.ToolBar(this);
      //layer.add(titlebar);
      
      /*var content = new unify.ui.Content;
      content.add("Hello World");
      layer.add(content);*/
      
      var layerWidget = new unify.ui.widget.core.Layer(layer);
      var cont = new unify.ui.widget.basic.Label("Das ist ein Test");
      layerWidget.add(cont, {
        left: 50,
        top: 10
      });
      cont.set({
        width: 100,
        height: 50
      });

      return layer;
    }
  }
});
