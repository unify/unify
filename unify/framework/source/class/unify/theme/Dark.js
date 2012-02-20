/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

core.Class("unify.theme.Dark", {
  include : [unify.theme.Theme],
  
  construct : function() {
    unify.theme.Theme.call(this, {
      name : "unify.Dark",
      
      colors: {
        color1: "#ff0000",
        color2: "green"
      },
      fonts: {
        font0: {},
        font1: {
          family: "sans-serif",
          size: 12,
          style: "italic",
          weight: "bold",
          decoration: "underline",
          lineHeight: 1.5
        },
        font2: {
          family: "Droid",
          src: "Droid.ttf"
        }
      },
      styles: {
        "BODY" : {
          style : function(state) {
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
              background : "white",
              touchCallout : "none"
            };
          }
        }
      }
    });
  }
});