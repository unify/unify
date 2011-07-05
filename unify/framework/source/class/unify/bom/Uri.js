/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * Deals with client specific URI support e.g. which are opened
 * in another native application by default. For desktop web browsers
 * this is typically the "mailto:" link, for richer handhelds like the
 * iPhone or Android-based devices these are a few more.
 */
qx.Class.define("unify.bom.Uri",
{
  statics :
  {
    /*
    ---------------------------------------------------------------------------
      URL PARSER
    ---------------------------------------------------------------------------
    */

    /** {Array} List of all URL segments */
    __keys : ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","querystr","anchor"],

    /** {Map} Contains different URL parsers (differ in validity) */
    __urlParsers :
    {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    },

    __queryParser : /(?:^|&)([^&=]*)=?([^&]*)/g,
    __querySpace : /%20/g,


    /**
     * Parses a string into a simple JavaScript Object.
     *
     * @param str {String} URI string
     * @param mode {String?"loose"} One of "loose" or "strict".
     * @return {Map} JavaScript map containing the separated infos of the URI string.
     *     These are the available keys: "source", "protocol", "authority", "userInfo", "user",
     *     "password", "host", "port", "relative", "path", "directory", "file", "querystr", "query" and "anchor".
     */
    parse : function(str, mode)
    {
      var parser = this.__urlParsers[mode||"loose"];
      if (qx.core.Environment.get("qx.debug"))
      {
        if (!parser) {
          throw new Error("Invalid mode: " + mode);
        }
      }

      var keys = this.__keys;
      var matches = parser.exec(str);
      var result = {};

      for (var i=0, l=keys.length; i<l; i++) {
        result[keys[i]] = matches[i] || "";
      }

      // Post parse query string
      result.query = this.parseQuery(result.querystr);

      return result;
    },


    /**
     * Parses a query string into a simple JavaScript Object.
     *
     * @param str {String} Query string
     * @return {Map} JavaScript map containing the key-value pairs given in the query string.
     */
    parseQuery : function(str)
    {
      var query = {};

      if (str != "")
      {
        if (str.charAt(0) === "?") {
          str = str.substring(1);
        }

        str.replace(this.__queryParser, function(match, key, value) {
          query[key] = value;
        });
      }

      return query;
    },


    /**
     * Builds a query string to send data via GET
     *
     * @param data {Map} Data to serialize.
     * @return {String} String to attach to any URL
     */
    buildQuery : function(data)
    {
      var value = "";
      var result = [];

      for (var key in data)
      {
        value = data[key];
        if (value != null && typeof value === "object") {
          value = value.toString();
        }

        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }

      return result.join("&").replace(this.__querySpace, "+");
    },




    /*
    ---------------------------------------------------------------------------
      NATIVE URLS
    ---------------------------------------------------------------------------
    */

    /**
     * {Array} Contains regular expressions for matching native URLs
     */
    __nativeUrlPatterns: (qx.core.Environment.get("os.name") == "ios") ? [
      new RegExp("^mailto:"),
      new RegExp("^tel:"),
      new RegExp("^http:\/\/maps.google.com\/maps\?"),
      new RegExp("^http:\/\/www.youtube.com\/watch\\?v="),
      new RegExp("^http:\/\/www.youtube.com\/v\/")
    ] : [
      new RegExp("^mailto:")
    ],


    /**
     * Returns whether the given URL leads to an native application
     * handling this type of URL. (iPhone specific)
     *
     * @param url {String} Any valid URL
     * @return {Boolean} Whether the given URL is a native URL
     */
    isNativeUrl: function(url)
    {
      var patterns = this.__nativeUrlPatterns;

      for(var i=0, l=patterns.length; i<l; i++)
      {
        if(url.match(patterns[i])) {
          return true;
        }
      }

      return false;
    }
  }
});
