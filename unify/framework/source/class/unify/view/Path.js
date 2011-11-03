/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */

/**
 * Class to manage an in-application path.
 *
 * A Path is basically an array which is somewhat comparable to a typical Unix path. It uses
 * "/" for dividing path fragments. Each fragments might contain information about a view
 * (the class you look at), a segment (a e.g. tab selected inside the view) and a param (the
 * selected email ID etc.).
 */
qx.Class.define("unify.view.Path",
{
  extend : qx.type.BaseArray,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Deep clones a Path instance.
     *
     * @return {unify.view.Path} Returns the deeply cloned Path instance.
     */
    clone : function()
    {
      var clone = new unify.view.Path;
      var entry;
      for (var i=0, l=this.length; i<l; i++)
      {
        entry = this[i];
        clone.push({
          view : entry.view,
          segment : entry.segment,
          param : entry.param
        });
      }

      return clone;
    },


    /**
     * Serializes a Path object into a location string. The result
     * can be re-used for {@link unify.view.Path.fromString}.
     *
     * @return {String} Location string
     */
    serialize : function()
    {
      var result = [];
      var part, temp;
      for (var i=0, l=this.length; i<l; i++)
      {
        part = this[i];
        temp = part.view;
        if (part.segment) {
          temp += "." + part.segment;
        }
        if (part.param) {
          temp += ":" + part.param;
        }
        result.push(temp)
      }

      return result.join("/");
    }
  },



  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Converts a location string into a path object.
     *
     * Format is "fragment1/fragment2/fragment3".
     * Each fragment has the format "view.segment:param".
     *
     * @param str {String} A location string with supported special charaters
     * @return {unify.view.Path} Returns the path object
     */
    fromString : function(str)
    {
      var obj = new unify.view.Path;

      if (str.length > 0)
      {
        var fragments = str.split("/");
        for (var i=0, l=fragments.length; i<l; i++) {
          obj.push(this.parseFragment(fragments[i]));
        }
      }

      return obj;
    },


    /** {RegExp} Matches location fragments (view.segment:param) */
    __fragmentMatcher : /^([a-z0-9-]+)?(\.([a-z-]+))?(\:([a-zA-Z0-9_-]+))?$/,


    /**
     * Parses a location fragment into a object with the keys "view", "segment" and "param".
     *
     * @param fragment {String} Location fragment to parse
     * @return {Map} The parsed fragment.
     */
    parseFragment : function(fragment)
    {
      var match = this.__fragmentMatcher.exec(fragment);
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!match) {
          throw new Error("Invalid location fragment: " + fragment);
        }
      }

      return {
        view : RegExp.$1 || null,
        segment : RegExp.$3 || null,
        param : RegExp.$5 || null
      };
    },
    
    chunkEquals : function(a, b) {
      if (!a || !b) {
        return false;
      }
      return (a.view == b.view && a.segment == b.segment && a.param == b.param);
    }
  }
});
