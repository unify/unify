/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/*
#asset(unify/iphoneos/navigation-bar/black/navigationbar.png)
#asset(unify/iphoneos/loader.png)
#asset(unify/noun/down.png)
*/

/**
 * Appearances "dark" for unify widgets
 */
qx.Theme.define("unify.theme.dark.Appearance", {
  appearances : {
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */
    
    "BODY" : {
      style : function() {
        return {
          userSelect : "none",
          position : "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          overflow : "hidden",
          border : 0,
          padding : 0,
          margin : 0,
          boxSizing : "borderBox",
          fontFamily : "Helvetica,sans-serif",
          fontSize: "14px",
          lineHeight : "1.4",
          color : "black",
          background : "white"
        };
      }
    },

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
    "html" : {},
    "spacer" : {},
    "view" : {
      style : function() {
        var style = {
          backgroundColor: "#CBD2D8",
          backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAABCAIAAACdaSOZAAAAFElEQVQI12M4euYKErp0+tINIAIAuHQQ4hrnkJoAAAAASUVORK5CYII=')"
        };

        return style;
      }
    },
    "viewmanager" : {
      include : "composite",

      style : function() {
        return {
          properties : {
            animationDuration : 350
          }
        };
      }
    },
    
    "tabbedviewmanager" : {
      include: "viewmanager"
    },
    
    "bar":{},
    
    "tabbedviewmanager/tabbar":{
      include:"bar"
    },
    
    "overlay" : {
      style : function() {
        return {
          properties : {
            relativeArrowPosition: "center"
          }
        };
      }
    },
    "overlay/arrow" : {

      style : function() {
        var size=38;
        return {
          width:size,
          height:Math.floor(size/2),
          overflow: "hidden",
          properties : {
            direction:"top",
            arrowStyle: {
              width: size+"px",
              height: size+"px",
              backgroundColor: "#333",
              transform: "rotate(45deg) scale(0.73)"
            }
          }
        };
      }
    },
    "overlay/container" : {
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
      ACTIVITY INDICATOR
    ---------------------------------------------------------------------------
    */

    "activityindicator" : {
      style : function() {
        var size = 144;

        return {
          marginLeft: -Math.round(size/2),
          width: size,
          marginTop: -Math.round(size/2),
          height: size,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderWidth: "1px",
          borderColor: "#000",
          borderStyle: "solid",
          pointerEvents: "none",
          paddingTop: 30,
          zIndex: 100000 //make sure indicator is on top of everything
        };
      }
    },

    "activityindicator/image" : {
      style : function() {
        var url = "unify/iphoneos/loader.png";
        var ResourceManager = qx.util.ResourceManager.getInstance();

        return {
          width: ResourceManager.getImageWidth(url),
          height: ResourceManager.getImageHeight(url),

          properties : {
            source: url
          }
        };
      }
    },

    "activityindicator/label" : {
      style : function() {
        return {
          color: "white",
          marginTop: 25
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
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap"
        };
      }
    },

    "navigationbar/master" : {
      include : "button"
    },

    "navigationbar/master/label" : {
      include : "button/label"
    },

    "navigationbar/parent" : {
      include : "button"
    },

    "navigationbar/parent/label" : {
      include : "button/label"
    },



    "tabbar" : {
      style : function() {
        var gradient = unify.bom.Gradient.createGradient({
          angle: "to bottom",
          colorStops : [{
            position: 0,
            color: "#434343"
          }, {
            position: 0.02,
            color: "#2e2e2e"
          }, {
            position: 0.5,
            color: "#151515"
          }, {
            position: 0.5,
            color: "#000"
          }, {
            position: 1,
            color: "#000"
          }]
        });

        return {
          background: gradient,
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
          style.background = unify.bom.Gradient.createGradient({
            angle: "to bottom",
            colorStops : [{
              position: 0,
              color: "#494949"
            }, {
              position: 0.5,
              color: "#353535"
            }, {
              position: 0.5,
              color: "#252525"
            }, {
              position: 1,
              color: "#252525"
            }]
          });
        } else {
          style.color = "#9a9a9a";
          style.background = "transparent";
        }

        return style;
      }
    },
    "tabbar.button/label" : {
      style : function(state) {
        return {
          font: "14px normal",
          textAlign: "center"
        };
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
          color: "gray",
          textShadow: "rgba(0, 0, 0, 0.5) 0px -1px 0",
          backgroundImage: unify.bom.Gradient.createGradient({
            angle: "to bottom",
            colorStops : [{
              position: 0,
              color: "#464646"
            }, {
              position: 0.5,
              color: "#1a1a1a"
            }, {
              position: 0.5,
              color: "#000"
            }, {
              position: 1,
              color: "#000"
            }]
          }),
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
          e.backgroundImage = unify.bom.Gradient.createGradient({
            angle: "to bottom",
            colorStops : [{
              position: 0,
              color: "#737373"
            }, {
              position: 0.5,
              color: "#474747"
            }, {
              position: 0.5,
              color: "#303030"
            }, {
              position: 1,
              color: "#313131"
            }]
          });
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
      include : "label",
      style : function() {
        return {
          font: "17px bold",
          marginRight: "5px"
        };
      }
    },
    "list.value" : {
      include : "label",
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

    "label" : {
      style : function(state) {
        var e = {
          overflow: "hidden"
        };

        if ((!state.wrap) && state.ellipsis) {
          e.textOverflow = "ellipsis";
          e.whiteSpace = "nowrap";
        }

        return e;
      }
    },
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

    "input.file" : {},
    "input.file/filename" : {
      include : "button"
    },
    "input.file/filename/label" : {
      include : "button/label"
    },
    "input.file/fileinput" : {
      style : function() {
        return {
          opacity: 0
        };
      }
    },

    "button" : {
      style : function(state) {
        var e = {
          color: "white",
          backgroundImage: unify.bom.Gradient.createGradient({
            angle: "to bottom",
            colorStops : [{
              position: 0,
              color: "rgba(255, 255, 255, 0.61)"
            }, {
              position: 0.05,
              color: "rgba(255, 255, 255, 0.45)"
            }, {
              position: 0.5,
              color: "rgba(255, 255, 255, 0.27)"
            }, {
              position: 0.5,
              color: "rgba(255, 255, 255, 0.2)"
            }, {
              position: 1,
              color: "rgba(255, 255, 255, 0)"
            }]
          }),
          borderLeft: "3px solid",
          borderTop: "3px solid",
          borderRight: "3px solid",
          borderBottom: "3px solid",
          borderColor: "#3a3a3a",
          backgroundColor: "#242424",
          borderRadius: "12px",
          textAlign: "center"
        };

        if (state.active) {
          e.backgroundColor = "#646464";
        }
        if (state.hover) {
          e.borderColor = "#aaa";
        }

        return e;
      }
    },
    "button/label" : {
      style : function(state) {
        return {
          font: "20px bold",
          textAlign: "center"
        };
      }
    },


    "slider" : {
      style : function(state) {
        if (state.horizontalDirection) {
          var e = {
            height: 30,
            padding: "5 10",
            borderRadius: "15px",
            backgroundColor: "#242424"
          };
        } else if (state.verticalDirection) {
          var e = {
            width: 30,
            padding: "10 5",
            borderRadius: "15px",
            backgroundColor: "#242424"
          };
        }

        return e;
      }
    },
    "slider/bar" : {
      style : function(state) {
        return {
          margin: "5",
          backgroundColor: "#999",
          borderRadius: "14px"
        };
      }
    },
    "slider/knob" : {
      style : function(state) {
        return {
          height: "20px",
          width: "20px",
          borderRadius: "10px",
          backgroundColor: "#ddd"
        };
      }
    },

    "combobox" : {
      style : function() {
        return {
          height: "30px",
          backgroundColor: "white",
          properties : {
            image : qx.util.ResourceManager.getInstance().toUri("unify/noun/down.png")
          }
        };
      }
    },
    
    "combobox/image" : {
      style : function() {
        var ResourceManager = qx.util.ResourceManager.getInstance();
        return {
          width: ResourceManager.getImageWidth("unify/noun/down.png"),
          height: ResourceManager.getImageHeight("unify/noun/down.png"),
          margin: "5",
          properties : {
            allowGrowX: false,
            allowGrowY: false
          }
        };
      }
    },
    
    "combobox/label" : {
      style : function() {
        return {
          lineHeight: 1.0,
          marginLeft: "5px",
          properties : {
            allowGrowY: false
          }
        };
      }
    },
    
    "combobox/button" : {
      style : function() {
        return {
          width: "40px"
        };
      }
    },
    
    "combobox/button/label" : {
      style : function() {
        return {
        };
      }
    },

    /*
    ---------------------------------------------------------------------------
      DIALOGS
    ---------------------------------------------------------------------------
    */

    "alert" : {
      style : function() {
        return {
          borderLeft: "3px solid #3A3A3A",
          borderTop: "3px solid #3A3A3A",
          borderRight: "3px solid #3A3A3A",
          borderBottom: "3px solid #3A3A3A",
          backgroundColor: "#242424",
          borderRadius: "12px",
          textAlign: "center"
        };
      }
    },

    "alert.label" : {
      style : function() {
        return {
          font: "20px bold",
          color: "white"
        };
      }
    },

    "alert.button" : {
      include : "button",

      style : function() {
        return {
          marginBottom: "5px"
        };
      }
    }
  }
});
