/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011 - 2012 Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Transform abstractor
 */
qx.Class.define("unify.bom.Transform",
{
  statics :
  {
    /**
     * Generates translate string to have accelerated movement (if supported)
     *
     * @param x {Integer} X position of translate
     * @param y {Integer} Y position of translate
     * @return {String} Accelerated translate
     */
    accelTranslate : function(x, y) {
      // Fix resize bug with translate3d on google chrome 15.0.874.121 m
      if (qx.core.Environment.get("browser.name") == "chrome" || qx.core.Environment.get("engine.name") != "webkit") {
        return "translate("+x+","+y+")";
      } else {
        return "translate3d("+x+","+y+",0)";
      }
    },
    
    /**
     * Generates translate string
     *
     * @param x {Integer} X position of translate
     * @param y {Integer} Y position of translate
     * @return {String} Translate
     */
    translate : function(x, y) {
      return "translate("+x+","+y+")";
    },

    /**
     * Generates scale string to have accelerated scaling (if supported)
     *
     * @param x {Integer} X factor of scale
     * @param y {Integer} Y factor of scale
     * @return {String} Accelerated scale
     */
    accelScale : function(x,y){
      // Fix resize bug with translate3d on google chrome 15.0.874.121 m
      if (qx.core.Environment.get("browser.name") == "chrome" || qx.core.Environment.get("engine.name") != "webkit") {
        return "scale("+x+","+y+")";
      } else {
        return "scale3d("+x+","+y+",1)";
      }
    },

    /**
     * Generates scale string
     *
     * @param x {Integer} X factor of scale
     * @param y {Integer} Y factor of scale
     * @return {String} Scale
     */
    scale : function (x,y){
      return "scale("+x+","+y+")";
    }
  }
});