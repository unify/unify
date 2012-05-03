/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * Detects the system where the application is running on. This is more detailed
 * than just the platform as on most of them it includes the specific version
 * e.g. Windows XP or a specific variant e.g. Android.
 *
 * The listed constants are automatically filled on the initialization
 * phase of the class. The defaults listed in the API viewer need not
 * to be identical to the values at runtime.
 */
core.Module("unify.bom.client.System",
{
  /*
  ----------------------------------------------------------------------------
     STATICS
  ----------------------------------------------------------------------------
  */

  /** {String} The name of the operating system */
  NAME : "",

  /** {Number} Version number of operating system */
  VERSION : 0,

  /** {String} Name and version combined. */
  TITLE : "unknown 0.0",

  /** {Boolean} Flag to detect if the client system is unknown */
  UNKNOWN : true,

  /** {Boolean} Flag to detect if the client system is Windows (Desktop) */
  WIN : false,

  /** {Boolean} Flag to detect if the client system is Windows Mobile (partly also Windows CE) */
  WINMOBILE : false,

  /** {Boolean} Flag to detect if the client system is Linux */
  LINUX : false,

  /** {Boolean} Flag to detect if the client system is BSD (FreeBSD, NetBSD, ...) */
  BSD : false,

  /** {Boolean} Flag to detect if the client system is Unix (Not BSD and Linux) */
  UNIX : false,

  /** {Boolean} Flag to detect if the client system is Mac OS */
  MACOS : false,

  /** {Boolean} Flag to detect if the client system is Symbian */
  SYMBIAN : false,

  /** {Boolean} Whether the device runs iOS (iPhone, iPod Touch, iPad) */
  IOS : false,

  /** {Boolean} Whether the device runs Android */
  ANDROID : false,

  /** {Boolean} Whether the device runs Palm Web OS */
  WEBOS : false,

  /** {Boolean} Whether the device runs Nokia Maemo */
  MAEMO : false,

  /** {Boolean} Whether the device runs BlackBerry Tablet OS */
  RIM_TABLET_OS : false
});

(function(statics){
  var Platform = unify.bom.client.Platform;
  var agent = navigator.userAgent.replace(/_/g, ".");
  var match, title, version, name;

  if (Platform.WIN)
  {
    name = "win";
    match = /((Windows NT|Windows|Win) ?([0-9\.]+))/.exec(agent);
    if (match)
    {
      version = parseFloat(match[3], 10);
      title = "windows " + ({
        "5.0" : "2000",
        "5.01" : "2000",
        "5.1" : "xp",
        "5.2" : "2003",
        "6.0" : "vista",
        "6.1" : "7"
      }[version] || version);
    }
    else
    {
      match = /(Windows CE)/.exec(agent);
      if (match)
      {
        match = /IEMobile ([0-9\.]+)/.exec(agent);
        if (match)
        {
          version = parseFloat(match[1]);
          if (version >= 7) {
            version = 6.1;
          } else if (version >= 6) {
            version = 6.0;
          } else {
            version = 5.0;
          }
        }
        else
        {
          match = /PPC|Smartphone/.exec(agent);
          if (match) {
            version = 5.0;
          }
        }

        name = "winmobile";
      }
      else if (/PPC|Smartphone/.exec(agent))
      {
        name = "winmobile";
        version = 5.0;
      }
    }
  }
  else if (Platform.MAC)
  {
    match = /(((Mac OS X)|(Mac OS)) ([0-9\.]+))/.exec(agent);
    name = "macos";
    if (match)
    {
      version = parseFloat(match[5], 10);
    }
    else
    {
      var match = /((iPhone OS|iOS) ([0-9\.]+))/.exec(agent);
      if (match)
      {
        version = parseFloat(match[3]);
        name = "ios";
      }
      else
      {
        // If detection of iOS with user string without version number, test for generic
        // device names
        if (/(iPad|iPhone|iPod)/.test(agent)) {
          name = "ios";
          var match=/OS (\d+\.\d+)(?:(?:\.\d+)+)? like/.exec(agent);
          if(match){
            version=parseFloat(match[1],10);
          }
        } else {
          // Fallback
          // Opera as of Version 10.01 has no information about the detailed
          // Mac OS X version. Are other clients affected as well?

          // The last option here is to simply base on the OS X string
          // basically found on all new Macs - even in Opera
          if (navigator.platform === "MacIntel") {
            version = 10.4;
          } else if (/Mac OS X/.exec(agent)) {
            version = 10.0;
          } else {
            version = 9.0;
          }
        }
      }
    }
  }
  else if (Platform.UNIX)
  {
    if (agent.indexOf("Linux") != -1)
    {
      match = /((Android|Maemo) ([0-9\.]+))/.exec(agent);
      if (match)
      {
        name = match[2].toLowerCase();
        version = parseFloat(match[3]);
      }
      else
      {
        name = "linux";
      }
    }
    else if (agent.indexOf("webOS") != -1)
    {
      name = "webos";
      match = /webOS\/([\.0-9]+)/.exec(agent);
      if (match) {
        version = parseFloat(match[1]);
      }
    }
    else if (agent.indexOf("Symbian") != -1)
    {
      name = "symbian";
    }
    else if (agent.indexOf("BSD") != -1)
    {
      name = "bsd";
    }
    //special detection for HTC Flyer, which identifies itself as unix platform with mac os x 10.6.3 and a rather old webkit
    //this combination should be unique to the flyer as real mac os  has a different platform (mac) and a newer webkit
    else if((agent.indexOf("Mac OS X 10.6.3") != -1 && agent.indexOf("AppleWebKit/533.16") != -1) || agent.indexOf("Flyer") != -1)
    {
      name = "Android";
      version = null;//we don't know which version of android it is
    }
    else
    {
      name = "unix";
    }
  }
  else if (Platform.QNX) {
    if (agent.indexOf("RIM Tablet OS") != -1) {
      name = "rim tablet os";
      match = /RIM Tablet OS ([\.0-9]+)/.exec(agent);
      if (match) {
        version = parseFloat(match[1]);
      }
    }
  }

  statics.NAME = name;
  statics[name.toUpperCase().replace(/\s/g, "_")] = true;
  statics.VERSION = version == null ? 0.0 : version;
  statics.TITLE = title || (name + " " + version);
  statics.UNKNOWN = false;
})(unify.bom.client.System);