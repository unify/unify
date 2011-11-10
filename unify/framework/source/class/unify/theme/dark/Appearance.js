
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
    
    "root" : {},
    "composite" : {},
    "scroll" : {},
    "layer" : {},
    "view" : {
      style : function() {
        var style = {
          backgroundColor: "#CBD2D8",
          backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAABCAIAAACdaSOZAAAAFElEQVQI12M4euYKErp0+tINIAIAuHQQ4hrnkJoAAAAASUVORK5CYII=')",
          
          WebkitBackfaceVisibility: "hidden",
          WebkitTransitionProperty: "-webkit-transform, opacity",
          WebkitTransitionDuration: "350ms",
          WebkitTransitionTimingFunction: "ease-in-out"
        };
        
        if (qx.core.Environment.get("os.name") == "android") {
          style.WebkitTransform ="translate(0, 0) rotate(0) scale(1)";
          style.WebkitTransitionDuration = "150ms";
          style.WebkitTransitionTimingFunction = "linear";
        }
        
        return style;
      }
    },
    "overlay" : {
      style : function() {
        var style = {
          backgroundColor: "white",
          borderTop: "5px solid #333",
          borderRight: "5px solid #333",
          borderLeft: "5px solid #333",
          borderBottom: "5px solid #333",
          borderRadius: "5px"
        };
        
        return style;
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
    
    "tabbar" : {
      style : function() {
        return {
          background: "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#434343), to(black), color-stop(.02,#2e2e2e), color-stop(.5,#151515), color-stop(.5,black))",
          borderTop: "1px solid black"
        };
      }
    },
    
    "tabbar.button" : {
      style : function(state) {
        var style = {
          font: "10px bold",
          borderRadius: "3px",
          marginTop: "1px",
          marginLeft: "2px",
          marginRight: "2px"
        };
        
        if (state.active) {
          style.color = "white";
          style.background = "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#494949), to(#252525), color-stop(.5,#353535), color-stop(.5,#252525))";
        } else {
          style.color = "#9a9a9a";
          style.background = "transparent";
        }
        
        return style;
      }
    },
    
    "toolbar" : {
      include : "navigationbar"
    },
    
    "toolbar.segmented.container" : {
      style : function() {
        return {
          //"WebkitBorderImage" : "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/tool-bar/black/segmented-all.png") + ") 0 5 120 5"
        };
      }
    },
    
    "toolbar.segmented.button" : {
      style : function(state) {
        var e = {
          color: "grey",
          textShadow: "rgba(0, 0, 0, 0.5) 0px -1px 0",
          backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0%, #464646), color-stop(50%, #1a1a1a), color-stop(50%, #000000), color-stop(100%, #000000))",
          height: "30px",
          borderTop: "1px solid #2b2b2b",
          borderBottom: "1px solid #323232",
          borderLeft: "1px solid #181818",
          padding: "5px 12px",
          font: "12px bold"
        };
        
        e.borderRadius = (state.first?"5px ":"0px ") + (state.last?"5px ":"0px ") + (state.last?"5px ":"0px ") + (state.first?"5px ":"0px ");
        
        if (state.last) {
          e.borderRight = "1px solid #181818";
        }
        
        if (state.active) {
          e.color = "white";
          e.backgroundImage = "-webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0%, #737373), color-stop(50%, #474747), color-stop(50%, #303030), color-stop(100%, #313131))";
        }
        
        return e;
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      LIST
    ---------------------------------------------------------------------------
    */
    
    "list" : {
      style : function() {
        return {
          marginLeft: "10px",
          marginTop: "10px",
          marginRight: "10px",
          marginBottom: "10px"
        };
      }
    },
    "list.content" : {
      style : function() {
        return {
          backgroundColor: "white",
          borderRadius: "8px",
          marginTop: "15px",
          marginBottom: "17px",
          padding: "10px"
        };
      }
    },
    "list.header" : {
      style : function() {
        return {
          font: "17px bold",
          color: "#4D576B",
          textShadow: "white 0 1px 1px"
        };
      }
    },
    "list.description" : {
      style : function() {
        return {
          font: "17px bold",
          marginRight: "5px"
        };
      }
    },
    "list.value" : {
      style : function() {
        return {
          font: "17px"
        };
      }
    },
    
    /*
    ---------------------------------------------------------------------------
      ELEMENTS
    ---------------------------------------------------------------------------
    */
    
    "label" : {},
    "image" : {},
    "input" : {
      style : function() {
        return {
          borderRadius : "4px",
          borderLeft : "1px solid #3a3a3a",
          borderTop : "1px solid #3a3a3a",
          borderRight : "1px solid #3a3a3a",
          borderBottom : "1px solid #888",
          backgroundColor : "#e8e8e8",
          resize: "none",
          userSelect: "auto"
        };
      }
    },
    "button" : {
      style : function() {
        return {
          font: "20px bold",
          color: "white",
          backgroundImage: "-webkit-gradient(linear, 0% 0%, 0% 100%, color-stop(0%, rgba(255, 255, 255, 0.61)), color-stop(5%, rgba(255, 255, 255, 0.45)), color-stop(50%, rgba(255, 255, 255, 0.27)), color-stop(50%, rgba(255, 255, 255, 0.2)), color-stop(100%, rgba(255, 255, 255, 0)))",
          borderLeft: "3px solid #3A3A3A",
          borderTop: "3px solid #3A3A3A",
          borderRight: "3px solid #3A3A3A",
          borderBottom: "3px solid #3A3A3A",
          backgroundColor: "#242424",
          borderRadius: "12px",
          textAlign: "center"
        };
      }
    }
  }
});
