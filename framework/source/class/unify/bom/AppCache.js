/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * HTML5 AppCache Integration
 */
qx.Class.define("unify.bom.AppCache",
{
  extend: qx.core.Object,
  type : "singleton",



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    if (this.isSupported())
    {
      this.debug("HTML5 AppCache is supported!");

      if (this.isCached())
      {
        this.debug("Loaded from application cache.");
      } else {
        this.debug("Loaded from network.");
      }

      this.__initObserver();
    }
    else
    {
      this.debug("HTML5 AppCache is NOT supported!");
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members:
  {
    __onEventWrapped : null,

    __status :
    {
      0 : "uncached",
      1 : "idle",
      2 : "checking",
      3 : "downloading",
      4 : "updateready"
    },


    /*
    ---------------------------------------------------------------------------
      USER API
    ---------------------------------------------------------------------------
    */

    /**
     * Whether the application cache (a specific HTML5 feature) is supported.
     *
     * @return {Boolean} <code>true</code> when HTML5 AppCache is supported.
     */
    isSupported : function() {
      return !!window.applicationCache;
    },


    /**
     * Whether the application was loaded from HTML 5 AppCache.
     *
     * @return {Boolean} <code>true</code> when the application was loaded from cache.
     */
    isCached: function()
    {
      /**
       * 0 - UNCACHED
       * 1 - IDLE
       * 2 - CHECKING
       * 3 - DOWNLOADING
       * 4 - UPDATEREADY
       *
       * See also:
       * http://google-code-updates.blogspot.com/2009/05/gmail-for-mobile-html5-series-part-2.html
       */

      var Cache = window.applicationCache;
      return Cache && Cache.status != 0;
    },


    /**
     * Force update the HTML 5 AppCache.
     *
     * @return {Boolean} <code>true</code> when the cache was updated successfully.
     */
    update: function()
    {
      var Cache = window.applicationCache;
      if (!Cache)
      {
        this.debug("Application Cache is not supported or disabled on this client!")
        return false;
      }

      try
      {
        this.info("Running update");
        this.debug("Status: " + this.__status[Cache.status]);
        Cache.update();
        this.debug("Initialized update!");
      }
      catch (ex)
      {
        this.warn("Update failed: Please verify that there is a valid manifest file attached!");
        this.warn("Message: " + ex);
        return false;
      }

      return true;
    },




    /*
    ---------------------------------------------------------------------------
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */

    /**
     * Binds all supported native events to internal event dispatcher.
     */
    __initObserver : function()
    {
      this.__onEventWrapped = qx.lang.Function.bind(this.__onEvent, this);

      var Cache = window.applicationCache;
      Cache.addEventListener("checking", this.__onEventWrapped, false);
      Cache.addEventListener("error", this.__onEventWrapped, false);
      Cache.addEventListener("noupdate", this.__onEventWrapped, false);
      Cache.addEventListener("downloading", this.__onEventWrapped, false);
      Cache.addEventListener("progress", this.__onEventWrapped, false);
      Cache.addEventListener("updateready", this.__onEventWrapped, false);
      Cache.addEventListener("cached", this.__onEventWrapped, false);
      Cache.addEventListener("obsolete", this.__onEventWrapped, false);
    },


    /**
     * Disconnect all supported native events from internal event dispatcher.
     */
    __stopObserver : function()
    {
      var Cache = window.applicationCache;
      Cache.removeEventListener("checking", this.__onEventWrapped, false);
      Cache.removeEventListener("error", this.__onEventWrapped, false);
      Cache.removeEventListener("noupdate", this.__onEventWrapped, false);
      Cache.removeEventListener("downloading", this.__onEventWrapped, false);
      Cache.removeEventListener("progress", this.__onEventWrapped, false);
      Cache.removeEventListener("updateready", this.__onEventWrapped, false);
      Cache.removeEventListener("cached", this.__onEventWrapped, false);
      Cache.removeEventListener("obsolete", this.__onEventWrapped, false);
    },


    /**
     * Not yet used. Planned for HTML 5 AppCache support.
     *
     * @param e {Event} Native event object
     */
    __onEvent : function(e)
    {
      var type = e.type;
      this.debug("Fired " + type + " event");
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this.__stopObserver();
  }
});
