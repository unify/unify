/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/

/**
 * Application class for next generation devices.
 * 
 * #require(ext.sugar.String)
 */
core.Class("unify.Application", {
  
  include : [unify.core.Init],
  
  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  construct : function() {
    unify.core.Init.call(this);
    
    if (window.location.search.indexOf("testid=true") > 0) {
      core.Env.define("unify.testid", true);
    }
  },
  
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
      /* TODO: if (core.Env.getValue("phonegap"))
      {
        GlobalError.setErrorHandler(function(ex) {
          console.error("" + ex);
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
      var viewportElement = this._getViewportElement();
      this.addNativeListener(rootElement, "click", this.__onClick, this);
      //lowland.bom.Events.set(rootElement, "click", this.__onClick.bind(this));
      this.__root = new unify.view.Root(rootElement, this._getRootEventElement(), viewportElement, rootLayout);
      core.bom.Style.set(rootElement, "visibility", "hidden");
      
      // Add box sizing css node
      var st = document.createElement("style");
      var prop = core.bom.Style.property("boxSizing").hyphenate();
      var rule = document.createTextNode(" * { " + prop + ": border-box; } ");
      st.type = "text/css";
      if (st.styleSheet) {
        st.styleSheet.cssText = rule.nodeValue;
      } else {
        st.appendChild(rule);
      }
      document.head.appendChild(st);
      
      // Support focus handling
      //TODO: unify.ui.core.FocusHandler.getInstance().connectTo(root);

      // Configure document
      var Style = core.bom.Style;
      var rootStyle = unify.theme.Manager.get().resolveStyle("BODY") || {};
      Style.set(rootElement, rootStyle);
      if (rootStyle.font) {
        Style.set(rootElement, unify.theme.Manager.get().resolveFont(rootStyle.font));
      }
      
      // <html>
      Style.set(rootElement.parentNode, {
        width : "100%",
        height : "100%",
        overflow : "hidden",
        padding : 0
      });
      
      this.__setupDocumentSize();

      // Event listeners
      this.addNativeListener(window, "resize", this.__onResize, this);
      this.addNativeListener(document, "touchmove", function(e) { e.preventDefault(); }, this);
      this.addNativeListener(window, "orientationchange", this.__onRotate, this);
      /*
      if (core.Env.getValue("os.name") == "webos") {
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
      core.bom.Style.set(this._getRootElement(), "visibility", "visible");
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
    
    /**
     * {Element} Returns viewport element all popovers and out of layout widgets are bound to.
     */
    _getViewportElement : function() {
      return this._getRootElement();
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
     *  @return {unify.ui.layout.Base} layout
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
    
    __viewAnimationManager : null,
    
    _getViewAnimationManager : function() {
      return new unify.view.animation.IOSAnimationManager();
    },
    
    getViewAnimationManager : function() {
      var vam = this.__viewAnimationManager;
      if (!vam) {
        vam = this.__viewAnimationManager = this._getViewAnimationManager();
      }
      
      return vam;
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
      /* TODO: var target = e.target;
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
     * @param e {lowland.events.DataEvent} Orientation change event
     */
    __onRotate : function(e) {
      /* TODO : 
      this._getRootElement().setAttribute("orient", e.isLandscape()?"landscape":"portrait");*/
    },


    /**
     * Fired whenever the windows is resized or the orientation is changed.
     *
     * @param e {lowland.events.Event} Resize event
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
      /* TODO: if (core.Evn.getValue("phonegap") && core.Evn.getValue("os.name") == "ios")
      {
        // This is a client-side bugfix for this issue in PhoneGap on iPhone OS:
        // http://phonegap.lighthouseapp.com/projects/20116-iphone/tickets/51-uiwebview-viewport-larger-than-application-viewport
        var rootStyle = document.documentElement.style;
        rootStyle.width = window.innerWidth + "px";
        rootStyle.height = window.innerHeight + "px";
      }*/
    }
  }
});
