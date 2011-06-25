
qx.Theme.define("unify.theme.dark.Appearance", {
  appearances : {
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */

    "widget" : {},
    
    "list.button.top" : {
      style : function(states) {
        return {
          borderTopLeftRadius : "8px",
          borderTopRightRadius : "8px",
          paddingLeft: "10px",
          paddingTop: "10px",
          paddingRight: "10px",
          paddingBottom: "10px",
          borderLeft: "1px solid #b4b4b4",
          borderTop: "1px solid #b4b4b4",
          borderRight: "1px solid #b4b4b4",
          borderBottom: "1px solid #b4b4b4",
          backgroundColor: "white",
          font: "14px",
          textColor: "text-disabled"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      CONTAINER
    ---------------------------------------------------------------------------
    */
    
    "composite" : {},
    "scroll" : {},
    "layer" : {
      style : function() {
        return {
          backgroundColor: "#CBD2D8",
          backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAABCAIAAACdaSOZAAAAFElEQVQI12M4euYKErp0+tINIAIAuHQQ4hrnkJoAAAAASUVORK5CYII=')"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      BARS
    ---------------------------------------------------------------------------
    */
    
    "navigationbar" : {
      style : function() {
        return {
          background: "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/navigation-bar/black/navigationbar.png") + ")"
        };
      }
    },
    
    "navigationbar.title" : {
      style : function() {
        return {
          font: "20px bold",
          color: "white",
          textShadow: "rgba(0, 0, 0, 0.4) 0px -1px 0",
          textOverflow: "ellipsis"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      CONTAINER
    ---------------------------------------------------------------------------
    */
    
    "label" : {},
    "image" : {}
  }
});
