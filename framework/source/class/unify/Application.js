/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ************************************************************************

#require(unify.event.handler.Orientation)
#require(unify.event.handler.Transition)
#require(qx.event.handler.Mouse)
#require(qx.event.handler.Touch)
#require(qx.log.appender.Native)


************************************************************************ */

/**
 * Application class for next generation devices.
 */
qx.Class.define("unify.Application",
{
  extend : qx.application.Native,


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      APPLICATION CORE
    ---------------------------------------------------------------------------
    */

    // overridden
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Global error handling (otherwise we see nothing in PhoneGap)
      if (unify.bom.client.Extension.PHONEGAP)
      {
        qx.event.GlobalError.setErrorHandler(function(ex) {
          qx.log.Logger.error("" + ex);
        });
      }

      // Display build time
      this.info("Build Time: " + new Date(qx.$$build));

      // Configure document
      this.__setupDocumentSize();
      var orient = qx.bom.Viewport.getOrientation();
      var isLandscape=(orient == 90 || orient == 270 || orient == -90 || orient == -270);
      document.body.setAttribute('orient',isLandscape?'landscape':'portrait');
      // Event listeners
      var Registration = qx.event.Registration;
      Registration.addListener(window, "resize", this.__onResize, this);
      Registration.addListener(window, "rotate", this.__onRotate, this);
      
      if (qx.core.Environment.get("device.runtime.name") == "webos") {
        var palmSystem = window.PalmSystem;
        if (palmSystem) {
          palmSystem.stageReady();
        } else {
          this.warn("window.PalmSystem not found");
        }
      }
    },



    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a view manager to the root element of the application.
     *
     * @param viewManager {Object} Any object with a method "getElement" which returns a DOM element
     */
    add : function(viewManager) {
      document.body.appendChild(viewManager.getElement());
    },


    /**
     * Returns the top-level namespace/package of the application.
     *
     * @return {String} Application namespace
     */
    getNamespace : function()
    {
      var clazz = this.classname;
      return clazz.substring(0, clazz.indexOf("."));
    },


    /**
     * Applies an attribute to the document's body (the application root)
     * named "orient" which is set to "landscape" or "portrait" depending
     * on the current device orientation.
     *
     * @param e {unify.event.type.Orientation} Orientation change event
     */
    __onRotate : function(e) {
      document.body.setAttribute("orient", e.getMode());
    },


    /**
     * Fired whenever the windows is resized or the orientation is changed.
     *
     * @param e {qx.event.type.Event} Resize event
     */
    __onResize : function(e) {
      this.__setupDocumentSize();
    },


    /**
     * Reconfigures size of HTML element to window inner sizes. This
     * fixes some issues discovered in PhoneGap where a 100% size includes the
     * status bar sitting on top of every application.
     */
    __setupDocumentSize : function()
    {
      if (unify.bom.client.Extension.PHONEGAP && unify.bom.client.System.IOS)
      {
        // This is a client-side bugfix for this issue in PhoneGap on iPhone OS:
        // http://phonegap.lighthouseapp.com/projects/20116-iphone/tickets/51-uiwebview-viewport-larger-than-application-viewport
        var rootStyle = document.documentElement.style;
        rootStyle.width = window.innerWidth + "px";
        rootStyle.height = window.innerHeight + "px";
      }
    }
  },



  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function()
  {
    var unifyTouch;
    var unifyPostitionShift;
    if (unify.bom.client.System.ANDROID)
    {
      qx.bom.element.Class.add(document.documentElement, "android");
      unifyTouch = "wiggly";
      unifyPostitionShift = "2d";
    }
    else
    {
      unifyTouch = "precise";
      unifyPostitionShift = "3d";
    }

    qx.core.Environment.add("unify.touch", unifyTouch);
    qx.core.Environment.add("unify.positionshift", unifyPostitionShift);
  }
});
