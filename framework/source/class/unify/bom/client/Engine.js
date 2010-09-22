/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Engine detection. This class uses a new system to detect browser
 * engines which is not affected by any user agent modifications as
 * it is based on some kind of object detection instead.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
qx.Bootstrap.define("unify.bom.client.Engine",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {Boolean} Whether the client's engine is not known/supported */
    UNKNOWN : true,

    /** {String} The name of the engine. One of <code>trident</code>, <code>gecko</code>, <code>webkit</code> or <code>presto</code>. */
    NAME : "unknown",

    /** {Boolean} Whether the client uses Microsoft's browser engine */
    TRIDENT : false,

    /** {Boolean} Whether the client uses Mozilla's Gecko browser engine */
    GECKO : false,

    /** {Boolean} Whether the client uses Apple's Webkit browser engine */
    WEBKIT : false,

    /** {Boolean} Whether the client uses Opera's browser engine */
    PRESTO : false
  },



  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    // Doing some object detection magic to find out the engine without
    // relying on the user agent string which is modifyable by the user.
    var engine;
    if (window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]") {
      engine = "presto";
    } else if (window.controllers && Object.prototype.toString.call(window.controllers) == "[object XULControllers]") {
      engine = "gecko";
    } else if (typeof navigator.cpuClass === "string") {
      engine = "trident";
    } else if (document.createElement("div").style.WebkitAppearance != null) {
      engine = "webkit";
    } else {
      return;
    }

    statics[engine.toUpperCase()] = true;
    statics.NAME = engine;
    statics.UNKNOWN = false;
  }
});
