/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2011, Sebastian Fastner, Mainz, Germany, http://unify-training.com

*********************************************************************************************** */

/**
 * Local storage abstraction and helper class
 */
qx.Class.define("unify.bom.Tranform",
{
  statics :
  {
    accelTranslate : function(x, y) {
      //return "translate3d("+x+","+y+")";
      return "translate("+x+","+y+")";
    },
    
    translate : function(x, y) {
      return "translate("+x+","+y+")";
    }
  },
  
  defer : function(statics) 
  {
    /*var appId = qx.core.Environment.get("qx.application");
    statics.__prefix = appId.substring(0, appId.indexOf(".")) + "/";*/
  }
});