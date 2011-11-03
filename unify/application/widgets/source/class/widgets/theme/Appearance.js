qx.Theme.define("widgets.theme.Appearance", {
  extend: unify.theme.dark.Appearance,
  
  appearances : {
    "test" : {
      style : function() {
        return {
          backgroundColor: "yellow",
          borderColor: "green green green green"
        };
      }
    },
    
    "test.test1" : {
      style : function() {
        return {
          backgroundColor : "orange"
        };
      }
    },
    
    "test.test2" : {
      style : function() {
        return {
          backgroundColor : "purple"
        };
      }
    },
    
    "toolbar.navigationbar" : {
      style : function() {
        return {
           background: "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/tool-bar/black/navigationbar.png") + ")"
        };
      }
    },
    
    "toolbar.navigationbar.label" : {
      style : function() {
        return {
          font: "Arial 20px bold",
          color: "white",
          textShadow: "rgba(0, 0, 0, 0.4) 0px -1px 0",
          textOverflow: "ellipsis"
        };
      }
    }
  }
});