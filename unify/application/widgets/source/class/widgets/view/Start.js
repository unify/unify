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

      var layerWidget = new unify.ui.widget.core.Layer(layer);

      var titleBar = new unify.ui.widget.container.NavigationBar(this);
      layerWidget.add(titleBar);

      var c1 = new unify.ui.widget.container.Composite(new qx.ui.layout.HBox());
      layerWidget.add(c1);
      c1.set({
        appearance: "test",
        height: 300
      });
      var c2 = new unify.ui.widget.container.Composite(new qx.ui.layout.Basic());
      c2.setAppearance("test.test1");
      c2.setStyle({
        borderRightWidth: "5px",
        borderRightStyle: "solid",
        borderTopWidth: "10px",
        borderTopStyle: "solid"
      });
      var c3 = new unify.ui.widget.container.Composite(new qx.ui.layout.Basic());
      c3.setAppearance("test.test2");
      c1.add(c2, {
        width: "40%"
      });
      c1.add(c3, {
        width: "40%"
      });

      var scroller = new unify.ui.widget.container.Scroll();
      layerWidget.add(scroller);
      scroller.set({
        height: 300
      });
      
      var label = new unify.ui.widget.basic.Label("Das ist ein Test");
      label.set({
        width: 800,
        height: 50
      });
      label.setStyle({
        background: 'white'
      });
      scroller.add(label, {
        left: 0,
        top: 0
      });
      
      var content1 = new unify.ui.widget.basic.Content();
      content1.set({
        width: 800,
        height: 400
      });
      content1.setStyle({
        background: 'yellow'
      });
      scroller.add(content1, {
        left: 0,
        top: 50
      });
      
      return layerWidget;
    }
  }
});
