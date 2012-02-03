/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Detects the runtime type in which the application is running.
 *
 * * Browser: Mozilla Firefox, etc.
 * * Widget: Adobe AIR, etc.
 * * Web View: Home Screen Icon on iPhone, etc.
 * * Native: PhoneGap, etc.
 */
core.Module("unify.bom.client.Runtime",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  /** {String} The type of the runtime */
  TYPE : "browser",

  /** {Boolean} Whether the application is running in a typical browser application */
  BROWSER : false,

  /** {Boolean} Whether the application is running in a widget e.g. Adobe AIR, custom widget manager, etc. */
  WIDGET : false,

  /** {Boolean} Whether the application is running inside a basic web view without browser controls */
  WEBVIEW : false,

  /** {Boolean} Whether the app is running as a native app e.g. PhoneGap */
  NATIVE : false
});

(function(statics) {
  var Extension = unify.bom.client.Extension;
  var type = "browser";

  if (Extension.PHONEGAP) {
    type = "native";
  } else if (Extension.AIR || Extension.PRISM || Extension.TITANIUM || Extension.BONDI) {
    type = "widget";
  } else if (navigator.standalone) {
    type = "webview";
  }

  statics.TYPE = type;
  statics[type.toUpperCase()] = true;
})(unify.bom.client.Runtime);
