/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Prepares system information data
 */
qx.Class.define("unify.business.SysInfo",
{
  extend : unify.business.StaticData,
  type : "singleton",


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  // overridden
  construct : function()
  {
    this.base(arguments);

    this._addService("basics");
    this._addService("env");
    this._addService("features");
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      STATIC DATA INTERFACE
    ---------------------------------------------------------------------------
    */

    // overridden
    _readData : function(service, params)
    {
      var data;

      switch(service)
      {
        case "basics":
          data =
          {
            "System" :
            {
              "Device" : unify.bom.client.Device.CATEGORY,
              "Type" : unify.bom.client.Runtime.TYPE
            },
            "Resolution" :
            {
              "Screen" : screen.width + "x" + screen.height,
              "Window" : window.innerWidth + "x" + window.innerHeight
            }
          };
          break;

        case "env":
          data =
          {
            "Runtime" :
            {
              "Platform" : unify.bom.client.Platform.NAME,
              "System" : unify.bom.client.System.TITLE,
              "Engine" : unify.bom.client.Engine.NAME + ' ' + qx.bom.client.Version.VERSION,
              "Browser" : qx.bom.client.Browser.TITLE
            },
            "Extensions" : this.__fromConstants(unify.bom.client.Extension)
          };
          break;

        case "features":
          data =
          {
            "Features" : this.__fromConstants(unify.bom.client.Feature),
            "Ajax" : this.__fromConstants(unify.bom.client.Ajax)
          };
          break;
      }

      return data;
    },



    /*
    ---------------------------------------------------------------------------
      INTERNALS
    ---------------------------------------------------------------------------
    */

    /**
     * Reads values from constants of the given class.
     * 
     * @param clazz {Class} Class to read from
     * @return {Map} Map of all constants
     */
    __fromConstants : function(clazz)
    {
      var String = qx.lang.String;
      var result = {};
      var title;

      for (var key in clazz)
      {
        if (key.toUpperCase() === key)
        {
          title = key.toLowerCase().split("_");
          for (var i=0, l=title.length; i<l; i++) {
            title[i] = String.firstUp(title[i]);
          }

          result[title.join(" ")] = clazz[key] && "Yes" || "No";
        }
      }

      return result;
    }
  }
});
