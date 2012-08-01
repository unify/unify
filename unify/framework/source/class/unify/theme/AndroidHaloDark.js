/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/** 
 * #asset(unify/android/halo/textfield-underline.png) 
 * #asset(unify/android/halo/textfield-underline-gray.png) 
 */

(function() {

  var BU = 4;

  core.Class("unify.theme.AndroidHaloDark", {
    include : [unify.theme.Theme],
    
    construct : function() {
      unify.theme.Theme.call(this, {
        name : "unify.AndroidHaloDark",
        
        include : new unify.theme.Base(),
        
        colors: {
          "android_bg_black" : "#000000",
          "android_bg_gray"  : "#272C33",
          "android_head_text" : "#B9B9B9",
          "android_text" : "#FFFFFF"
        },
        fonts: {
        },
        styles: {
          "view" : {
            style : function() {
              return {
                backgroundImage: unify.bom.Gradient.createGradient({
                  colorStops: [
                    {position: 0, color: unify.theme.Manager.get().resolveColor("android_bg_black")}, 
                    {position: 1, color: unify.theme.Manager.get().resolveColor("android_bg_gray")}
                  ]
                })
              }
            }
          },
          
          "label" : {
            style : function() {
              return {
                color: "android_head_text"
              };
            }
          },
          
          "input" : {
            style : function(state) {
              console.log("URI", JSON.stringify(state));
              
              var url;
              
              if (state.active) {
                url = core.io.Asset.toUri("unify/android/halo/textfield-underline.png");
              } else {
                url = core.io.Asset.toUri("unify/android/halo/textfield-underline-gray.png");
              }
              
              return {
                color: "android_text",
                background: "none",
                borderBottom: "5px",
                borderLeft: "2px",
                borderTop: "0px",
                borderRight: "2px",
                borderColor: "transparent",
                borderImage: "url("+url+") 0 2 5 2"
              };
            }
          }
        }
      });
    }
  });

})();