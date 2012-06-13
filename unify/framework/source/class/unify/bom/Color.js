/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2012, Sebastian Fastner, Mainz, Germany, http://unify-training.com
    
===============================================================================================
*/
/**
 * Creates browser specific gradients
 */
core.Module('unify.bom.Color', {
  
  /*
  ----------------------------------------------------------------------------
    STATICS
  ----------------------------------------------------------------------------
  */

  /**
   * Creates a browser specific color code based upon @red {Integer}, @green {Integer}, 
   * @blue {Integer} and @alpha {Float}, ignoring alpha on IE<9
   */
  rgba: function(red,green,blue,alpha) {
    if (core.Env.getValue("engine") == "trident") {
      return "rgb(" + red + "," + green + "," + blue + ")";
    } else {
      return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }
  }
});