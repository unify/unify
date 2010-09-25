/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ************************************************************************

#require(unify.event.handler.Orientation)
#require(unify.event.handler.Transition)
#require(unify.event.handler.Touch)
#require(qx.log.appender.Native)

************************************************************************ */

/**
 * Application class for mobile devices.
 *
 * Includes support for:
 *
 * * Integration of view managment
 * * Dashboard Icon Configuration
 * * Activity Managment
 * * Dependency Managment with separate "run" phase of applications
 * * Loading of core CSS files
 */
qx.Class.define("unify.application.Mobile",
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

      // Error handling
      qx.event.GlobalError.setErrorHandler(function(ex) {
        qx.log.Logger.error("" + ex);
      });

      // Display build time
      this.info("Build Time: " + new Date(qx.$$build));

      // Configure document
      this.__setupDocumentSize();

      // Event listeners
      var Registration = qx.event.Registration;
      Registration.addListener(window, "resize", this.__onResize, this);
      Registration.addListener(window, "rotate", this.__onRotate, this);

      Registration.addListener(document.body, "click", this.__onClick, this);
      Registration.addListener(document.body, "tap", this.__onTap, this);
      Registration.addListener(document.body, "touchhold", this.__onTouchHold, this);
      Registration.addListener(document.body, "touchrelease", this.__onTouchRelease, this);
    },



    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the root DOM element. Normally the document's body.
     *
     * @return {Element} The root DOM element
     */
    getRoot : function() {
      return document.body;
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



    /*
    ---------------------------------------------------------------------------
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /** {Boolean} Whether the app is following a link */
    __following : null,


    /** {String} CSS selector with elements which are followable by the navigation manager */
    __followable : "a[href],[rel],[goto],[exec]",


    /**
     * Prevents clicks from executing native behavior
     * 
     * @parm e {qx.event.type.Mouse} Mouse event object
     */
    __onClick : function(e)
    {
      var elem = qx.dom.Hierarchy.closest(e.getTarget(), "a[href]");
      if (elem) {
        e.preventDefault();
      }
    },


    /**
     * Modifies click handling to include the context of the current view
     *
     * @param e {qx.event.type.Touch} Touch event
     */
    __onTap : function(e)
    {
      if (this.__following)
      {
        this.warn("Application is still following...")
        return;
      }
      else if (unify.ui.mobile.LayerManager.getInstance().isRunning())
      {
        this.warn("LayerManager animation is running...")
        return;
      }

      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem)
      {
        // Stop further event processing
        e.stopPropagation();

        // Mark as following (read: active)
        this.__following = true;

        // Whether we need to handle selection
        if (elem.hasAttribute("goto") && !elem.hasAttribute("rel"))
        {
          // Add CSS class for selection highlighting
          unify.ui.mobile.LayerManager.getInstance().select(elem);

          // Lazy further processing
          qx.lang.Function.delay(this.__onTapFollow, 0, this, elem);
        }
        else
        {
          // Directly follow
          this.__onTapFollow(elem);
        }
      }
    },


    /**
     * Used for lazy execution of tap event (to render highlighting of selection first)
     *
     * @param elem {Element} Element which was tapped onto
     */
    __onTapFollow : function(elem)
    {
      unify.view.mobile.NavigationManager.getInstance().follow(elem);

      // Lazy further processing
      // Give the device some time for painting, garbage collection etc.
      // This omits an overload and execution stop during intensive phases.
      // Especially important on slower devices.
      qx.lang.Function.delay(this.__onTapDone, 300, this, +new Date);
    },


    /**
     * Called when tap is rendered
     *
     * @param start {Date} Render start time
     */
    __onTapDone : function(start)
    {
      this.debug("Painted in: " + (new Date - start - 300) + "ms");
      this.__following = false;
    },


    /**
     * Executed on every touch hold event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchHold : function(e)
    {
      if (this.__following) {
        return;
      } else if (unify.ui.mobile.LayerManager.getInstance().isRunning()) {
        return;
      }

      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element2.Class.add(elem, "pressed");
      }
    },


    /**
     * Executed on every touch release event
     *
     * @param e {unify.event.type.Touch} Touch event
     */
    __onTouchRelease : function(e)
    {
      if (this.__following) {
        return;
      } else if (unify.ui.mobile.LayerManager.getInstance().isRunning()) {
        return;
      }

      var elem = qx.dom.Hierarchy.closest(e.getTarget(), this.__followable);
      if (elem) {
        qx.bom.element2.Class.remove(elem, "pressed");
      }
    },


    /**
     * Applies an attribute to the document's body (the application root)
     * named "orient" which is set to "landscape" or "portrait" depending
     * on the current device orientation.
     *
     * @param e {unify.event.type.Orientation} Orientation change event
     */
    __onRotate : function(e) {
      document.documentElement.setAttribute("orient", e.getMode());
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
      var System = unify.bom.client.System;
      if (unify.bom.client.Extension.PHONEGAP && System.IOS)
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
    if (unify.bom.client.System.ANDROID) {
      qx.bom.element.Class.add(document.documentElement, "android");
      unifyTouch = "wiggly";
      unifyPostitionShift = "2d";
    } else {
      unifyTouch = "precise";
      unifyPostitionShift = "3d";
    }
    qx.core.Variant.define("unify.touch", ["precise","wiggly"], unifyTouch);
    qx.core.Variant.define("unify.postitionshift", ["3d","2d","position"], unifyPostitionShift);
  }
});
