/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ************************************************************************

#asset(unify/mobile/*)

#require(unify.event.handler.Orientation)
#require(unify.event.handler.Transition)
#require(unify.event.handler.Touch)

#require(qx.log.appender.Native)

************************************************************************ */

/**
 * Application class for desktop-class devices.
 */
qx.Class.define("unify.application.Desktop", {
  extend : qx.application.Standalone
});
