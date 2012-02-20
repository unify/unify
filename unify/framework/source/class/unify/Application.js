/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/* ************************************************************************

#require(qx.event.handler.Orientation)
#require(qx.event.handler.Transition)
#require(qx.event.handler.Mouse)
#require(qx.event.handler.Touch)
#require(qx.log.appender.Native)


************************************************************************ */

/**
 * Application class for next generation devices.
 */
core.Class("unify.Application", {
  
  include : [unify.core.Init],
  
  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __root : null,
    
    /*
    ---------------------------------------------------------------------------
      APPLICATION CORE
    ---------------------------------------------------------------------------
    */

    // overridden
    main : function() {

      // Global error handling (otherwise we see nothing in PhoneGap)
      /* TODO: if (qx.core.Environment.get("phonegap"))
      {
        qx.event.GlobalError.setErrorHandler(function(ex) {
          qx.log.Logger.error("" + ex);
        });
      }*/

      // Display build time
      var buildTime = core.Env.getValue("unify.$$build");
      if (buildTime) {
        this.info("Build Time: " + new Date(buildTime));
      }

      var theme = this._getTheme();
      if (theme) {
        unify.theme.Manager.register(theme.name(), theme);
        unify.theme.Manager.setTheme(theme.name());
      }

      var rootElement = this._getRootElement();
      var rootLayout = this._getRootLayout();
      lowland.bom.Events.set(rootElement, "click", this.__onClick.bind(this));
      var root = this.__root = new unify.view.Root(rootElement, this._getRootEventElement(), rootLayout);
      core.bom.Style.set(rootElement, "visibility", "hidden");
      
      // Add box sizing css node
      var st = document.createElement("style");
      st.type = "text/css";
      var prop = core.bom.Style.property("boxSizing").hyphenate();
      st.innerHTML = " * { " + prop + ": border-box; } ";
      document.head.appendChild(st);
      
      // Support focus handling
      //TODO: unify.ui.core.FocusHandler.getInstance().connectTo(root);

      // Configure document
      var Style = core.bom.Style;
      var rootStyle = unify.theme.Manager.get().resolveStyle("BODY") || {};
      Style.set(rootElement, rootStyle);
      
      // <html>
      Style.set(rootElement.parentNode, {
        width : "100%",
        height : "100%",
        overflow : "hidden",
        padding : 0
      });
      
      this.__setupDocumentSize();

      // Event listeners
      lowland.bom.Events.set(window, "resize", this.__onResize.bind(this));
      lowland.bom.Events.set(window, "orientationchange", this.__onRotate.bind(this));
      /*
      if (qx.core.Environment.get("os.name") == "webos") {
        var palmSystem = window.PalmSystem;
        if (palmSystem) {
          palmSystem.stageReady();
        } else {
          this.warn("window.PalmSystem not found");
        }
      }*/
    },
    
    // overridden
    finalize : function() {
      //qx.bom.element.Style.set(this._getRootElement(), "visibility", "visible");
    },

    

    /**
     * Returns the root DOM element.
     * To switch to another root element overwrite this function with your own implementation.
     *
     * @return {Element} DOM element that is the root for this application
     */
    _getRootElement : function() {
      return document.body;
    },
    
    _getTheme : function() {
      if (core.Env.getValue("debug")) {
        throw new Error(this.toString() + " needs implementation for _getTheme()!");
      }
    },
    
    /**
     * Returns the root event DOM element.
     * To switch to another root event element overwrite this function with your own implementation.
     *
     * @return {Element} DOM element that is the event root for this application
     */
    _getRootEventElement : function() {
      return document.documentElement;
    },

    /**
     *  Returns the layout for the root view.
     *  Defaults to canvas, override this function with your own implementation if you want a different layout
     *
     *  @return {qx.ui.layout.Abstract} layout
     */
    _getRootLayout : function(){
      return new unify.ui.layout.Canvas();
    },
    
    /**
     * Returns the root widget element
     *
     * @return {unify.view.Root} Root widget
     */
    getRoot : function() {
      return this.__root;
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
      this.__root.add(viewManager, {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      });
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
     * Prevent clicking on <a> tags to stop browser from relocate to another website
     *
     * @param e {Event} Native click event
     */
    __onClick : function(e) {
      // Prevent click on href
      /* TODO: var target = qx.bom.Event.getTarget(e);
      var elem = unify.bom.Hierarchy.closest(target, "a[href]");
      if (elem) {
        e.preventDefault();
      }*/
    },
    

    /**
     * Applies an attribute to the document's body (the application root)
     * named "orient" which is set to "landscape" or "portrait" depending
     * on the current device orientation.
     *
     * @param e {qx.event.type.Orientation} Orientation change event
     */
    __onRotate : function(e) {
      /* TODO : var orient=qx.bom.Viewport
      this._getRootElement().setAttribute("orient", e.isLandscape()?"landscape":"portrait");*/
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
      /* TODO: if (qx.core.Environment.get("phonegap") && qx.core.Environment.get("os.name") == "ios")
      {
        // This is a client-side bugfix for this issue in PhoneGap on iPhone OS:
        // http://phonegap.lighthouseapp.com/projects/20116-iphone/tickets/51-uiwebview-viewport-larger-than-application-viewport
        var rootStyle = document.documentElement.style;
        rootStyle.width = window.innerWidth + "px";
        rootStyle.height = window.innerHeight + "px";
      }*/
    }
  }//,



  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */
/*
  defer : function()
  {
    var unifyTouch;
    var unifyPostitionShift;
    if (qx.core.Environment.get("os.name") == "android")
    {
      qx.bom.element.Class.add(document.documentElement, "android");
      unifyPostitionShift = "2d";
    }
    else
    {
      unifyPostitionShift = "3d";
    }

    qx.core.Environment.add("unify.positionshift", unifyPostitionShift);
  }*/
});
