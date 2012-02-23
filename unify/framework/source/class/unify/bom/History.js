/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Newly written history managment optimized for Webkit (at the moment).
 *
 * * Supports back and forward events in history which is helpful for iPhone-like layer navigation.
 */
core.Class("unify.bom.History", {
  
  include : [unify.core.Object],
  
  /*
  *****************************************************************************
    CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    unify.core.Object.call(this);
    
    // Init callback
    this.__onCallbackWrapped = this.__onCallback.bind(this);

    // HTML5 hashchange supported by IE>=8, Firefox>=3.6, Webkit (!Safari 4)
    // See also: https://bugs.webkit.org/show_bug.cgi?id=21605
    // https://developer.mozilla.org/en/DOM/window.onhashchange
    /* TODO : if (qx.bom.Event.supportsEvent(window, "hashchange"))
    {
      if (core.Env.getValue("debug")) {
        this.debug("Using HTML5 hashchange");
      }
      qx.bom.Event.addNativeListener(window, "hashchange", this.__onCallbackWrapped);
    }
    else
    {*/
      if (core.Env.getValue("debug")) {
        console.debug("Using interval");
      }
      this.__intervalHandler = window.setInterval(this.__onCallbackWrapped, 100);
    //}
  },



  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired every time the history is modified */
    change : lowland.events.DataEvent //"unify.event.type.History"
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Returns the current location
     *
     * @return {String} Current location without leading "#"
     */
    getLocation : function() {
      return this.__location;
    },


    /**
     * Change hash to the given hash. Completely replaces current location.
     *
     * @param value {String} A valid URL hash without leading "#".
     */
    setLocation : function(value)
    {
      var old = this.__location;
      if (value != old)
      {
        this.__location = value;
        // TODO: this.fireEvent("change", unify.event.type.History, [value, old]);
        location.hash = "#" + encodeURI(value);
      }
    },


    /**
     * Should be called after the page is loaded to
     * show the the content based on the loaded hash
     * or go to the default screen.
     *
     * @param defaultPath {String} Default path to jump to,
     *   when no one is given through URL
     */
    init : function(defaultPath)
    {
      if (location.hash) {
        this.setLocation(decodeURI(location.hash.substring(1)));
      } else if (defaultPath != null) {
        this.setLocation(defaultPath);
      }
    },




    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /** {Timer} Handle for timeout */
    __intervalHandler : null,

    /** {Function} Wrapped callback method */
    __onCallbackWrapped : null,

    /** {String} Internal storage field for current location */
    __location : "",

    /**
     * Internal listener for interval. Used to check for history changes. Converts
     * the native changes to the instance and fires synthetic events to the outside.
     *
     * @param e {Event} Native interval event
     */
    __onCallback : function(e)
    {
      var value = decodeURI(location.hash.substring(1));
      var old = this.__location;

      if (value != old)
      {
        this.__location = value;
        //this.fireEvent("change", unify.event.type.History, [value, old]);
        this.fireEvent("change", value, old);
      }
    }
  }



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  /*destruct : function()
  {
    if (this.__intervalHandler)
    {
      clearInterval(this.__intervalHandler);
      this.__intervalHandler = null;
    }
  }*/
});

unify.core.Singleton.annotate(unify.bom.History);