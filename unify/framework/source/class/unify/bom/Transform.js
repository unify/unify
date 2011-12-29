/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Transform abstractor
 */
qx.Class.define("unify.bom.Transform",
{
  statics :
  {
    accelTranslate : function(x, y) {
      // Fix resize bug with translate3d on google chrome 15.0.874.121 m
      if (qx.core.Environment.get("browser.name") == "chrome" || qx.core.Environment.get("engine.name") != "webkit") {
        return "translate("+x+","+y+")";
      } else {
        return "translate3d("+x+","+y+",0)";
      }
    },
    
    translate : function(x, y) {
      return "translate("+x+","+y+")";
    },

    accelScale : function(x,y){
      // Fix resize bug with translate3d on google chrome 15.0.874.121 m
      if (qx.core.Environment.get("browser.name") == "chrome" || qx.core.Environment.get("engine.name") != "webkit") {
        return "scale("+x+","+y+")";
      } else {
        return "scale3d("+x+","+y+",1)";
      }
    },

    scale : function (x,y){
      return "scale("+x+","+y+")";
    }
  }
});