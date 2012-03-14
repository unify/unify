/* ***********************************************************************************************

    Unify Project

    Homepage: unify-project.org
    License: MIT + Apache (V2)
    Copyright: 2009-2010 Deutsche Telekom AG, Germany, http://telekom.com

*********************************************************************************************** */
/**
 * URI parser and builder class.
 */
core.Class("unify.util.Uri", {

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param str {Object?null} Initial URI to parse
   */
  construct : function(str)
  {
    if (str != null)
    {
      var parsed = unify.bom.Uri.parse(str);
      var props = [ "protocol", "user", "password", "host", "port", "path", "anchor" ];
      var key, value;

      for (var i=0, l=props.length; i<l; i++)
      {
        key = props[i];
        value = parsed[key];
        if (value != null && value != "") {
          this.set(key, value);
        }
      }

      if (parsed.query) {
        this.__params = parsed.query;
      }
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Any supported protocol e.g. "http", "ftp", "https", etc.
     */
    protocol : {
      type : "String",
      nullable : true
    },

    /**
     * A user name for basic authentification
     */
    user : {
      type : "String",
      nullable : true
    },

    /**
     * A password for basic authentification
     */
    password : {
      type : "String",
      nullable : true
    },

    /**
     * The hostname to connect
     */
    host : {
      type : "String",
      nullable : true
    },

    /**
     * The post on the host to connect to.
     */
    port : {
      type : "String",
      nullable : true
    },

    /**
     * The path on the host to send the request to.
     */
    path : {
      type : "String",
      nullable : true
    },

    /**
     * A anchor to show (mainly useful for web sites only)
     */
    anchor : {
      type : "String",
      nullable : true
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
     * Converts a URI to a {@link unify.util.Uri} instance.
     *
     * @param str {Object} URI string
     * @return {unify.util.Uri} Instance of this class.
     */
    fromString : function(str) {
      return new unify.util.Uri(str);
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __params : null,


    /**
     * Clones the URI object
     *
     * @return {unify.util.Uri} URI Object
     */
    clone : function()
    {
      var clone = this.base(arguments);

      if (this.__params) {
        clone.__params = qx.lang.Object.clone(this.__params);
      }

      return clone;
    },


    /**
     * Adds a HTTP GET parameter to the URI
     *
     * @param name {String} Name of the parameter
     * @param value {String} Value of the parameter
     * @return {unify.util.Uri} This instance - for chaining proposes.
     */
    addParam : function(name, value)
    {
      if (core.Env.getValue("debug"))
      {
        if (typeof value !== "string") {
          throw new Error("Value needs to be a string!");
        }
      }

      var data = this.__params;
      if (!data) {
        this.__params = data = {};
      }

      data[name] = value;
      return this;
    },


    /**
     * Removes a given parameter from the URI
     *
     * @param name {String} Name of the parameter
     * @return {unify.util.Uri} This instance - for chaining proposes.
     */
    removeParam : function(name)
    {
      var data = this.__params;
      if (data) {
        delete data[name];
      }
      return this;
    },


    /**
     * Returns the value of the given parameter.
     *
     * @param name {String} Value of the parameter.
     */
    getParam : function(name)
    {
      var data = this.__params;
      if (!data) {
        return null;
      }

      var value = data[name];
      return value === undefined ? null : value;
    },


    /**
     * Returns a string representation of the Uri instance.
     *
     * @return {String} Converted URI
     */
    toString : function()
    {
      var result = [];
      var value;

      value = this.getProtocol();
      if (value != null && value !== "") {
        result.push(value, "://");
      }

      value = this.getUser();
      if (value != null && value !== "")
      {
        result.push(value);
        value = this.getPassword();
        if (value != null && value !== "") {
          result.push(":", value);
        }

        result.push("@");
      }

      value = this.getHost();
      if (value != null && value !== "") {
        result.push(value);
      }

      value = this.getPort();
      if (value != null && value !== "") {
        result.push(":", value);
      }

      value = this.getPath();
      if (value != null && value !== "") {
        result.push(value);
      }

      value = this.__params;
      if (value != null && value !== "")
      {
        var query = [];
        for (var key in value) {
          query.push(encodeURIComponent(key) + "=" + encodeURIComponent(value[key]));
        }

        if (query.length > 0) {
          result.push("?", query.join("&"));
        }
      }

      value = this.getAnchor();
      if (value != null && value !== "") {
        result.push("#", value);
      }

      return result.join("");
    }
  }
});
