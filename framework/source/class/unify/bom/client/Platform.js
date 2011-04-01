/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class comes with all relevant information regarding
 * the client's platform.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
qx.Bootstrap.define("unify.bom.client.Platform",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /** {String} The name of the platform. One of: "win", "mac", "unix" or "unknown" */
    NAME : "unknown",

    /** {Boolean} Flag to detect if the client system is running Windows */
    WIN : false,

    /** {Boolean} Flag to detect if the client system is running Mac OS */
    MAC : false,

    /** {Boolean} Flag to detect if the client system is running Unix, Linux, BSD, Symbian, etc */
    UNIX : false,

    /** {Boolean} Flag to detect if the client system is running Unix, Linux, BSD, Symbian, etc */
    QNX : false,

    /** {Boolean} Flag to detect if the client system is unknown */
    UNKNOWN : true
  },




  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    var userAgent = navigator.userAgent;
    var input = navigator.platform || userAgent;
    var name;

    if (/Windows|Win32|Win64/.exec(input)) {
      name = "win";
    } else if (/Macintosh|MacPPC|MacIntel|Mac OS/.exec(input)) {
      name = "mac";
    } else if (/X11|Linux|BSD|Sun OS|Maemo|Android|SymbianOS|webOS/.exec(input)) {
      name = "unix";
    } else if (/RIM Tablet OS/.exec(userAgent)) {
      name = "qnx";
    }

    if (name)
    {
      statics[name.toUpperCase()] = true;
      statics.NAME = name;
    }
  }
});
