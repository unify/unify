/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/* ************************************************************************

#require(unify.event.handler.Android)

************************************************************************ */

/**
 * Manager for navigation of typical iPhone-like applications.
 *
 * * Integrates with browser's history managment
 * * Structures the location using "/" as divider for views and ":" for separating parameters.
 * * Supports multiple ways of controlling the location.
 * * Support for TabView like navigation with deep inner navigation
 */
qx.Class.define("unify.view.mobile.NavigationManager",
{
  extend : qx.core.Object,
  type : "singleton",



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    // Initialize switch data
    this.__switchData = {};

    // Initialize path pool (two is enough, as only one is visible anytime)
    this.__pathPool = new qx.util.ObjectPool(5);

    //TODO: Variant for android
    if (unify.bom.client.System.ANDROID) {
      qx.event.Registration.addListener(document, "backKeyDown", this.__onAndroidBackButton, this);
    }
  },



  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired every time the path has changed */
    "navigate" : "unify.event.type.Navigate"
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __switchData : null,
    __pathPool : null,


    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the navigation path object
     *
     * @return {unify.view.mobile.NavigationPath} The path object
     */
    getPath : function() {
      return this.__path || null;
    },


    /**
     * Initialized previous state from history or client-side storage.
     *
     * Should be called by the application as soon as all views are registered.
     */
    init : function()
    {
      // Connect to history managment
      var History = unify.bom.History.getInstance();
      var ViewManager = unify.view.mobile.ViewManager.getInstance();
      History.addListener("change", this.__onHistoryChange, this);

      // Restore path from storage or use default view
      var path;
      if (window.localStorage) {
        path = localStorage["unify/navigationpath"];
      }

      if (!path) {
        path = ViewManager.getDefaultId();
      }

      History.init(path);
    },


    /**
     * Follows a HTML link or any element with <code>goto</code> attribute
     *
     * *General*
     *
     * Navigation is possible using the attribute <code>goto</code> and <code>rel</code>. Executing
     * methods on the current view is possible using the <code>exec</code>. These two special attributes
     * are only allowed on non-link elements.
     *
     * To execute commands just define the name of the method to execute as the value
     * of the <code>exec</code> attribute. The function to execute needs to be public on the
     * current view and will be executed in context of the view, but without any parameters.
     *
     * These are the supported "rel" attributes:
     *
     * <ul>
     * <li><strong>param</strong>: Replaces the param of the current view with the value from <code>goto</code>.</li>
     * <li><strong>up</strong>: Move one level up in structure. No <code>goto</code> supported.</li>
     * <li><strong>parent</strong>: Move into the given view (+param) but on the same parent (replacing the current view in structure).</li>
     * <li><strong>root</strong>: The given <code>goto</code> is processed in a way that it works as an absolute destination, completely ignoring the current position.</li>
     * <li><strong>swap</strong>: Swaps to the root view given by the <code>goto</code> attribute. Stores and restores position inside of this root view.</li>
     * </ul>
     *
     * The <code>goto</code> attribute might contain a name of a view,
     * a value or a complete path depending on the value of the
     * <code>rel</code> attribute.
     *
     * If no <code>rel</code> attribute is given, the view (+param) is appended to the current
     * path which results into a navigation deeper inside the structure.
     *
     * *Links*
     *
     * For typical HTML links only a subset of aboves features is available:
     *
     * <ul>
     * <li>open the link in a new window</li>
     * <li>enter a child view</li>
     * </ul>
     *
     * The behavior depends on whether the link begins with a "#" or not. The hash
     * symbol marks internal references like in normal HTML. A link to "#details" results
     * into a jump into the child view "details". A link to "http://www.google.com"
     * opens a new window/tab to the given external URL.
     *
     * @param link {Element} DOM element to follow
     */
    follow : function(link)
    {
      // Debug link processing time
      var start = +new Date;

      try
      {
        // Process simple links
        var href = link.getAttribute("href");
        if (href)
        {
          // this.debug("Follow HREF: " + href);

          if (href.indexOf("#") == 0) {
            this.enter(href.substring(1));
          } else {
            window.open(href);
          }
        }
        else
        {
          // Execute view commands
          var exec = link.getAttribute("exec");
          if (exec)
          {
            // this.debug("Follow EXEC: " + exec);
            this.exec(exec, link);
          }
          else
          {
            // Do advanced processing
            var path = link.getAttribute("goto");
            var rel = link.getAttribute("rel");

            // this.debug("Follow GOTO: " + path);

            if (rel == null)
            {
              this.enter(path);
            }
            else
            {
              var method = this.__followMapper[rel];
              if (method) {
                this[method](path);
              } else if (qx.core.Variant.isSet("qx.debug", "on")) {
                this.error("Unsupported 'rel' attribute: " + rel);
              }
            }
          }
        }
      }
      catch(ex)
      {
        this.error("Could not follow link " + (href||exec||rel));
        this.error(ex.message);
      }

      this.debug("Executed in: " + (new Date - start) + "ms");
    },


    /** {Map} Internal helper to map rel attributes to method names to execute */
    __followMapper :
    {
      param : "parametize",
      up : "up",
      parent : "replace",
      root : "jump",
      swap : "swap",
      segment : "segment"
    },




    /*
    ---------------------------------------------------------------------------
      USER API: LINK SUPPORT
    ---------------------------------------------------------------------------
    */

    /**
     * Jumps to the specified path without respecting current position.
     *
     * @param path {String} Any valid path
     */
    jump : function(path) {
      unify.bom.History.getInstance().jump(path);
    },


    /**
     * Executes the given function on the current view
     *
     * @param func {String} Name of function to execute (needs to be a public function!)
     * @param target {Element} DOM element which was clicked onto
     * @return {var} Return value of function to execute
     */
    exec : function(func, target)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (func.indexOf("_") == 0) {
          throw new Error("Could not execute protected or private methods: " + func);
        }
      }

      var view = unify.view.mobile.ViewManager.getInstance().getView();
      if (view && view[func]) {
        return view[func](target);
      } else if (qx.core.Variant.isSet("qx.debug", "on")) {
        throw new Error("Executing " + func + "() not supported by current view!");
      }
    },


    /**
     * Enters the specified view (+param). This leads deeper into the navigation
     * structure e.g. "root" + "page1" => "root/page1"
     *
     * @param view {String} View to enter (with optional param)
     */
    enter : function(view)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (view.indexOf("/") != -1) {
          throw new Error("Invalid path to dive into: " + view);
        }
      }

      unify.bom.History.getInstance().jump(this.__path + "/" + view);
    },


    /**
     * Switches in the current view to the given segment
     *
     * @param segment {String} Name of segment
     */
    segment : function(segment)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (segment.indexOf("/") != -1 || segment.indexOf(":") != -1 || segment.indexOf(".") != -1) {
          throw new Error("Invalid param for segment(): " + segment);
        }
      }

      var pool = this.__pathPool;

      // Create and configure clone
      var clone = pool.getObject(unify.view.mobile.NavigationPath);
      clone.setLocation(this.__path.getLocation());
      clone.setSegment(segment);

      // Jump in history
      unify.bom.History.getInstance().jump(clone.toString());

      // Pool clone
      pool.poolObject(clone);
    },


    /**
     * Paremetize the current view with the given parameter. This leads to a refreshment
     * of the current view.
     *
     * @param param {String|Number} Any valid param
     */
    parametize : function(param)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (param.indexOf("/") != -1 || param.indexOf(":") != -1 || param.indexOf(".") != -1) {
          throw new Error("Invalid param for parametize(): " + param);
        }
      }

      var pool = this.__pathPool;

      // Create and configure clone
      var clone = pool.getObject(unify.view.mobile.NavigationPath);
      clone.setLocation(this.__path.getLocation());
      clone.setParam(param);

      // Jump in history
      unify.bom.History.getInstance().jump(clone.toString());

      // Pool clone
      pool.poolObject(clone);
    },


    /**
     * Replaces current view with the given view (+param) on the same parent
     *
     * @param view {String} Any valid view (with optional params)
     */
    replace : function(view)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (view.indexOf("/") != -1) {
          throw new Error("Invalid view for replace(): " + view);
        }
      }

      var current = this.__path.toString();
      var pos = current.lastIndexOf("/");
      if (pos > 0) {
        view = current.substring(0, pos+1) + view;
      }

      unify.bom.History.getInstance().jump(view);
    },


    /**
     * Jumps up a segment in the history structure
     */
    up : function()
    {
      var current = this.__path.toString();
      var pos = current.lastIndexOf("/");
      if (pos > 0) {
        unify.bom.History.getInstance().jump(current.substring(0, pos));
      } else if (qx.core.Variant.isSet("qx.debug", "on")) {
        throw new Error("Could not go up further!");
      }
    },


    /**
     * Event listener for Android back button
     * 
     * @param e {qx.event.type.Event} Event object
     */
    __onAndroidBackButton : function(e)
    {
      var current = this.__path.toString();
      var pos = current.lastIndexOf("/");
      if (pos > 0) {
        // Go up in unify hierarchy
        this.up();
      } else {
        // Finish (native) activity
        if (DroidGap) {
          DroidGap.nativeBackButton();
        }
      }
    },


    /**
     * Switches the complete path to another path, but keeping the
     * original path in a cache to jump back to the complete structure.
     *
     * This feature is especially useful for TabViews where we have
     * some kind of sub-navigation in each Tab.
     *
     * @param view {String} Indentifier of view to switch to e.g. the name of the Tab
     */
    swap : function(view)
    {
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        if (view.indexOf("/") != -1 || view.indexOf(":") != -1 || view.indexOf(".") != -1) {
          throw new Error("Invalid view for swap(): " + view);
        }
      }

      var switchData = this.__switchData;

      // Store current location
      var oldPath = this.__path;
      var oldRootView = oldPath.getView(0);
      switchData[oldRootView] = oldPath.toString();

      // Jump to new location or to root, defending on current path
      var History = unify.bom.History.getInstance();
      var restore = switchData[view];
      if (restore && view != oldRootView) {
        History.jump(restore);
      } else {
        History.jump(view);
      }
    },





    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    __path : null,


    /**
     * Computes the differences between to {@link NavigationPath} and returns
     * a value describing these differences.
     *
     * * equal: both path are equal
     * * reset: current path is null
     * * initial: previous path is null
     * * swap: root view was changed via e.g. TabBar
     * * in: new path is deeper in hierarchy than previous one
     * * out: new path is lower in hiearchy than previous one
     * * replace: view was replaced with other view with same parent
     * * segment: only the segment in the view was replaced
     * * param: only the parameter of view was replaced
     * * null: other unknown change
     *
     * @param value {NavigationPath} Current path
     * @param old {NavigationPath} Previous path
     * @return {String} The computed mode
     */
    __computeMode : function(value, old)
    {
      if (value == old) {
        return "equal";
      }

      if (!value || !old)
      {
        if (value) {
          return "initial";
        } else {
          return "reset";
        }
      }

      if (value.toString() === old.toString()) {
        return "equal";
      } else if (value.getView(0) != old.getView(0)) {
        return "swap";
      } else if (value.getSize() != old.getSize()) {
        return value.getSize() < old.getSize() ? "out" : "in";
      } else if (value.getView() != old.getView()) {
        return "replace";
      } else if (value.getSegment() != old.getSegment()) {
        return "segment";
      } else if (value.getParam() != old.getParam()) {
        return "param";
      } else {
        return null;
      }
    },


    /**
     * Reacts on changes of the browser history.
     *
     * @param e {unify.event.type.History} History event
     */
    __onHistoryChange : function(e)
    {
      var History = e.getTarget();
      var ViewManager = unify.view.mobile.ViewManager.getInstance();

      // Quick check: Don't allow empty paths
      var loc = window.decodeURI(e.getLocation());
      if (loc == "")
      {
        this.warn("Ignoring empty path");
        return;
      }

      // Get path objects
      var pool = this.__pathPool;
      var old = this.__path;
      var path = pool.getObject(unify.view.mobile.NavigationPath);

      // Update pooled instance
      path.setLocation(loc);

      // Validation check for path
      if (!path.isValid())
      {
        if (!this.__path)
        {
          this.warn("Path is invalid. Using default view.");
          path.setLocation(ViewManager.getDefaultId());
        }
        else if (qx.core.Variant.isSet("qx.debug", "on"))
        {
          this.debug("Path is invalid. Keeping location.");
          return;
        }
      }

      // Fill in default segment if missing
      if (path.getSegment() == null)
      {
        var view = ViewManager.getById(path.getView());
        if (view)
        {
          var defaultSegment = view.getDefaultSegment();
          if (defaultSegment != null)
          {
            // TODO: Implement via path-cloning
            History.jump(path + "." + defaultSegment);
            pool.poolObject(path);
            return;
          }
        }
      }

      // Store new path
      this.__path = path;

      // Store on machine as well
      if (window.localStorage)
      {
        try
        {
          // deleting first is required on iPad with OS 3.2
          delete localStorage["unify/navigationpath"];
          localStorage["unify/navigationpath"] = window.decodeURI(loc);
        }
        catch(ex) {
          this.warn("Could not store path: " + ex);
        }
      }

      // Fire event
      var mode = this.__computeMode(path, old);
      this.fireEvent("navigate", unify.event.type.Navigate, [path, mode]);

      // Free old object
      if (old) {
        pool.poolObject(old);
      }
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    var History = unify.bom.History.getInstance();
    History.removeListener("change", this.__onHistoryChange, this);
  }
});
