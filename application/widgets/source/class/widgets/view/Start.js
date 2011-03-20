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
      scroller.add(label, {
        left: 50,
        top: 10
      });
      label.set({
        width: 100,
        height: 50
      });

      return layer;
    }
  }
});
