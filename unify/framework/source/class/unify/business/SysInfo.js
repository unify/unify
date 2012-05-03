/*
===============================================================================================

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

===============================================================================================
*/
/**
 * Prepares system information data
 */
core.Class("unify.business.SysInfo",
{
  include : [unify.business.StaticData],


  /*
  ----------------------------------------------------------------------------
     CONSTRUCTOR
  ----------------------------------------------------------------------------
  */

  // overridden
  construct : function() {
    this.base(arguments);

    this._addService("basics");
    this._addService("env");
    this._addService("features");
  },



  /*
  ----------------------------------------------------------------------------
     MEMBERS
  ----------------------------------------------------------------------------
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      STATIC DATA INTERFACE
    ---------------------------------------------------------------------------
    */
    //TODO replace unify.bom.client usage with core.Env.getValue calls
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
          var Environment=core.Env;
          data =
          {
            "Runtime" :
            {
              "Platform" : unify.bom.client.Platform.NAME,
              "System" : unify.bom.client.System.TITLE,
              "Engine" : Environment.getValue('engine.name') + ' ' + Environment.getValue('engine.version'),
              "Browser" : Environment.getValue('browser.name')
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
      var result = {};
      var title;

      var firstUp = function(str) {
        return (str[0].toUpperCase() + str.substring(1));
      };

      for (var key in clazz)
      {
        if (key.toUpperCase() === key)
        {
          title = key.toLowerCase().split("_");
          for (var i=0, l=title.length; i<l; i++) {
            title[i] = firstUp(title[i]);
          }

          result[title.join(" ")] = clazz[key] && "Yes" || "No";
        }
      }

      return result;
    }
  }
});

unify.core.Singleton.annotate(unify.business.SysInfo);