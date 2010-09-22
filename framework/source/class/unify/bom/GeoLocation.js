/* ***********************************************************************************************

    Unify Project
    
    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * This class allows interacting with Geolocation support. It dynamically
 * supports different native implementions like available through HTML5,
 * Google Gears, Adobe AIR or PhoneGap.
 */
qx.Class.define("unify.bom.GeoLocation",
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

    // Wrap functions to execute in context of the instance
    var Func = qx.lang.Function;
    this.__onLocationFoundWrapped = Func.bind(this.__onLocationFound, this);
    this.__onLocationFailedWrapped = Func.bind(this.__onLocationFailed, this);
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /** Fired when the location data was successfully updated. */
    updated : "qx.event.type.DataEvent",

    /**
     * Fired when the location could not be gathered (through missing
     * support or errors while detecting).
     */
    failed : "qx.event.type.Event"
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Fires "locationUpdate" when the location data was updated.
     *
     * Converts native pseudo event into qooxdoo event which is fired
     * on this application class.
     *
     * @param position {Map} Current position data
     */
    __onLocationFound : function(position) {
      this.fireDataEvent("updated", position);
    },


    /**
     * Fires "locationFailed" when the location data was not successfully gathered.
     *
     * Converts native pseudo event into qooxdoo event which is fired
     * on this application class.
     */
    __onLocationFailed : function() {
      this.fireEvent("failed");
    },


    /**
     * This method might be call to refresh the stored location of the device.
     *
     * In cases where the device do not support location awareness or the
     * feature fails somehow a "locationFailed" event is fired. Otherwise a "locationUpdated"
     * event will be fired.
     *
     * Keep in mind that location detection might take a while and happens
     * asynchronous to the method call.
     */
    retrieve : function()
    {
      var geo = navigator.geolocation;
      if (geo)
      {
        geo.getCurrentPosition(this.__onLocationFoundWrapped, this.__onLocationFailedWrapped);
      }
      else
      {
        this.fireEvent("failed");
      }
    }
  }
});
