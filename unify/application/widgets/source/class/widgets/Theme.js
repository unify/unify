qx.Class.define("widgets.Theme", {
  extend: unify.widget.styling.Theme,
  
  construct : function() {
    var styles = {
      "test" : {
        backgroundColor: "yellow",
        borderColor: "green green green green"
      },
      "test.test1" : {
        backgroundColor : "orange"
      },
      "test.test2" : {
        backgroundColor : "purple"
      },
      "toolbar.navigationbar": {
         background: "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/tool-bar/black/navigationbar.png") + ")"
      },
      "toolbar.navigationbar.label" : {
        font: "Arial 20px bold",
        color: "white",
        textShadow: "rgba(0, 0, 0, 0.4) 0px -1px 0",
        textOverflow: "ellipsis"
      }
    };
    
    this.base(arguments, styles);
  }
});
